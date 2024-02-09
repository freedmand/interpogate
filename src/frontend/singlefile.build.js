import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import rehypeParse from 'rehype-parse';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import { SKIP as htmlSKIP, visit as htmlVisit } from 'unist-util-visit';
import { visit as esVisit, SKIP as esSKIP } from 'estree-util-visit';

import rehypeStringify from 'rehype-stringify';
import { remove } from 'unist-util-remove';
import { fromJs } from 'esast-util-from-js';
import { toJs } from 'estree-util-to-js';
import { rollup } from 'rollup';

// Get paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, 'build');
const indexPath = path.join(buildDir, 'index.html');
const htmlContents = readFileSync(indexPath, { encoding: 'utf-8' });

/**
 * Helper to get contents of a file in the build dir for inlining
 * @param {string} relativePath A relative path in the Svelte build directory
 * @returns The full contents of the file
 */
function getFile(relativePath) {
	return readFileSync(path.join(buildDir, relativePath), { encoding: 'utf-8' });
}

/**
 * Unified pipeline to remove modulepreload scripts (they get bundled)
 */
function remover() {
	return (tree) => {
		remove(tree, (node) => {
			return (
				node.type === 'element' &&
				node.tagName === 'link' &&
				'rel' in node.properties &&
				node.properties.rel.length === 1 &&
				node.properties.rel[0] === 'modulepreload'
			);
		});
	};
}

/**
 * Unified pipeline to inline CSS files
 */
function styleVisitor() {
	return (tree) => {
		htmlVisit(tree, (node) => {
			if (
				node.type === 'element' &&
				node.tagName === 'link' &&
				'rel' in node.properties &&
				node.properties.rel.length === 1 &&
				node.properties.rel[0] === 'stylesheet'
			) {
				const href = node.properties.href;
				node.tagName = 'style';
				node.properties = {};
				node.children = [
					{
						type: 'text',
						value: getFile(href)
					}
				];
				return htmlSKIP;
			}
		});
	};
}

/**
 * @param {list[T]} x A list of elements (should only be length 1)
 * @returns The first element. Throws if the length isn't 1
 */
function ensureOne(x) {
	if (x.length !== 1) {
		throw new Error(`Expected ${x} to have length 1, not ${x.length}`);
	}
	return x[0];
}

/**
 * Unified pipeline to rewrite dynamic imports as an inlined script
 * bundled with rollup in the <head> section. This is the meat of
 * the singlefile build process
 */
