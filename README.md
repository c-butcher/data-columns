# Data Columns

[![Build Status](https://travis-ci.com/c-butcher/data-columns.svg?branch=master)](https://travis-ci.com/c-butcher/data-columns)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://travis-ci.com/c-butcher/data-validators)

This package contains objects to help describe columns, including the validation and sanitation
for the data of those columns.

```javascript
const Column = require('data-column').Column;

let column = Column.populate({
    type: 'string',
    name: 'first_name',
    label: 'First Name',
    description: 'The users first name.',
    required: true,
    sanitizers: [{
        name: 'string'
    }],
    validators: [{
        name: 'string',
        options: {
            required: true,
            length: {
                min: 3,
                max: 24,
                message: 'Your name must be in between {min} and {max} characters.'
            }
        }
    }]
});
```