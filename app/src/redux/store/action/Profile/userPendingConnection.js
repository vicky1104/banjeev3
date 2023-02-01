export const PENDING_CONNECTION = "PENDING_CONNECTION";
export const GET_PROFILE = "GET_PROFILE";
export const REMOVE_PROFILE_DATA = "REMOVE_PROFILE_DATA";
export const pendingConnection = (data) => {
	return {
		type: PENDING_CONNECTION,
		payload: data,
	};
};

export const getProfile = (data) => {
	return {
		type: GET_PROFILE,
		payload: data,
	};
};
export const removeProfileData = (data) => {
	return {
		type: REMOVE_PROFILE_DATA,
		payload: data,
	};
};
