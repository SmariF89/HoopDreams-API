var Moment = require('moment');
const { PickupGameExceedMaximumError,
        BasketballFieldClosedError,
        PickupGameOverlapError,
        PickupGameAlreadyPassedError,
        NotFoundError,
        ServerError,
        BadRequest,
        PlayerAlreadyInPickupGameError } = require('../errors');

module.exports = {
    queries: {
        allPickupGames: (parent, args, context) => new Promise((resolve, reject) => {
            const { PickupGame } = context;

            // Find all pickupGames.
            PickupGame.find({}, (err, pickupGames) => {
                if(err) { throw new ServerError(); }
            }).then(_pickupGames => {
                // If no pickupGames are found an empty array should be returned.
                if(_pickupGames.length == 0) { resolve([]); }
                else { resolve(_pickupGames); }
            }).catch(err => reject(err));
        }),
        pickupGame: (parent, args, context) => new Promise((resolve, reject) => {
            const { id } = args;
            const { PickupGame } = context;

            // Find pickupGame with specific id.
            PickupGame.findById(id, (err, pickupGame) => {
                if(err || pickupGame == null) { reject(new NotFoundError('pickupGameId not found')); }
                else { resolve(pickupGame); }
            });
        })
    },
    mutations: {
        createPickupGame: (parent, args, context) => new Promise((resolve, reject) => {
            const { start, end, basketballFieldId, hostId } = args.input;
            const { PickupGame, Player, basketballFieldService } = context;

            // Find player to host game.
            Player.findById(hostId, (err, player) => {
                // Incorrect Id form and thus non-existant
                if(err) { reject(new NotFoundError('hostId not found')); }
                else { return player; }
            }).then(_player => {
                // Correct id form but non-existant
                if(_player == null) { throw new NotFoundError('hostId not found'); }

                // Find all games scheduled on this basketballField.
                PickupGame.find({ location: basketballFieldId }, (err, pickupGamesOnSameBasketballField) => {
                    if(err) { throw new NotFoundError('basketballFieldId not found!'); }
                    return pickupGamesOnSameBasketballField;
                }).then(_pickupGamesOnSameBasketballField => {

                    // Check if game overlaps with any others on that basketballField.
                    const momentStart = new Moment(start);
                    const momentEnd = new Moment(end);
                    _pickupGamesOnSameBasketballField.forEach(pg => {
                        let iMomStart = new Moment(pg.start);
                        let iMomEnd = new Moment(pg.end);
                        if(momentStart.isBetween(iMomStart, iMomEnd) ||
                           momentEnd.isBetween(iMomStart, iMomEnd)   ||
                          (momentStart.isSameOrBefore(iMomStart) && momentEnd.isSameOrAfter(iMomEnd))) { throw new PickupGameOverlapError(`The game overlaps with another game: ${pg._id}`); }
                    });

                    basketballFieldService.getBasketballFieldById(basketballFieldId)
                    .then(_basketballField => {
                        if(!_basketballField) { throw new NotFoundError('BasketballFieldId not found!'); }
                        const basketballField = JSON.parse(_basketballField);

                        // Check if basketballField is closed.
                        if(basketballField.status === 'CLOSED') { throw new BasketballFieldClosedError(); }

                        // All requirements have been met. Create the pickupGame.
                        PickupGame.create({
                            start: momentStart,
                            end: momentEnd,
                            location: basketballFieldId,
                            host: hostId
                        }, (err, pickupGameCreated) => {
                            if(err) { reject(new BadRequest()); }
                            else {
                                momentStart.locale('is');
                                momentEnd.locale('is');
                                pickupGameCreated.start = momentStart.format('llll');
                                pickupGameCreated.end = momentEnd.format('llll');
                                resolve(pickupGameCreated);
                            }
                        });
                    }).catch(err => reject(err))
                }).catch(err => reject(err))
            }).catch(err => { throw err; } ).catch(err => reject(err));
        }),
        removePickupGame: (parent, args, context) => new Promise((resolve, reject) => {
            const { id } = args;
            const { PickupGame, Relation } = context;

            // Check if id for pickupGame exists.
            PickupGame.findById(id, (err, pickupGame) => {
                if(err || pickupGame == null) { reject(new NotFoundError('Id for pickupGame was not found')); }
                else {
                    // Remove pickupGame.
                    PickupGame.deleteOne({_id: id}, (err) => {
                        if(err) { reject(new ServerError('Failed to remove pickupGame on server.'));}
                        else {
                             // Remove all relations to pickupGame being removed.
                            Relation.deleteMany({pickupGameId: id}, (err, doc) => {
                                if(err) { reject(new ServerError('Failed to remove relations for pickupGame on server.'));}
                                else { resolve(true); }
                            })
                        }
                    })
                }
            });
        }),
        addPlayerToPickupGame: (parent, args, context) => new Promise((resolve, reject) => {
            const { playerId, pickupGameId } = args.input;
            const { PickupGame, Player, Relation, basketballFieldService } = context;

            // Check if id of player exists.
            Player.findById(playerId, (err, player) => {
                if(err || player == null) { reject(new NotFoundError('Id for player was not found')) }
                else {
                    // Check if id of pickupGame exists.
                    PickupGame.findById(pickupGameId, (err, pickupGame) => {
                        if(err || pickupGame == null) { reject(new NotFoundError('Id for pickupGame was not found')) }
                        else {
                            // Check if player is already in the game.
                            Relation.find({pickupGameId: pickupGameId, playerId: playerId}, (err, foundRelation) => {
                                if(err || foundRelation.length != 0) { reject(new PlayerAlreadyInPickupGameError()) }
                                else {
                                    const { end, location } = pickupGame;
                                    const currentMoment = new Moment();

                                    // Check if pickupGame has already passed.
                                    if(currentMoment.isAfter(end)) { reject(new PickupGameAlreadyPassedError()) }
                                    else {
                                        // Check if max cap for field has been reached.
                                        Relation.find({ pickupGameId: pickupGameId}, (err, relationsFound) => {
                                            if(err) { reject(new NotFoundError('Id for relation was not found')) }
                                            else {
                                                basketballFieldService.getBasketballFieldById(location).then((basketballField) => {
                                                    basketballFieldFound = JSON.parse(basketballField);

                                                    if(basketballFieldFound.capacity == relationsFound.length) { reject(new PickupGameExceedMaximumError()) }
                                                    else {
                                                        // Create a relation for the player to be added to the pickupGame.
                                                        Relation.create({ playerId: playerId, pickupGameId: pickupGameId}, (err) => {

                                                            if(err) { reject(new BadRequest('Failed to add player to pickupGame on server')) }
                                                            else {
                                                                // Find the pickupGame with the added player.
                                                                PickupGame.findById(pickupGameId, (err, pickupGame) => {
                                                                    if(err || pickupGame == null) { reject(new NotFoundError('Id for pickupGame was not found')) }
                                                                    else { resolve(pickupGame); }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }),
        removePlayerFromPickupGame: (parent, args, context) => new Promise((resolve, reject) => {
            const { playerId, pickupGameId } = args;
            const { PickupGame, Player, Relation } = context;

            // Check if id of player being removed exists.
            Player.findById(playerId, (err, player) => {
                if(err || player == null) { reject(new NotFoundError('Id for player was not found')); }
                else {
                    // Check if pickupGame with id exists.
                    PickupGame.findById(pickupGameId, (err, pickupGame) => {
                        if(err || pickupGame == null) { reject(new NotFoundError('Id for pickupGame was not found')); }
                        else {
                            const { end } = pickupGame;
                            const currentMoment = new Moment();

                            // If game has passed. The player cant be removed from the game and
                            // an error should be thrown.
                            if(currentMoment.isAfter(end)) { reject(new PickupGameAlreadyPassedError()) }
                            else {
                                // Remove the relation between the pickupGame and the player being removed.
                                Relation.deleteOne({playerId: playerId, pickupGameId: pickupGameId}, (err) => {
                                    if(err) { reject(new ServerError('Failed to remove player from pickupGame on server')); }
                                    else {
                                        // Find the pickupGame after the deletion, and return it.
                                        PickupGame.findById(pickupGameId, (err, pickupGame) => {
                                            if(err || pickupGame == null) { reject(new NotFoundError('Id for pickupGame was not found')) }
                                            else { resolve(pickupGame); }
                                        })
                                    }
                                });
                            }
                        }
                    });
                }
            });
        })
    },
    types: {
        PickupGame: {
            location: (parent, args, context) => new Promise((resolve, reject) => {
                const { location } = parent;
                const { basketballFieldService } = context;

                // Find pickupGame's basketballfield.
                basketballFieldService.getBasketballFieldById(location).then(basketballField => {
                    resolve(JSON.parse(basketballField));
                }).catch(err => reject(new NotFoundError('Id for basketballField was not found')))
            }),
            registeredPlayers: (parent, args, context) => new Promise((resolve, reject) => {
                const { id } = parent;
                const { Relation, Player } = context;

                // Find relation with id of pickupGame.
                Relation.find({pickupGameId: id}, (err, relations) => {
                    if(err) { reject(new NotFoundError('Id for pickupGame was not found')); }
                    else if(relations.length == 0) { resolve([]); }
                    else {
                        // Find all players with relation to this pickupGame.
                        const playerIds = relations.map(r => r.playerId);
                        Player.aggregate([{ $match: { _id: { $in: playerIds }}}], (err, players) => {
                            if(err) { reject(new NotFoundError('Id for player was not found')); }
                            else {
                                players.map(pl => pl.id = pl._id.toString());
                                resolve(players);
                            }
                        });
                    }
                });
            }),
            host: (parent, args, context) => new Promise((resolve, reject) => {
                const { host } = parent;
                const { Player } = context;

                // Find host by id.
                Player.findById(host, (err, player) => {
                    if(err) { reject(new NotFoundError('Id for host was not found')); }
                    else { resolve(player); }
                });
            })
        }
    }
}
