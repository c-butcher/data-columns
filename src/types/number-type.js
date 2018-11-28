const ColumnType = require('../column-type');
const Sanitizer = require('data-sanitizers').Sanitizer;
const Validator = require('data-validators').Validator;

class NumberType extends ColumnType {
    constructor() {
        super(
            'number',
            "Only contains numeric digits (1-9).",
            [Sanitizer.get('number')],
            [Validator.get('number')]
        );
    }
}

module.exports = NumberType;