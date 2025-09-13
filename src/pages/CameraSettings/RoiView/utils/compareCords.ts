import type { ICordInternal } from '../model/ICord'

const compare = (obj1: ICordInternal, obj2: ICordInternal) => {
	let isEqual = true
	isEqual = isEqual && obj1.type === obj2.type
	isEqual = isEqual && obj1.id === obj2.id
	isEqual = isEqual && obj1.top === obj2.top
	isEqual = isEqual && obj1.left === obj2.left
	isEqual = isEqual && obj1.width === obj2.width
	isEqual = isEqual && obj1.height === obj2.height
	isEqual = isEqual && (obj1.angle || 0) === (obj2.angle || 0)
	return isEqual
}

export const compareCords = (arr1: ICordInternal[], arr2: ICordInternal[]) => {
	if (arr1.length !== arr2.length) {
		return false
	}

	const copyArr1 = [...arr1]
	const copyArr2 = [...arr2]

	const sortKey = (cord: ICordInternal) => `${cord.type}-${cord.id}`
	copyArr1.sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
	copyArr2.sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

	for (let i = 0; i < copyArr1.length; i++) {
		if (!compare(copyArr1[i], copyArr2[i])) {
			return false
		}
	}

	return true
}

export default compareCords
