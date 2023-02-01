import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const chatHistory = (payload) => {
	let method = "POST";
	let url = urls.RTC.CHAT.HISTORY;
	let actionCode = "ACTION_FILTER_MESSAGE";
	return executePost(url, actionCode, payload, method, true);
};

export const updateChat = (payload) => {
	let method = "PUT";
	let url = urls.RTC.CHAT.UPDATE;
	let actionCode = "ACTION_UPDATE_MESSAGE";
	return executePost(url, actionCode, payload, method, false);
};

export const deleteChat = (id) => {
	let method = "DELETE";
	let url = urls.RTC.CHAT.DELETE + id;
	let actionCode = "";
	return executeGet(url, actionCode, {}, method, true);
};

export const destructChat = (id) => {
	let method = "GET";
	let url = urls.RTC.CHAT.DESTRUCT + id;
	let actionCode = "";
	return executeGet(url, actionCode, {}, method, true);
};
