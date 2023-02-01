import {
	GET_USER_DATA,
	SAVE_USER_DATA,
	REMOVE_USER_DATA,
} from "../action/useActions";

const initialState = {};

export default function userDataReducer(state = initialState, action) {
	switch (action.type) {
		case GET_USER_DATA:
			return state;
		case SAVE_USER_DATA:
			return { ...state, ...action.payload };
		case REMOVE_USER_DATA:
			return { ...action.payload };
		default:
			return state;
	}
}
