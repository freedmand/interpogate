import type { Key } from './proto/interpogate';
import type { NdArray } from 'ndarray';
import ndarray from 'ndarray';
import npyjs from 'npyjs';

const np = new npyjs();

export interface LogitProb {
	position: number;
	logit: number;
	prob: number;
	token: string;
}

export function softmax(nums: number[]): number[] {
	let total = 0;
	for (const num of nums) {
		total += Math.exp(num);
	}
	return nums.map((x) => Math.exp(x) / total);
}

export function sortedSoftmax(nums: number[], vocab: string[]): LogitProb[] {
	const s = softmax(nums).map<LogitProb>((sm, i) => ({
		position: i,
		logit: nums[i],
		prob: sm,
		token: vocab[i]
	}));
	return s.sort((a, b) => b.prob - a.prob);
}

const SPECIAL_CHAR_MAP: { [char: string]: string } = {
	' ': '⎵',
	'\n': '⏎'
};

export function normalizeToken(token: string): string {
	return Array.from(token)
		.map((char) => {
			if (char.codePointAt(0) === ' '.charCodeAt(0) + 256) {
				return String.fromCharCode(char.charCodeAt(0) - 256);
			}
			return char;
		})
		.map((char) => {
			if (SPECIAL_CHAR_MAP[char] != null) return SPECIAL_CHAR_MAP[char];
			return char;
		})
		.join('');
}

export function count<T>(l: T[], item: T): number {
	return l.reduce((n, x) => n + (x === item ? 1 : 0), 0);
}

export function keyToString(key: Key): string {
	switch (key.keyType.oneofKind) {
		case 'classKey':
			return key.keyType.classKey;
		case 'dictKey':
			return `“${key.keyType.dictKey}”`;
		case 'listKey':
			return `${key.keyType.listKey}`;
		case undefined:
			throw new Error(`Invalid key type: ${key}`);
	}
}

export function keyPathToString(keyPath: Key[]): string {
	return keyPath.map((key) => keyToString(key)).join('.');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadNpy(data: Uint8Array): NdArray<any> {
	const parsed = np.parse(data.buffer.slice(data.byteOffset, data.byteLength + data.byteOffset));
	return ndarray(parsed.data, parsed.shape);
}

export interface VizResponse {
	visualizationId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: NdArray<any>;
}