function importVisitor() {
	return async (tree) => {
		let sources = [];

		// First pass through HTML
		htmlVisit(tree, (node) => {
			if (node.type === 'element' && node.tagName === 'script') {
				const jsCode = fromJs(node.children[0].value);

				esVisit(jsCode, (node) => {
					// Remove SvelteKit's URL initializer that depends on location
					// since it breaks iframes
					if (
						node.type === 'Property' &&
						node.key.type === 'Identifier' &&
						node.key.name === 'base' &&
						node.value.type === 'CallExpression' &&
						node.value.callee.type === 'MemberExpression' &&
						node.value.callee.object.type === 'MemberExpression' &&
						node.value.callee.object.object.type === 'NewExpression' &&
						node.value.callee.object.object.callee.type === 'Identifier' &&
						node.value.callee.object.object.callee.name === 'URL'
					) {
						node.value = {
							type: 'Identifier',
							name: 'undefined'
						};
						return esSKIP;
					}

					// Grab sources from dynamic import and remove the dynamic import part
					if (
						node.type === 'ExpressionStatement' &&
						node.expression.type === 'CallExpression' &&
						node.expression.callee.type === 'MemberExpression' &&
						node.expression.callee.object.type === 'CallExpression' &&
						node.expression.callee.object.callee.type === 'MemberExpression' &&
						node.expression.callee.object.callee.object.type === 'Identifier' &&
						node.expression.callee.object.callee.object.name === 'Promise' &&
						node.expression.callee.object.callee.property.type === 'Identifier' &&
						node.expression.callee.object.callee.property.name === 'all' &&
						node.expression.callee.object.arguments.length === 1 &&
						node.expression.callee.object.arguments[0].type === 'ArrayExpression' &&
						node.expression.callee.object.arguments[0].elements.every(
							(element) => element.type === 'ImportExpression'
						)
					) {
						sources = node.expression.callee.object.arguments[0].elements.map(
							(x) => x.source.value
						);
						// Replace with body
						node.expression = node.expression.arguments[0].body;
						return esSKIP;
					}
				});

				const newCode = toJs(jsCode).value;
				node.children[0].value = newCode;
			}
		});

		// Grab the relevant source files: there should be two
		const kitSrc = ensureOne(sources.filter((x) => x.includes('entry/start.')));
		const appSrc = ensureOne(sources.filter((x) => x.includes('entry/app.')));

		const appDirname = path.dirname(kitSrc);
		if (path.dirname(appSrc) !== appDirname) {
			throw new Error(
				`Expected kit and app src to be same directory: ${appDirname} vs ${path.dirname(appSrc)}`
			);
		}

		// Create a bundle that imports both dynamic imports
		// purely from the AST
		const bundleProgram = toJs({
			type: 'Program',
			body: [
				{
					type: 'ImportDeclaration',
					specifiers: [
						{
							type: 'ImportNamespaceSpecifier',
							local: {
								type: 'Identifier',
								name: 'app'
							}
						}
					],
					source: {
						type: 'Literal',
						value: `./${path.basename(appSrc)}`
					}
				},
				{
					type: 'ImportDeclaration',
					specifiers: [
						{
							type: 'ImportNamespaceSpecifier',
							local: {
								type: 'Identifier',
								name: 'start'
							}
						}
					],
					source: {
						type: 'Literal',
						value: `./${path.basename(kitSrc)}`
					}
				},
				{
					type: 'ExportNamedDeclaration',
					declaration: null,
					specifiers: [
						{
							type: 'ExportSpecifier',
							local: {
								type: 'Identifier',
								name: 'app'
							},
							exported: {
								type: 'Identifier',
								name: 'app'
							}
						},
						{
							type: 'ExportSpecifier',
							local: {
								type: 'Identifier',
								name: 'start'
							},
							exported: {
								type: 'Identifier',
								name: 'start'
							}
						}
					],
					source: null
				}
			],
			sourceType: 'module'
		}).value;

		// Write out bundle
		const rootBundle = path.join(buildDir, appDirname, 'root.js');
		writeFileSync(rootBundle, bundleProgram, { encoding: 'utf-8' });

		// Use rollup to compile the bundle to a single file
		const bundle = await rollup({
			input: rootBundle
		});
		const rollupOutput = await bundle.generate({
			format: 'iife',
			name: 'bundle',
			inlineDynamicImports: true
		});
		const outputCode = ensureOne(rollupOutput.output).code;

		// Write the bundled code in the <head> section
		htmlVisit(tree, (node) => {
			if (node.type === 'element' && node.tagName === 'head') {
				node.children.push({
					type: 'element',
					tagName: 'script',
					properties: {},
					children: [
						{
							type: 'text',
							value:
								outputCode +
								`
								var kit = bundle.start;
								var app = bundle.app;
							`
						}
					]
				});
			}
		});
	};
}

// Run the full pipeline to create the singlefile build
const result = await unified()
	.use(rehypeParse)
	.use(styleVisitor)
	.use(remover)
	.use(importVisitor)
	.use(rehypeStringify)
	.process(htmlContents);

const res = String(result);

// Mkdir output dir if not exists
if (!existsSync(path.join(__dirname, 'singlefile_build'))) {
	mkdirSync(path.join(__dirname, 'singlefile_build'));
}

// Output single HTML file
writeFileSync(path.join(__dirname, 'singlefile_build', 'index.html'), res, { encoding: 'utf-8' });
