const setDateFormat = (date) => {
	const dateFormat = new Date(date).toDateString().split(" ");
	const timeFormat = new Date(date).toTimeString().split(":");

	const hour = parseInt(timeFormat[0]);
	const min = timeFormat[1];
	const formatedHour =
		hour > 12 ? `0${hour - 12}` : hour < 10 ? `0${hour}` : hour;
	return `${formatedHour}:${min} ${hour >= 12 ? "PM" : "AM"}, ${dateFormat
		.slice(1, dateFormat.length)
		.join(" ")}`;
};

const checkUserStatus = (lastSeen, seen) => {
	if (new Date(lastSeen).getFullYear() !== 1970) {
		let different = new Date().getTime() - new Date(lastSeen);

		let secondsInMilli = 1000;
		let minutesInMilli = secondsInMilli * 60;
		let hoursInMilli = minutesInMilli * 60;
		let daysInMilli = hoursInMilli * 24;
		let elapsedDays = different / daysInMilli;
		different = different % daysInMilli;
		let elapsedHours = different / hoursInMilli;
		different = different % hoursInMilli;
		//   console.warn("different-", different);
		let elapsedMinutes = different / minutesInMilli;
		//   console.warn("elapsedMinutes", elapsedMinutes);
		if (Math.round(elapsedDays) > 0) {
			return setDateFormat(lastSeen);
		} else {
			if (Math.round(elapsedHours) > 0) {
				return `${seen ? "Last seen" : ""} ${Math.round(elapsedHours)} hours ago`;
			} else {
				return `${seen ? "Last seen" : ""} ${
					Math.round(elapsedMinutes) > 0
						? `${Math.round(elapsedMinutes)} minutes ago`
						: "Just now"
				}`;
			}
		}
	}
};
export { setDateFormat };
export default checkUserStatus;
