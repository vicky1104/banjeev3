export const SAVE_USER_PROFILE = "SAVE_USER_PROFILE";
export const GET_USER_PROFILE = "GET_USER_PROFILE";
export const SAVE_USER_REGISTRY = "SAVE_USER_REGISTRY";
export const GET_USER_REGISTRY = "GET_USER_REGISTRY";
export const GET_USER_DATA = "GET_USER_DATA";
export const SAVE_USER_DATA = "SET_USER_DATA";
export const REMOVE_USER_DATA = "REMOVE_USER_DATA";
export const REMOVE_USER_REGISTRY = "REMOVE_USER_REGISTRY";
export const REMOVE_USER_PROFILE = "REMOVE_USER_PROFILE";
export const saveUserProfile = (data) => {
	return {
		type: SAVE_USER_PROFILE,
		payload: data,
	};
};

export const getUserProfile = () => {
	return {
		type: GET_USER_PROFILE,
		payload: null,
	};
};

export const saveUserRegistry = (data) => {
	return {
		type: SAVE_USER_REGISTRY,
		payload: data,
	};
};

export const getUserRegistry = () => {
	return {
		type: GET_USER_REGISTRY,
		payload: null,
	};
};

export const saveUserData = (data) => {
	return {
		type: SAVE_USER_DATA,
		payload: data,
	};
};

export const getUserData = () => {
	return {
		type: GET_USER_DATA,
		payload: null,
	};
};

export const removeUserData = (data) => {
	return { type: REMOVE_USER_DATA, payload: data };
};
export const removeUserRegistry = (data) => {
	return { type: REMOVE_USER_REGISTRY, payload: data };
};
export const removeUserProfile = (data) => {
	return { type: REMOVE_USER_PROFILE, payload: data };
};
