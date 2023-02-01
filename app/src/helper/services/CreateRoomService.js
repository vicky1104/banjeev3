import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const createRoom = (requestLoad) => {
	let url = urls.USER.CREATE_ROOM;
	let actionCode = "ACTION_CREATE-GROUP_CONNECTION";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method, {});
};

export const updateRoom = (requestLoad) => {
	let url = urls.USER.UPDATE_ROOM;
	let actionCode = "ACTION_UPDATE-GROUP_CONNECTION";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method, {});
};

export const deleteRoom = (requestLoad) => {
	let url = urls.USER.DELETE_ROOM + requestLoad;
	let actionCode = "ACTION_DELETE-GROUP_CONNECTION";
	let payload;
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method, {});
};

export const listOurRoom = (payload) => {
	let url = urls.USER.OUR_ROOM;
	let actionCode = "ACTION_GROUP-FILTER_CONNECTION";
	let method = "POST";
	return executePost(url, actionCode, payload, method, {});
};

export const listOtherRoom = (reqLoad) => {
	let url = urls.USER.OTHER_ROOM;
	let actionCode = "ACTION_OTHER-GROUP-FILTER_CONNECTION";
	let payload = reqLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
