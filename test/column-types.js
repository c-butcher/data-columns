const chai = require('chai');
const ColumnType = require('../src/column-type');
const StringType = require('../src/types/string-type');

describe('Column Types', function() {

    beforeEach(function() {
        ColumnType
            .remove('boolean')
            .remove('string');
    });

    describe('constructor(name, description, sanitizers, validators)', function() {
        it('throws error when instantiated directly', function() {
            chai.expect(function(){
                let type = new ColumnType(
                    'color',
                    'Contains a hex-based color code.',
                    [],
                    []
                );
            }).to.throw();
        });
    });

    describe('add(name, type)', function() {
        it('passes when adding a valid column type', function() {
            chai.assert.lengthOf(ColumnType.types(), 0);

            ColumnType.add('string', new StringType());

            chai.assert.lengthOf(ColumnType.types(), 1);
            chai.assert.equal(ColumnType.has('string'), true);
        });

        it('throws error when name is not a string', function() {
            chai.expect(function(){
                ColumnType.add(true, new StringType());
            }).to.throw();
        });

        it('throws error when type does not implement ColumnType class', function() {
            chai.expect(function(){
                ColumnType.add('range', {
                    name: 'range',
                    description: 'Must fall within the specified range.',
                    sanitizers: [],
                    validators: [],
                });
            }).to.throw();
        });
    });

    describe('get(name, options)', function() {
        it('passes when column type exists exists', function() {
            ColumnType.add('string', new StringType());

            let string = ColumnType.get('string');

            chai.assert.instanceOf(string, ColumnType);
        });

        it('fails when column type does not exist', function() {
            chai.expect(function(){
                let nonExistent = ColumnType.get('non-existent');
            }).to.throw();
        });
    });

    describe('has(name)', function() {
        it('passes when column type exists exists', function() {
            ColumnType.add('string', new StringType());

            let exists = ColumnType.has('string');

            chai.assert.isOk(exists);
        });

        it('fails when column type does not exist', function() {

            let exists = ColumnType.has('non-existent');

            chai.assert.isNotOk(exists);
        });
    });
});
