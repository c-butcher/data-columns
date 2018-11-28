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
        it('passes when a type is supplied', function() {
            chai.expect(function(){
                let type = new Column({
                    type: 'string'
                });
            }).to.not.throw();
        });

        it('fails when no type is supplied', function() {
            chai.expect(function(){
                let type = new Column();
            }).to.throw();
        });
    });

    describe('populate(options)', function() {
        it('passes when arguments are assigned to properties', function(){
            let column = Column.populate({
                type: 'string',
                name: 'first_name',
                label: 'First Name',
                description: 'First name of the user.',
                required: false,
            });

            chai.assert.equal(column.type, 'string');
            chai.assert.equal(column.name, 'first_name');
            chai.assert.equal(column.label, 'First Name');
            chai.assert.equal(column.description, 'First name of the user.');
            chai.assert.equal(column.required, false);

            chai.expect(column).to.be.instanceOf(Column);
        });

        it('passes when sanitizers are supplied', function(){
            let column = Column.populate({
                type: 'string',
            });

            chai.expect(column.getSanitizers().length).to.be.gt(0);
        });

        it('passes when validators are supplied', function(){
            let column = Column.populate({
                type: 'string',
            });

            chai.expect(column.getValidators().length).to.be.gt(0);
        });

        it('fails when no type is supplied', function() {
            chai.expect(function() {
                let column = Column.populate({
                    name: 'first_name',
                });
            }).to.throw();
        });
    });
});
