import {
	GET_USER_REGISTRY,
	SAVE_USER_REGISTRY,
	REMOVE_USER_REGISTRY,
} from "../action/useActions";

const initialState = {};

export default function userRegisteryReducer(state = initialState, action) {
	switch (action.type) {
		case GET_USER_REGISTRY:
			return state;
		case SAVE_USER_REGISTRY:
			return { ...state, ...action.payload };
		case REMOVE_USER_REGISTRY:
			return { ...action.payload };
		default:
			return state;
	}
}
