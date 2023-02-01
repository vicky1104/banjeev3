import { executeGet } from "../../helper/apis/getORdelete";
import { executePost } from "../../helper/apis/postORput";
import urls from "../../constants/env/urls";

export const validateOtp = (requestLoad) => {
	let url = urls.USER.VALIDATE_OTP;
	let actionCode = "ACTION_VALIDATE_OTP";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, null);
};
export const login = (payload) => {
	let url = urls.LOGIN;
	let actionCode = "";
	let method = "POST";
	return executePost(url, actionCode, payload, method, null);
};
export const signup = (requestLoad) => {
	let url = urls.USER.REGISTRATION;
	let actionCode = "ACTION_CREATE_PROFILE";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, null);
};
export const validateUser = (requestLoad) => {
	let url = urls.USER.EXITS_USER;
	let actionCode = "ACTION_VALIDATE_USER";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, null);
};
export const sendOtp = (requestLoad) => {
	let url = urls.USER.OTP_SEND_REGISTER;
	let actionCode = "ACTION_CREATE_OTP";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, null);
};
export const changePassword = (requestLoad) => {
	let url = urls.USER.FORGOTPASSWORD;
	let actionCode = "ACTION_FORGOTPASSWORD_USER";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, {});
};

export const getCountryCode = () => {
	let url = urls.USER.GET_COUNTRY_CODE;
	let actionCode = "";
	let payload = "";
	let method = "GET";
	return executeGet(url, actionCode, payload, method, null);
};
export const getCityService = (reqLoad) => {
	let url = urls.USER.GET_CITY;
	let actionCode = "ACTION_FILTER_CITY";
	let payload = reqLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, null);
};
