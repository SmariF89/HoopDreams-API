const { NotFoundError, ServerError, BadRequest } = require('../errors');

module.exports = {
    queries: {
        allPlayers: (parent, args, context) => new Promise((resolve, reject) => {
            const { Player } = context;
            
            // Find all players.
            Player.find({}, (err, players) => {
                if(err) { reject(new ServerError('Failed to retrive players from server')); }
                else { resolve(players); }
            });
        }),
        player: (parent, args, context) => new Promise((resolve, reject) => {
            const { id } = args;
            const { Player } = context;

            // Find player with specific id.
            Player.findById(id, (err, player) => {
                if(err || player == null) { reject(new NotFoundError('Id for player was not found')); }
                else { resolve(player); }
            });
        })
    },
    mutations: {
        createPlayer: (parent, args, context) => new Promise((resolve, reject) => {
            const { name } = args.input;
            const { Player } = context;

            // Create new player.
            Player.create({ name: name }, (err, playerCreated) => {
                if(err || playerCreated == null) { reject(new BadRequest('Failed to create player on server')); }
                else { resolve(playerCreated); }
            });
        }),
        updatePlayer: (parent, args, context) => new Promise((resolve, reject) => {
            const { id } = args;
            const { name } = args.input;
            const { Player } = context;

            // Check if id of player exists.
            Player.findById(id, (err, player) => {
                if(err || player == null) { reject(new NotFoundError('Id for player was not found')); }  
                else { return player; }
                
            }).then(_player => {

                // Update player.
                Player.updateOne({ _id: id }, { name: name }, (err, res) => {
                    if(err) { throw new BadRequest('Failed to update player on server'); }
                }).then(() => {

                    // Find player to resolve for the promise.
                    Player.findById(id, (err, updatedPlayer) => {
                        if(err || updatedPlayer == null) { reject(new NotFoundError('Id for player was not found')); }
                        else { resolve(updatedPlayer); }
                    });
                }).catch(err => reject(err));
            }).catch(err => {throw err;} ).catch(err => reject(err));
        }),
        removePlayer: (parent, args, context) => new Promise((resolve, reject) => {
            const { id } = args;
            const { Player, Relation, PickupGame } = context;
            
            // Check if id for player exists.
            Player.findById(id, (err, player) => {
                if(err || player == null) { reject(new NotFoundError('Id for player was not found')); }
                else { 
                    // Delete player.
                    Player.deleteOne({_id: id}, (err) => {
                        if(err) { reject(new ServerError('Failed to remove player on server.')); }
                        else {
                            // If player being removed has any relations, they are removed.
                            Relation.deleteMany({playerId: id}, (err, doc) => {
                                if(err) { reject(new ServerError('Failed to remove related pickupgames to player being removed on server.')); }
                                else {
                                    // Check if player is host of any pickupGames.
                                    PickupGame.find({host: id}, (err, pickupGames) => {
                                        if(err) { reject(new NotFoundError('Id of host not found')); }
                                        else if(pickupGames == null || pickupGames.length == 0) { resolve(true); }
                                        else { 
                                            // If player being removed has no relations to hostId of any game, the removing is concidered resolved.
                                            const { pickupGameIdOfGameBeingRemoved } = pickupGames[0]._id;

                                            // Remove all pickupGames where the player being removed is host.
                                            PickupGame.deleteMany({host: id}, (err, doc) => {
                                                if(err) { reject(new ServerError('Failed to remove pickupgames which the player is hosting on server.'));}
                                                else {
                                                    // If player was host of a pickupGame, all relations to the game must also be removed.
                                                    Relation.deleteMany({pickupGameId: pickupGameIdOfGameBeingRemoved}, (err, doc) => {
                                                        if(err) { reject(new ServerError('Failed to remove related pickupgames to host being removed on server.'));}
                                                        else { resolve(true); }
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        })
    },
    types: {
        Player: {
            playedGames: (parent, args, context) => new Promise((resolve, reject) => {
                const { id } = parent;
                const { Relation, PickupGame } = context;

                // Find all relations for the player.
                Relation.find({playerId: id}, (err, relations) => {
                    if(err) { reject(new NotFoundError('Relation with player id not found')); }
                    else if(relations.length == 0) { resolve([]); }
                    else {
                        const pickupGameIds = relations.map(r => r.pickupGameId);

                        // Find all pickupGames related to player.
                        PickupGame.aggregate([{ $match: { _id: { $in: pickupGameIds }}}], (err, pickupGames) => {
                            if(err) { reject(new NotFoundError('PickupGame with id not found')); }
                            else {
                                pickupGames.map(pg => pg.id = pg._id.toString());
                                resolve(pickupGames);
                            }
                        });
                    } 
                })
            })
        }
    }
};
