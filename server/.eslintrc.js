module.exports = {
	"env": {
		"node": true,
		"es6": true
	},
	"extends": ["plugin:@typescript-eslint/recommended"],
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint"],
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"never"
		],
		"no-fallthrough": 0,
		"no-console": 1,
		"no-debugger": 1,
		"no-unused-vars": 1,
		"max-len": [
			1,
			{
				"code": 120,
				"ignoreStrings": true,
				"ignoreRegExpLiterals": true,
				"tabWidth": 2
			}
		],
		"comma-dangle": [2, "never"],
		"space-in-parens": [2, "never"],
		"comma-spacing": 2,
		"object-curly-spacing": [2, "never"],
		"@typescript-eslint/no-non-null-assertion": 0,
		"@typescript-eslint/no-explicit-any": 0
	}
};
