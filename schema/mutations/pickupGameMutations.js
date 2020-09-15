module.exports = `
    createPickupGame(input: PickupGameInput!): PickupGame!
    removePickupGame(id: ID!): Boolean!
    addPlayerToPickupGame(input: SignupPlayerInput!): PickupGame!
    removePlayerFromPickupGame(playerId: ID!, pickupGameId: ID!): PickupGame!
`;
