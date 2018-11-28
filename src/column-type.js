const ColumnError = require('formatted-error');

let columnTypes = new Map();

class ColumnType {
    /**
     * Column types are responsible for sanitizing the inputted data and deciding
     * whether that piece of data meets the validation constraints.
     *
     * @param {string} name
     * @param {string} description
     * @param {Array} sanitizers
     * @param {Array} validators
     */
    constructor(name, description, sanitizers = [], validators = []) {
        if (this.constructor === ColumnType) {
            throw new ColumnError("ColumnType cannot be called directly.");
        }

        if (typeof name !== 'string') {
            throw new ColumnError("Argument 'name' must be a string.");
        }

        if (typeof description !== 'string') {
            throw new ColumnError("Argument 'description' must be a string.");
        }

        if (!Array.isArray(sanitizers)) {
            throw new ColumnError("Argument 'sanitizers' must be an array.");
        }

        if (!Array.isArray(validators)) {
            throw new ColumnError("Argument 'validators' must be an array.");
        }

        this.name = name;
        this.description = description;
        this.sanitizers = sanitizers;
        this.validators = validators;
    }

    /**
     * Check whether a column type exists.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    static has(name) {
        return columnTypes.has(name);
    }

    /**
     * Adds a new column type.
     *
     * @param {string} name
     * @param {ColumnType} type
     */
    static add(name, type) {
        if (typeof name !== 'string') {
            throw new ColumnError("Argument 'name' must be a string.");
        }

        if (!(type instanceof ColumnType)) {
            throw new ColumnError("Argument 'type' must be an instanceof ColumnType.");
        }

        columnTypes.set(name, type);

        return this;
    }

    /**
     * Returns a specific column type.
     *
     * @param {string} name
     *
     * @returns {ColumnType}
     */
    static get(name) {
        if (!columnTypes.has(name)) {
            throw new ColumnError("Column type '{name}' not found.", {
                name: name,
            });
        }

        return columnTypes.get(name);
    }

    /**
     * Remove a specific column type.
     *
     * @param {string} name
     *
     * @returns {ColumnType}
     */
    static remove(name) {
        if (!columnTypes.has(name)) {
            return this;
        }

        columnTypes.delete(name);

        return this;
    }

    /**
     * Returns all of the column types.
     *
     * @returns {Map<any, any>}
     */
    static types() {
        return columnTypes;
    }
}

module.exports = ColumnType;