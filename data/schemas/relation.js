const Schema = require('mongoose').Schema;

module.exports = new Schema({
    pickupGameId: { type: Schema.Types.ObjectId, required: true, ref: 'PickupGame' },
    playerId: { type: Schema.Types.ObjectId, required: true, ref: 'Player' }
});
