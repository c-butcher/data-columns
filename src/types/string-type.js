const ColumnType = require('../column-type');
const Sanitizer = require('data-sanitizers').Sanitizer;
const Validator = require('data-validators').Validator;

class StringType extends ColumnType {
    constructor() {
        super(
            'string',
            "Contains any text value.",
            [Sanitizer.get('string')],
            [Validator.get('string')]
        );
    }
}

module.exports = StringType;