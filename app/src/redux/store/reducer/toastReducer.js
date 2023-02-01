import { CLOSE_TOAST, SHOW_TOAST } from "../action/toastAction";

const initialState = {
	open: false,
	description: "",
};

export const toastReducer = (state = initialState, action) => {
	switch (action.type) {
		case SHOW_TOAST:
			return { ...state, ...action.payload };
		case CLOSE_TOAST:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
