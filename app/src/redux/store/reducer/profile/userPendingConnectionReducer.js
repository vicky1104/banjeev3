import {
	PENDING_CONNECTION,
	GET_PROFILE,
	REMOVE_PROFILE_DATA,
} from "../../action/Profile/userPendingConnection";
const initialState = {
	mutualFriend: undefined,
	profileId: undefined,
	loading: true,
	pendingId: [],
	pendingReq: false,
	showReqestedFriend: false,
	connectionId: undefined,
	apiCall: () => {},
};

export const pendingConnectionReducer = (state = initialState, action) => {
	switch (action.type) {
		case PENDING_CONNECTION:
			return { ...state, ...action.payload };
		case GET_PROFILE:
			return { ...state, ...action.payload };
		case REMOVE_PROFILE_DATA:
			return { ...action.payload };

		default:
			return initialState;
	}
};
