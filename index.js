const { ApolloServer } = require('apollo-server');
const { PickupGame, Player, Relation } = require('./data/db');
const basketballFieldService = require('./services/basketballFieldService');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        basketballFieldService,
        PickupGame,
        Player,
        Relation
    }
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
