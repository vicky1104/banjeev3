export const convertTime = (timer) => {
	var today = Date.now();
	var postedDate = Date.parse(timer);
	var diffMs = today - postedDate; // milliseconds between now & postedDate
	var diffDays = Math.floor(diffMs / 86400000); // days
	var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

	if (diffDays <= 0) {
		if (diffHrs <= 0) {
			if (diffMins <= 0) {
				return "Just now";
			} else {
				return `${diffMins} min ago`;
			}
		} else {
			return `${diffHrs} hrs ago`;
		}
	} else {
		return `${diffDays} day ago`;
	}
};

export const getFormatedDate = (value) => {
	const currentDate = new Date();
	const limitYear = currentDate.getFullYear();
	const limitMonth = currentDate.getMonth();
	const limitDate = currentDate.getDate();
	const limit = new Date(parseInt(limitYear) - 13, limitMonth, limitDate);

	let accDate = new Date(value);
	const year = accDate.getFullYear();
	const month = accDate.getMonth();
	const date = accDate.getDate();
	return {
		fDate: `${year}-${month + 1}-${date}`,
		limit,
	};
};
