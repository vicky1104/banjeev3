export const SHOW_TOAST = "SHOW_TOAST";
export const CLOSE_TOAST = "CLOSE_TOST";

export const showToast = (data) => {
	return {
		type: SHOW_TOAST,
		payload: data,
	};
};
export const closeToast = () => {
	return {
		type: CLOSE_TOAST,
		payload: { open: false },
	};
};
