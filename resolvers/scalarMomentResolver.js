const { GraphQLScalarType } = require('graphql');
const Moment = require('moment');

// Format moment to Icelandic standards.
const formatMoment = value => {
    const moment = new Moment(value);
    moment.locale('is');
    return moment.format('llll');
}

module.exports = {
    Moment: new GraphQLScalarType({
        name: 'Moment',
        description: 'Icelandic time format',

        // Data being sent in.
        // Here data will be formatted so it is displayed correctly.
        parseValue: value => value,
        parseLiteral: ast => ast.value,

        // Data beeing queried
        // and displayed
        serialize: value => { return formatMoment(value); }
    })
};
