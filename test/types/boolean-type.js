const chai = require('chai');
const BooleanType = require('../../src/types/boolean-type');

describe('Boolean Column Type', function() {
    it('passes when it has sanitizers', function() {
        let type = new BooleanType();

        chai.expect(type.sanitizers.length).to.be.gt(0);
    });

    it('passes when it has validators', function() {
        let type = new BooleanType();

        chai.expect(type.validators.length).to.be.gt(0);
    });

    it('passes when sanitizer returns booleans every time', function() {
        let type = new BooleanType();

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

            chai.assert.typeOf(value, 'boolean');
        });
    });

    it('passes when validator returns errors for non-booleans', function() {
        let type = new BooleanType();

        let passes = [
            true,
            false,
        ];

        let fails = [
            123,
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