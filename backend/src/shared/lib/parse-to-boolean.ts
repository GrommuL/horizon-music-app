export const parseToBoolean = (value: string): boolean => {
	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'string') {
		const formattedValueToLowerCase = value.trim().toLowerCase()

		if (formattedValueToLowerCase === 'true') {
			return true
		}

		if (formattedValueToLowerCase === 'false') {
			return false
		}
	}

	throw new Error(`Failed to convert "${value}" to a boolean value.`)
}
