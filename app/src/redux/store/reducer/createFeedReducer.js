import { CREATE_FEED, REMOVE_FEED } from "../action/createFeedAction";

const initialState = {
	text: "",
	connection: "PUBLIC",
	apploading: false,
	locData: {},
	uploadContentData: [],
};
export default createFeedReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_FEED:
			return { ...state, ...action.payload };

		case REMOVE_FEED:
			return initialState;
		default:
			return initialState;
	}
};
