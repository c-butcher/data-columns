const Column = require('./src/column');
const ColumnType = require('./src/column-type');
const BooleanType = require('./src/types/boolean-type');
const NumberType = require('./src/types/number-type');
const StringType = require('./src/types/string-type');

ColumnType.add('boolean', BooleanType);
ColumnType.add('number', NumberType);
ColumnType.add('string', StringType);

module.exports = {
    Column,
    ColumnType,
    BooleanType,
    StringType,
    NumberType,
};