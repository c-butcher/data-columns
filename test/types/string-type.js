const chai = require('chai');
const StringType = require('../../src/types/string-type');

describe('String Column Type', function() {
    it('passes when it has sanitizers', function() {
        let type = new StringType();

        chai.expect(type.sanitizers.length).to.be.gt(0);
    });

    it('passes when it has validators', function() {
        let type = new StringType();

        chai.expect(type.validators.length).to.be.gt(0);
    });

    it('passes when sanitizer returns strings every time', function() {
        let type = new StringType();

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

            chai.assert.typeOf(value, 'string');
        });
    });

    it('passes when validator returns errors for non-strings', function() {
        let type = new StringType();

        let passes = [
            'hello',
        ];

        let fails = [
            0,
            123,
            true,
            false,
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