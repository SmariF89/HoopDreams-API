var request = require('request-promise');
const url = 'https://basketball-fields.herokuapp.com/api';

const basketballFieldService = () => {
	const getAllBasketballFields = () => {
        return request(`${url}/basketball-fields`);
	};

	const getBasketballFieldById = id => {
        return request(`${url}/basketball-fields/${id}`);
	};

	const addNewBasketballField = basketBallField => {
        return {};
	};

	return {
		getAllBasketballFields,
        getBasketballFieldById,
        addNewBasketballField
	};
};

module.exports = basketballFieldService();


//https://basketball-fields.herokuapp.com/api/basketball-fields/31154ca3-3eef-4dbf-b438-ec5d4d3af708
// 5bce0927c9261658b3cdebd5
