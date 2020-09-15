const mongoose = require('mongoose')
require('mongoose-moment')(mongoose);
const pickupGameSchema = require('./schemas/pickupgame');
const playerSchema = require('./schemas/player');
const relationSchema = require('./schemas/relation');

const connection = mongoose.createConnection('Contact me, Smári, for a connection string if you want to try this API out: smarifreyr30@gmail.com', { useNewUrlParser: true });

module.exports = {
    PickupGame: connection.model('PickupGame', pickupGameSchema),
    Player: connection.model('Player', playerSchema),
    Relation: connection.model('Relation', relationSchema),
    connection
};
