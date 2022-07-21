module.exports = {
    extends: 'eslint:recommended',

    parserOptions: {
        'ecmaVersion': 6,
        sourceType: 'module'
    },

    globals: {
        Promise: true
    },

    env: {
        node: true,
        browser: true
    },

    rules: {
        // http://eslint.org/docs/rules/indent
        'indent': ['error', 4, {
            SwitchCase: 1
        }],

        // http://eslint.org/docs/rules/quotes
        'quotes': ['error', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],

        // http://eslint.org/docs/rules/linebreak-style
        'linebreak-style': ['error', 'unix'],

        // http://eslint.org/docs/rules/semi
        'semi': ['error', 'always'],

        // http://eslint.org/docs/rules/no-unused-vars
        'no-unused-vars': ['warn'],

        // http://eslint.org/docs/rules/brace-style
        'brace-style': ['error', '1tbs'],

        // http://eslint.org/docs/rules/operator-linebreak
        'operator-linebreak': ['error', 'after'],

        // http://eslint.org/docs/rules/camelcase
        'camelcase': ['error', {properties: 'never'}],

        // http://eslint.org/docs/rules/valid-jsdoc
        'valid-jsdoc': ['error', {
            prefer: {returns: 'return'},
            preferType: {
                string: 'String',
                number: 'Number',
                object: 'Object',
                array: 'Array',
                function: 'Function',
                boolean: 'Boolean'
            },
            requireReturn: false,
            requireParamDescription: false,
            requireReturnDescription: false
        }],

        // http://eslint.org/docs/rules/max-len
        'max-len': ['error', {
            code: 200,
            ignoreComments: true,
            ignoreRegExpLiterals: true
        }],

        // http://eslint.org/docs/rules/no-console
        'no-console': [0],

        // http://eslint.org/docs/rules/no-debugger
        'no-debugger': ['error'],

        // http://eslint.org/docs/rules/no-alert
        'no-alert': ['error'],

        // http://eslint.org/docs/rules/no-multi-str
        'no-multi-str': ['error'],

        // http://eslint.org/docs/rules/no-mixed-spaces-and-tabs
        'no-mixed-spaces-and-tabs': ['error'],

        // http://eslint.org/docs/rules/no-trailing-spaces
        'no-trailing-spaces': ['error'],

        // http://eslint.org/docs/rules/space-unary-ops
        'space-unary-ops': ['error', {}],

        // http://eslint.org/docs/rules/space-infix-ops
        'space-infix-ops': ['error'],

        // http://eslint.org/docs/rules/comma-spacing
        'comma-spacing': ['error', {before: false, after: true}],

        // http://eslint.org/docs/rules/no-with
        'no-with': ['error'],

        // http://eslint.org/docs/rules/keyword-spacing
        'keyword-spacing': ['error', {after: true}],

        // http://eslint.org/docs/rules/no-multi-spaces
        'no-multi-spaces': ['error'],

        // http://eslint.org/docs/rules/no-eval
        'no-eval': ['error'],

        // http://eslint.org/docs/rules/no-extra-label
        'no-extra-label': ['error'],

        // http://eslint.org/docs/rules/no-extra-bind
        'no-extra-bind': ['error'],

        // http://eslint.org/docs/rules/no-cond-assign
        'no-cond-assign': ['error'],

        // http://eslint.org/docs/rules/no-constant-condition
        'no-constant-condition': ['error'],

        // http://eslint.org/docs/rules/no-dupe-args
        'no-dupe-args': ['error'],

        // http://eslint.org/docs/rules/no-dupe-keys
        'no-dupe-keys': ['error'],

        // http://eslint.org/docs/rules/no-empty
        'no-empty': ['error'],

        // http://eslint.org/docs/rules/no-extra-semi
        'no-extra-semi': ['error'],

        // http://eslint.org/docs/rules/no-unreachable
        'no-unreachable': ['error'],

        // http://eslint.org/docs/rules/no-mixed-operators
        'no-mixed-operators': ['error'],

        // http://eslint.org/docs/rules/no-floating-decimal
        'no-floating-decimal': ['error'],

        // http://eslint.org/docs/rules/no-multi-spaces
        'no-multi-spaces': ['error'],

        // http://eslint.org/docs/rules/object-curly-spacing
        'object-curly-spacing': ['error', 'never'],

        // http://eslint.org/docs/rules/array-bracket-spacing
        'array-bracket-spacing': ['error', 'never'],

        // http://eslint.org/docs/rules/space-before-function-paren
        'space-before-function-paren': ['error', 'always'],

        // http://eslint.org/docs/rules/space-before-blocks
        'space-before-blocks': ['error', 'always'],

        // http://eslint.org/docs/rules/yoda
        'yoda': ['error', 'never'],

        // http://eslint.org/docs/rules/use-isnan
        'use-isnan': ['error'],

        // http://eslint.org/docs/rules/radix
        'radix': ['error'],

        // http://eslint.org/docs/rules/#possible-errors
        'func-call-spacing': ['error', 'never'],

        // http://eslint.org/docs/rules/complexity
        'complexity': ['error', {
            max: 10
        }],

        // http://eslint.org/docs/rules/max-depth
        'max-depth': ['error', {
            max: 4
        }],

        // http://eslint.org/docs/rules/max-nested-callbacks
        'max-nested-callbacks': ['error', {
            max: 3
        }],

        // http://eslint.org/docs/rules/max-params
        'max-params': ['error', {
            max: 7
        }],

        // http://eslint.org/docs/rules/max-statements
        'max-statements': ['error', {
            max: 10
        }]

    }

};
