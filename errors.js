class PickupGameExceedMaximumError extends Error {
    constructor(message = 'Pickup game has exceeded the maximum of players.') {
        super(message);
        this.name = 'PickupGameExceedMaximumError';
        this.code = 409;
    }
};

class BasketballFieldClosedError extends Error {
    constructor(message = 'Cannot add a pickup game to a closed basketball field') {
        super(message);
        this.name = 'BasketballFieldClosedError';
        this.code = 400;
    }
};

class PickupGameOverlapError extends Error {
    constructor(message = 'Pickup games cannot overlap') {
        super(message);
        this.name = 'PickupGameOverlapError';
        this.code = 400;
    }
};

class PickupGameAlreadyPassedError extends Error {
    constructor(message = 'Pickup game has already passed') {
        super(message);
        this.name = 'PickupGameAlreadyPassedError';
        this.code = 400;
    }
}

class NotFoundError extends Error {
    constructor(message = 'Id was not found') {
        super(message);
        this.name = 'NotFoundError';
        this.code = 404;
    }
}

class BadRequest extends Error {
    constructor(message = 'Field arguments were not setup correctly') {
        super(message);
        this.name = 'BadRequest';
        this.code = 400;
    }
}

class ServerError extends Error {
    constructor(message = 'Error was found on server side') {
        super(message);
        this.name = 'Server error';
        this.code = 500;
    }
}

class PlayerAlreadyInPickupGameError extends Error {
    constructor(message = 'Player is already in pickupGame') {
        super(message);
        this.name = 'PlayerAlreadyInPickupGameError';
        this.code = 400;
    }
}


module.exports = {
    PickupGameExceedMaximumError,
    BasketballFieldClosedError,
    PickupGameOverlapError,
    PickupGameAlreadyPassedError,
    NotFoundError,
    BadRequest,
    ServerError,
    PlayerAlreadyInPickupGameError
};
