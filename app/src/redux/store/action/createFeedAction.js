export const CREATE_FEED = "CREATE_FEED";
export const REMOVE_FEED = "REMOVE_FEED";

export const createFeedData = (data) => {
	return {
		type: CREATE_FEED,
		payload: data,
	};
};
export const removeFeedData = (data) => {
	return {
		type: REMOVE_FEED,
		payload: data,
	};
};
