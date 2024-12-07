// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorString = (error: any): string => {
	if (typeof error === 'string') {
		return error;
	} else if (error.details) {
		let completeError = '';

		if (error.title) {
			completeError += error.title;
		}

		if (error.details) {
			if (completeError.length > 0) {
				completeError += ' - ';
			}
			completeError += error.details;
		}

		return completeError;
	} else if (Object.keys(error).length > 0) {
		return Object.values(error)[0] as string;
	} else {
		console.log(error);
		return 'Something went wrong, please try again later';
	}
};
