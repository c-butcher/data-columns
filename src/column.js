const ColumnError = require('formatted-error');
const Sanitizer = require('data-sanitizers').Sanitizer;
const Validator = require('data-validators').Validator;

const ColumnType = require('./column-type');

class Column {

    /**
     * Columns contain meta-data about a column/field, along with the methods to sanitize
     * and validate the data it holds.
     *
     * @param {object} options
     */
    constructor(options = {}) {
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

    /**
     * Standard default values for a column.
     *
     * @returns {{name: null, type: null, label: null, required: boolean, description: null, sanitizers: Array, validators: Array}}
     */
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

    /**
     * Adds a sanitizer to this column.
     *
     * @param {Sanitizer} sanitizer
     *
     * @returns {Column}
     */
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

    /**
     * Check to see if this column has a sanitizer.
     *
     * @param {string} type
     *
     * @returns {boolean}
     */
    hasSanitizer(type) {
        let sanitizers = this._sanitizers.filter((instance) => {
            return instance.type === type;
        });

        return sanitizers.length > 0;
    }

    /**
     * Returns all of the sanitizer for this column.
     *
     * @returns {Array}
     */
    getSanitizers() {
        return this._sanitizers;
    }

    /**
     * Cleans the value so that it will work with our column.
     *
     * @param {*} value
     *
     * @returns {*}
     */
    sanitize(value) {
        this._sanitizers.forEach((cleaner) => {
            value = cleaner.sanitize(value);
        });

        return value;
    }

    /**
     * Adds a validator to the column.
     *
     * @param {Validator} validator
     *
     * @returns {Column}
     */
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

    /**
     * Check to see if this column has a validator type.
     *
     * @param {string} type
     *
     * @returns {boolean}
     */
    hasValidator(type) {
        let validator = this._validators.filter((instance) => {
            return instance.type === type;
        });

        return validator.length > 0;
    }

    /**
     * Returns all of the validators for this column.
     *
     * @returns {Array}
     */
    getValidators() {
        return this._validators;
    }

    /**
     * Check to see if the value follows this columns validation constraints.
     *
     * @param {*} value
     *
     * @returns {string[]}
     */
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
