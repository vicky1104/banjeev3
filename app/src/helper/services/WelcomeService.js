import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const getAllUser = (requestLoad) => {
	const url = urls.USER.GET_ALL_USER;
	const method = "POST";
	const payload = requestLoad;
	const actionCode = "ACTION_FILTER_REGISTRY";
	return executePost(url, actionCode, payload, method, {});
};
export const uploadSessionService = (data) => {
	let url = urls.CDN.UPLOAD_SESSION;
	let actionCode = "ACTION_CREATE_TRANSFER";
	let method = "POST";
	return executePost(url, actionCode, data, method, {});
};

export const uploadSessionSendService = (data) => {
	let url = urls.CDN.UPLOAD_SEND;
	let actionCode = "ACTION_SEND_TRANSFER";
	let method = "POST";
	return executePost(url, actionCode, data, method, {});
};
