module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "unused-imports", "node"],
	env: {
		node: true,
		commonjs: true,
		browser: true,
		es6: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:eslint-comments/recommended"
	],
	parserOptions: {
		ecmaVersion: "latest",
		ecmaFeatures: {
			impliedStrict: true
		},
		project: "./tsconfig.eslint.json"
	},
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"import/order": [
			"warn",
			{
				alphabetize: {
					caseInsensitive: true,
					order: "asc"
				},
				groups: ["index", "parent", "external", "internal", "sibling", "builtin"],
				pathGroups: [
					{ pattern: "express**", group: "index", position: "before" },
					{ pattern: "@configs/**", group: "index", position: "after" },
					{ pattern: "@routers/**", group: "parent", position: "after" },
					{ pattern: "@models/**", group: "parent", position: "after" },
					{ pattern: "@services/**", group: "parent", position: "after" },
					{ pattern: "@providers/**", group: "external", position: "after" },
					{ pattern: "@middlewares/**", group: "internal", position: "after" },
					{ pattern: "@components/**", group: "internal", position: "after" },
					{ pattern: "@controllers/**", group: "internal", position: "after" },
					{ pattern: "@interfaces/**", group: "internal", position: "after" },
					{ pattern: "@validator/**", group: "internal", position: "after" },
					{ pattern: "@utils/**", group: "internal", position: "after" },
					{ pattern: "@tstypes/**", group: "internal", position: "after" },
					{ pattern: "./**", group: "sibling", position: "after" }
				],
				pathGroupsExcludedImportTypes: ["builtin"],
				"newlines-between": "always"
			}
		],
		"sort-imports": [
			"warn",
			{
				allowSeparatedGroups: true,
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: true,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
			}
		],
		"node/no-missing-import": 0,
		"node/no-unpublished-import": 0,
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{ vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
		],
		"import/no-unresolved": [2, { ignore: ["^@.*"] }],
		"no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0 }],
		eqeqeq: 1,
		quotes: [2, "double"],
		indent: [2, "tab"],
		semi: [1, "always"],
		camelcase: 0,
		"comma-dangle": ["warn", "never"],
		"no-tabs": [2, { allowIndentationTabs: true }],
		"line-comment-position": 0,
		"array-callback-return": 1,
		"space-before-function-paren": [2, { anonymous: "always", named: "never", asyncArrow: "always" }],
		"no-mixed-spaces-and-tabs": [2, "smart-tabs"],
		"eslint-comments/no-use": [2, { allow: [] }],
		"no-ex-assign": 0,
		"no-prototype-builtins": 0,
		"no-useless-escape": 1,
		"no-async-promise-executor": 1,
		"prefer-const": 1
	},
	ignorePatterns: ["sequelize-auto.js"],
	settings: {
		typescript: true,
		node: {
			tryExtensions: [".js", ".json", ".node", ".ts"]
		},
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"]
			}
		}
	}
};
