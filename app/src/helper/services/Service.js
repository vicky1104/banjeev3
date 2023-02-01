import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const myBanjeeService = (requestLoad) => {
	let url = urls.USER.FILTER_CONNECTION;
	let actionCode = "";
	let payload = requestLoad;
	let method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};

export const unBlockUser = (userId) => {
	let url = urls.USER.UNBLOCK + userId;
	let actionCode = "";
	let payload = "";
	let method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
export const BlockUser = (userId) => {
	let url = urls.USER.BLOCK + userId;
	let actionCode = "";
	let payload = "";
	let method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
