import urls from "../../constants/env/urls";
import { executeGet } from "../../helper/apis/getORdelete";
import { executePost } from "../../helper/apis/postORput";
import axios from "axios";

export const getAvatar = (requestLoad) => {
	let url = urls.ASSETS.ASSETS;
	const method = "POST";
	const payload = requestLoad;
	const actionCode = "ACTION_FILTER_ASSETS";
	return executePost(url, actionCode, payload, method, {});
};

export const updateUser = (payload, method) => {
	let url = urls.USER.UPDATE_USER;

	const actionCode = "ACTION_CREATE_REGISTRY";
	return executePost(url, actionCode, payload, method, {});
};
export const updateUserRegistry = (payload) => {
	let url = urls.USER.MODIFY;
	const actionCode = "";
	return executePost(url, actionCode, payload, "POST", {});
};

export const getUserProfile = (id, header) => {
	let url = urls.USER.GET_USER_PROFILE + id;
	const method = "GET";
	const actionCode = "";
	return executeGet(url, actionCode, {}, method, header);
};

export const updateProfile = (payload) => {
	let url = urls.USER.REGISTRATION;
	const method = "PUT";
	const actionCode = "ACTION_UPDATE_PROFILE";
	return executePost(url, actionCode, payload, method, {});
};

export const modiefyRegistry = (payload) => {
	let url = urls.USER.MODIFY;
	const method = "PUT";
	const actionCode = "";
	return executePost(url, actionCode, payload, method, {});
};

export const voiceIntro = (payload, type) => {
	let url = urls.USER.VOICE_INTRO;
	let method = type ? "PUT" : "POST";
	let actionCode = type ? "ACTION_UPDATE_INTRO" : "ACTION_CREATE_INTRO";
	return executePost(url, actionCode, payload, method, {});
};

export const mapService = (coordinates) => {
	return axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk`
	);
};

export const userLocationUpdate = (payload) => {
	return executePost(
		urls.GEO_CLOUD.UPDATE_USER_LOCATION,
		"",
		payload,
		"POST",
		{}
	);
};
export const userALertLocationUpdateAlert = (payload) => {
	return executePost(
		urls.GEO_CLOUD.UPDATE_USER_ALERT_LOCATION,
		"",
		payload,
		"POST",
		{}
	);
};

export const getAllCitiesServices = () => {
	return executeGet(urls.GEO_CLOUD.GET_CITIES, "", "", "GET", {});
};
