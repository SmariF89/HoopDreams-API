const { NotFoundError, ServerError, BadRequest } = require('../errors');

module.exports = {
    queries: {
        allBasketballFields:(parent, args, context) => new Promise((resolve, reject) => {
            const { status } = args;
            const { basketballFieldService } = context;

            // Check if should return basketballfields with specific status(OPEN or CLOSED).
            // else return all basketballfields.
            if(status) {
                basketballFieldService.getAllBasketballFields().then((allBasketballFields) => {
                    resolve(JSON.parse(allBasketballFields).filter(bb => bb.status === status));
                }).catch(err => { throw new ServerError(); }).catch(err => reject(err));
            }
            else {
                basketballFieldService.getAllBasketballFields().then((allBasketballFields) => {
                    resolve(JSON.parse(allBasketballFields));
                }).catch(err => { throw new ServerError(); }).catch(err => reject(err));
            }
        }),
        basketballField: (parent, args, context) => new Promise((resolve, reject) => {
            const { id } = args;
            const { basketballFieldService } = context;

            if(id == '') { reject(new NotFoundError('Id for basketballField was not found')); }
            else {
                // Find basketballfield with specific id.
                basketballFieldService.getBasketballFieldById(id).then((basketballField) => {
                    resolve(JSON.parse(basketballField));
                }).catch(err => { reject(new NotFoundError('Id for basketballField was not found')); });
            }
        })
    },
    types: {
        BasketballField: {
            pickupGames: (parent, args, context) => new Promise((resolve, reject) => {
                const { id } = parent;
                const { PickupGame } = context;

                // Check if pickupGame with id exists.
                PickupGame.find({ location: id }, (err, pickupGames) => {
                    if(err) { throw new ServerError(); }
                }).then(_pickupGames => {
                    if(_pickupGames.length == 0) { resolve([]); }
                    else { resolve(_pickupGames); }
                }).catch(err => reject(err));
            })
        }
    },

}
