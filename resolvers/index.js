const basketballFieldResolver = require('./basketballFieldResolver');
const pickupGameResolver = require('./pickupGameResolver');
const playerResolver = require('./playerResolver');
const scalarMomentResolver = require('./scalarMomentResolver');

module.exports = {
    Query: {
        ...playerResolver.queries,
        ...pickupGameResolver.queries,
        ...basketballFieldResolver.queries
    },
    Mutation: {
        ...playerResolver.mutations,
        ...pickupGameResolver.mutations
    },
    ...playerResolver.types,
    ...pickupGameResolver.types,
    ...basketballFieldResolver.types,
    ...scalarMomentResolver
};