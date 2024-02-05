export function getDims(
	selected: number[],
	maxSelected: number,
	expandedShapes: [number, number][]
): [number, number][] | null {
	if (selected.length === maxSelected) {
		return expandedShapes.filter((item) => selected.includes(item[1]));
	}
	return null;
}

export function getSelected(dim: number, ...lists: number[][]): boolean {
	return lists.some((list) => list.includes(dim));
}
