export const SET_USER_LOCATION = "SET_USER_LOCATION";
export const MAP_REFERENCE = "MAP_REFERENCE";
export const BOTTOM_REFERENCE = "BOTTOM_REFERENCE";
export const SET_MAP_REDUCER = "SET_MAP_REDUCER";

export const setUserLocation = (data) => {
	return {
		type: SET_USER_LOCATION,
		payload: data,
	};
};

export const setMapData = (data) => {
	return { type: SET_MAP_REDUCER, payload: data };
};

export const setMapRef = (data) => {
	return { type: MAP_REFERENCE, payload: data };
};
export const setBottomSheetRef = (data) => {
	return { type: MAP_REFERENCE, payload: data };
};
