import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const postReaction = (reqLoad) => {
	const url = urls.POST_REACTION;
	const actionCode = null;
	const payload = reqLoad;
	const method = "POST";
	return executePost(url, actionCode, payload, method, {});
};
export const getPostReaction = (id) => {
	const url = urls.GET_POST_REACTION + id;
	const actionCode = undefined;
	const payload = undefined;
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
