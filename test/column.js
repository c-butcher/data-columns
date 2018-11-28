const chai = require('chai');
const Column = require('../src/column');
const ColumnType = require('../src/column-type');
const NumberType = require('../src/types/number-type');
const StringType = require('../src/types/string-type');

describe('Column', function() {

    before(function() {
        ColumnType
            .add('number', new NumberType())
            .add('string', new StringType());
    });

    describe('constructor(name, description, sanitizers, validators)', function() {
        it('passes when arguments populate the properties', function() {
            chai.expect(function(){
                let type = new Column({

                });
            }).to.throw();
        });
    });

    describe('populate(options)', function() {
        it('passes when a column type is returned', function(){
            let column = Column.populate({
                type: 'string',
            });

            chai.expect(column).to.be.instanceOf(ColumnType);
        });

        it('passes when a column type is returned', function(){
            let column = Column.populate({
                type: 'string',
                name: 'first_name',
                label: 'First Name',
                description: 'First name of the user.',
                required: true,
                sanitizers: [
                    { name: 'string' }
                ],
                validator: [
                    { name: 'string', options: { length: { min: 3, max: 15 } } }
                ]
            });

            chai.expect(column).to.be.instanceOf(ColumnType);
        });
    });
});
