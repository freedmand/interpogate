import type { Position } from '@deck.gl/core/typed';
import type { DrawObject } from './graph';

function multiplyPosition(position: Position, x: number): Position {
	return position.map((p) => p * x) as Position;
}

function addPositions(position1: Position, position2: Position): Position {
	return position1.map((p, i) => p + position2[i]) as Position;
}

function sqr(x: number): number {
	return x * x;
}

export function calculateBezier(
	start: Position,
	control: Position,
	end: Position,
	numSegments: number
): Position[] {
	const results: Position[] = [];
	for (let i = 0; i < numSegments; i++) {
		const t = i / (numSegments - 1); // extrapolate from [0-1]
		// Calculate bezier: (1-t)^2 P_1 + 2(1-t)t P_2 + t^2 P_3
		results.push(
			addPositions(
				addPositions(
					multiplyPosition(start, sqr(1 - t)),
					multiplyPosition(control, 2 * (1 - t) * t)
				),
				multiplyPosition(end, sqr(t))
			)
		);
	}
	return results;
}

export function* iteratePoints(drawObject: DrawObject): Generator<[number, number]> {
	switch (drawObject.type) {
		case 'box':
			yield [drawObject.x, drawObject.y];
			yield [drawObject.x + drawObject.width, drawObject.y + drawObject.height];
			break;
		case 'edge':
			for (const point of drawObject.points) {
				yield [point.x, point.y];
			}
			break;
		case 'text':
			yield [drawObject.x, drawObject.y];
			yield [drawObject.x + drawObject.width, drawObject.y + drawObject.height];
			break;
	}
}

interface Bounds {
	xMin: number | null;
	xMax: number | null;
	yMin: number | null;
	yMax: number | null;
}

export function getBounds(drawObjects: DrawObject[]): Bounds {
	const bounds: Bounds = {
		xMin: null,
		xMax: null,
		yMin: null,
		yMax: null
	};
	for (const drawObject of drawObjects) {
		for (const [x, y] of iteratePoints(drawObject)) {
			// Update bounds
			if (bounds.xMin == null || x < bounds.xMin) {
				bounds.xMin = x;
			}
			if (bounds.xMax == null || x > bounds.xMax) {
				bounds.xMax = x;
			}
			if (bounds.yMin == null || y < bounds.yMin) {
				bounds.yMin = y;
			}
			if (bounds.yMax == null || y > bounds.yMax) {
				bounds.yMax = y;
			}
		}
	}
	return bounds;
}

export function calculateZoomFitViewState(
	xMin: number,
	xMax: number,
	yMin: number,
	yMax: number,
	screenWidth: number,
	screenHeight: number,
	zoomPadding = 0.15
): { target: Position; zoom: number } {
	const width = xMax - xMin;
	const height = yMax - yMin;
	const scale = Math.min(screenWidth / width, screenHeight / height);
	const zoom = Math.log2(scale) - zoomPadding;
	return {
		target: [xMin + width / 2, yMin + height / 2] as Position,
		zoom
	};
}
