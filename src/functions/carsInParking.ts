export function getDiff(
	entryTime?: string | Date,
	exitTime?: string | Date
): [number, number] {
	const entry = entryTime ? new Date(entryTime) : new Date()
	const exit = exitTime ? new Date(exitTime) : new Date()
	const diffMs = exit.getTime() - entry.getTime()
	const diffMins = Math.max(0, Math.floor(diffMs / 1000 / 60))
	const hours = Math.floor(diffMins / 60)
	const minutes = diffMins % 60
	return [hours, minutes]
}
