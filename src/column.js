const ColumnError = require('formatted-error');
const Sanitizer = require('data-sanitizers').Sanitizer;
const Validator = require('data-validators').Validator;

const ColumnType = require('./column-type');

class Column {
    constructor(options = {}) {
        if (this.constructor === Column) {
            throw new ColumnError("Column class cannot be called directly.");
        }

        if (typeof options.type !== 'string') {
            throw new ColumnError("Argument 'options.type' must be an string.");
        }

        options = Object.assign(this.constructor.defaults(), options);

        this.name = options.name;
        this.type = options.type;
        this.label = options.label;
        this.required = options.required;
        this.description = options.description;
        this._sanitizers = [];
        this._validators = [];

        options.sanitizers.forEach((sanitizer) => {
            this.addSanitizer(sanitizer);
        });

        options.validators.forEach((validator) => {
            this.addValidator(validator);
        });
    }

    static defaults() {
        return {
            name: null,
            type: null,
            label: null,
            required: false,
            description: null,
            sanitizers: [],
            validators: [],
        };
    }

    addSanitizer(sanitizer) {
        if (!(sanitizer instanceof Sanitizer)) {
            throw new ColumnError("Argument 'sanitizer' must be a Sanitizer object.");
        }

        if (this.hasSanitizer(sanitizer.name)) {
            throw new ColumnError("Sanitizer '{subject}' has already been added.", {
                subject: sanitizer.name
            })
        }

        this._sanitizers.push(sanitizer);

        return this;
    }

    hasSanitizer(type) {
        let sanitizers = this._sanitizers.filter((instance) => {
            return instance.type === type;
        });

        return sanitizers.length > 0;
    }

    getSanitizers() {
        return this._sanitizers;
    }

    sanitize(value) {
        this._sanitizers.forEach((cleaner) => {
            value = cleaner.sanitize(value);
        });

        return value;
    }

    addValidator(validator) {
        if (!(validator instanceof Validator)) {
            throw new ColumnError("Argument 'validator' must be an instanceof Validator.");
        }

        if (this.hasValidator(validator.name)) {
            throw new ColumnError("Validator '{subject}' has already been added.", {
                subject: validator.name
            })
        }

        this._validators.push(validator);

        return this;
    }

    hasValidator(type) {
        let validator = this._validators.filter((instance) => {
            return instance.type === type;
        });

        return validator.length > 0;
    }

    getValidators() {
        return this._validators;
    }

    validate(value) {
        let errors = [];

        this._validators.forEach((validator) => {
            errors.push(...validator.validate(value));
        });

        return errors;
    }

    /**
     * Populates a new columns with all its sanitizers and validators attached.
     *
     * @param {{name: string, type: string, label: string, description: string, required: boolean}} options
     *
     * @returns {Column}
     */
    static populate(options = {}) {
        if (typeof options.type !== 'string') {
            throw new ColumnError("Argument 'options.type' must be a string.");
        }

        if (!ColumnType.has(options.type)) {
            throw new ColumnError("Column type '{type}' cannot be found.", {
                type: options.type
            });
        }

        let columnType = ColumnType.get(options.type);

        options = Object.assign({
            sanitizers: columnType.sanitizers,
            validators: columnType.validators
        }, options);

        let column = new Column(options);
        if (!(column instanceof Column)) {
            throw new ColumnError("Column type '{type}' must extend the Column class.");
        }

        return column;
    }
}

module.exports = Column;
