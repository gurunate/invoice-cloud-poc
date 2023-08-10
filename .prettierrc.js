module.exports = {
    trailingComma: 'none',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    arrowParens: 'avoid',
    overrides: [
        {
            files: ['**/*.yml', '**/*.yaml'],
            options: {
                tabWidth: 2
            }
        }
    ]
};
