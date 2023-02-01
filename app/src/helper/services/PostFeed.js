import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const postFeed = (reqLoad, onUploadProgress) => {
	const url = urls.CREATE_FEED;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";
	return executePost(url, actionCode, payload, method, {}, onUploadProgress);
};
export const getFeed = (reqLoad) => {
	const url = urls.POST_FEED;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";
	return executePost(url, actionCode, payload, method, {});
};
