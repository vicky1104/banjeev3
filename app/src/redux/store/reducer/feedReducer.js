import {
	SAVE_MAIN_FEED,
	VIEW_SCREEN,
	OTHER_POST_ID,
	SAVE_FEED_ACTION,
	PUSH_TO_PLAY_BACK,
} from "../action/feedAction";

const initialState = {
	screen: "ALL",
	feed: [],
	otherPostId: "",
	loadingData: false,
	refreshingData: false,
	page: 0,
	actionOnPost: {},
	viewableItems: [],
};

export default function feedReducer(state = initialState, action) {
	switch (action.type) {
		case SAVE_MAIN_FEED:
			return { ...state, feed: [...state.feed, ...action.payload] };
		case VIEW_SCREEN:
			return { ...state, screen: action.payload };
		case OTHER_POST_ID:
			return { ...state, otherPostId: action.payload };
		case SAVE_FEED_ACTION:
			console.log(action.payload);
			return { ...state, ...action.payload };
		case PUSH_TO_PLAY_BACK:
			return { ...state, actionOnPost: action.payload };

		default:
			return state;
	}
}
