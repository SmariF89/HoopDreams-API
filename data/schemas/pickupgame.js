const Schema = require('mongoose').Schema;

module.exports = new Schema({
	start: { type: 'Moment', required: true },
    end: { type: 'Moment', required: true },
    location: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, required: true, ref: 'Player' }
});
