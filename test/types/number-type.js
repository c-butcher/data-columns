const chai = require('chai');
const NumberType = require('../../src/types/number-type');

describe('Number Column Type', function() {
    it('passes when it has sanitizers', function() {
        let type = new NumberType();

        chai.expect(type.sanitizers.length).to.be.gt(0);
    });

    it('passes when it has validators', function() {
        let type = new NumberType();

        chai.expect(type.validators.length).to.be.gt(0);
    });

    it('passes when sanitizer returns numbers every time', function() {
        let type = new NumberType();

        let passes = [
            0,
            1,
            null,
            false,
            true,
            'Hello',
            ['Hello'],
            {name: 'Hello'},
            () => {},
        ];

        passes.forEach((value) => {
            type.sanitizers.forEach((sanitizer) => {
                value = sanitizer.sanitize(value);
            });

            chai.assert.typeOf(value, 'number');
        });
    });

    it('passes when validator returns errors for non-numerics', function() {
        let type = new NumberType();

        let passes = [
            123,
            82.542
        ];

        let fails = [
            true,
            false,
            'hello',
            ['hello'],
            { name: 'hello' },
            () => { return 'hello'; }
        ];
        
        type.validators.forEach((validator) => {
            passes.forEach((value) => {
                let errors = validator.validate(value);

                chai.assert.equal(errors.length, 0);
            });

            fails.forEach((value) => {
                let errors = validator.validate(value);

                chai.expect(errors.length).to.be.gt(0);
            });
        });
    });
});