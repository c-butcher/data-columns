const ColumnType = require('../column-type');
const Sanitizer = require('data-sanitizers').Sanitizer;
const Validator = require('data-validators').Validator;

class BooleanType extends ColumnType {
    constructor() {
        super(
            'boolean',
            "Can only be a true or false value.",
            [Sanitizer.get('boolean')],
            [Validator.get('boolean')]
        );
    }
}

module.exports = BooleanType;