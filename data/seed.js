let Moment = require('moment');

const { PickupGame, Player, Relation, connection } = require('./db');

const getResourceIdByName = (resources, prop, value) => resources.find(elem => elem[prop] === value);

//Drop all collections before execution
Object.keys(connection.collections).forEach(collection => {
    if (collection === 'pickupgames') { PickupGame.collection.drop(); }
    if (collection === 'players') { Player.collection.drop(); }
    if (collection === 'relations') { Relation.collection.drop(); }
});

// Insert Players
Player.insertMany([
    {
        name: "Johnny Sven Haraldsson"
    },
    {
        name: "Linda Weathers Petersen"
    },
    {
        name: "Carlo Peter Davidsson"
    },
    {
        name: "Tara Jordan"
    },
    {
        name: "Jenna Johnsson"
    },
    {
        name: "Smari Freyr Gudmundsson"
    },
    {
        name: "Thorir Armann Valdimarsson"
    },
    {
        name: "Bjakki Hrabn Akselson"
    },
    {
        name: "Leivur Palson"
    },
    {
        name: "Snori Arinbjaddnar"
    },
    {
        name: "Raymond the rainbowchild"
    },
    {
        name: "Pelacious the great"
    }
], err => {
    if(err) { throw new Error(err); }
    Player.find({}, (err, players) => {
        if(err) { throw new Error(err); }

        // Insert PickupGames
        PickupGame.insertMany([
            {
                start: new Moment('2015-02-10 21:00'),
                end: new Moment('2015-02-10 22:30'),
                location: "94ddb8d8-8324-4a65-8f9f-06d6146169f8",
                host: getResourceIdByName(players, 'name', "Linda Weathers Petersen")
            },
            {
                start: new Moment('2019-04-04 15:30'),
                end: new Moment('2019-04-04 17:00'),
                location: 'ef42039e-77bc-40a3-8121-c2a5424ebcdb',
                host: getResourceIdByName(players, 'name', "Johnny Sven Haraldsson")
            },
            {
                start: new Moment('2019-07-02 12:30'),
                end: new Moment('2019-07-02 15:00'),
                location: "31154ca3-3eef-4dbf-b438-ec5d4d3af708",
                host: getResourceIdByName(players, 'name', 'Tara Jordan')
            },
            {
                start: new Moment('2017-01-04 15:30'),
                end: new Moment('2017-01-04 17:00'),
                location: '1798a72b-b619-4150-b604-5de20fa3cc56',
                host: getResourceIdByName(players, 'name', "Raymond the rainbowchild")
            },
            {
                start: new Moment('2016-07-01 12:30'),
                end: new Moment('2016-07-01 15:00'),
                location: "647ffc67-265c-40a4-84c9-ccdcd2fdeac7",
                host: getResourceIdByName(players, 'name', 'Thorir Armann Valdimarsson')
            }
        ], err => {
            if(err) { throw new Error(err); }
            PickupGame.find({}, (err, pickupGames) => {
                if(err) { throw new Error(err); }

                // Insert Relations
                Relation.insertMany([
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '647ffc67-265c-40a4-84c9-ccdcd2fdeac7'),
                        playerId: getResourceIdByName(players, 'name', 'Smari Freyr Gudmundsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '647ffc67-265c-40a4-84c9-ccdcd2fdeac7'),
                        playerId: getResourceIdByName(players, 'name', 'Thorir Armann Valdimarsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '647ffc67-265c-40a4-84c9-ccdcd2fdeac7'),
                        playerId: getResourceIdByName(players, 'name', 'Bjakki Hrabn Akselson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '647ffc67-265c-40a4-84c9-ccdcd2fdeac7'),
                        playerId: getResourceIdByName(players, 'name', 'Leivur Palson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '1798a72b-b619-4150-b604-5de20fa3cc56'),
                        playerId: getResourceIdByName(players, 'name', 'Pelacious the great')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '1798a72b-b619-4150-b604-5de20fa3cc56'),
                        playerId: getResourceIdByName(players, 'name', 'Raymond the rainbowchild')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '1798a72b-b619-4150-b604-5de20fa3cc56'),
                        playerId: getResourceIdByName(players, 'name', 'Carlo Peter Davidsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '1798a72b-b619-4150-b604-5de20fa3cc56'),
                        playerId: getResourceIdByName(players, 'name', 'Jenna Johnsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '31154ca3-3eef-4dbf-b438-ec5d4d3af708'),
                        playerId: getResourceIdByName(players, 'name', 'Smari Freyr Gudmundsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '31154ca3-3eef-4dbf-b438-ec5d4d3af708'),
                        playerId: getResourceIdByName(players, 'name', 'Tara Jordan')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '31154ca3-3eef-4dbf-b438-ec5d4d3af708'),
                        playerId: getResourceIdByName(players, 'name', 'Snori Arinbjaddnar')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '31154ca3-3eef-4dbf-b438-ec5d4d3af708'),
                        playerId: getResourceIdByName(players, 'name', 'Thorir Armann Valdimarsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', 'ef42039e-77bc-40a3-8121-c2a5424ebcdb'),
                        playerId: getResourceIdByName(players, 'name', 'Linda Weathers Petersen')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', 'ef42039e-77bc-40a3-8121-c2a5424ebcdb'),
                        playerId: getResourceIdByName(players, 'name', 'Carlo Peter Davidsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', 'ef42039e-77bc-40a3-8121-c2a5424ebcdb'),
                        playerId: getResourceIdByName(players, 'name', 'Raymond the rainbowchild')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', 'ef42039e-77bc-40a3-8121-c2a5424ebcdb'),
                        playerId: getResourceIdByName(players, 'name', 'Pelacious the great')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '94ddb8d8-8324-4a65-8f9f-06d6146169f8'),
                        playerId: getResourceIdByName(players, 'name', 'Bjakki Hrabn Akselson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '94ddb8d8-8324-4a65-8f9f-06d6146169f8'),
                        playerId: getResourceIdByName(players, 'name', 'Smari Freyr Gudmundsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '94ddb8d8-8324-4a65-8f9f-06d6146169f8'),
                        playerId: getResourceIdByName(players, 'name', 'Johnny Sven Haraldsson')
                    },
                    {
                        pickupGameId: getResourceIdByName(pickupGames, 'location', '94ddb8d8-8324-4a65-8f9f-06d6146169f8'),
                        playerId: getResourceIdByName(players, 'name', 'Leivur Palson')
                    }
                ], err => {
                    if(err) { throw new Error(err); }
                    Relation.find({}, (err, relations) => {
                        if(err) { throw new Error(err); }
                        connection.close();
                    });
                });
            });
        });
    });
});
