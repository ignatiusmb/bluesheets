import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { isExists } from 'mauss/guards';
import { sortCompare, splitAt } from './helper';

import Aqua from '@ignatiusmb/aqua';
const markIt = require('markdown-it')({
	html: true,
	typographer: true,
	highlight: (str: string, language: string) => {
		const strList = str.split('\n');
		const dataset: Record<string, string | number> = { language };
		if (!str.length) return Aqua.code.highlight('', dataset);
		if (strList[0][0] === '~') {
			const [title, lineNumber] = strList[0].split('#');
			dataset['title'] = title.slice(1);
			if (lineNumber) dataset['lineStart'] = +lineNumber;
		}
		const content = strList.slice(dataset['title'] ? 1 : 0).join('\n');
		return Aqua.code.highlight(content, dataset);
	},
});

export const aquaMark = (content: string) => markIt.render(content);

export function parseFile(filename: string, parseCallback: any) {
	const content = readFileSync(filename, 'utf-8');
	const fmExpression = /---\r?\n([\s\S]+?)\r?\n---/;
	const [rawData, metadata] = fmExpression.exec(content) || ['', ''];
	const frontMatter = metadata
		.split(/\r?\n/)
		.filter(isExists)
		.reduce((acc: Record<string, any>, cur: string) => {
			if (!cur.includes(':')) return acc;
			const [key, val] = splitAt(cur.indexOf(':'), cur);
			acc[key] = val.trim();
			return acc;
		}, {});

	const [cleanedFilename] = filename.split(/[/\\]/).slice(-1);
	const article = content.slice(rawData.length + 1);
	const result = parseCallback(frontMatter, article, cleanedFilename);

	result['content'] = aquaMark(result['content']);
	return result;
}

export function parseDir(dirname: string, fileParse: any) {
	return readdirSync(dirname)
		.filter((name) => !name.startsWith('draft.') && name.endsWith('.md'))
		.map((filename) => parseFile(join(dirname, filename), fileParse))
		.sort(sortCompare);
}
