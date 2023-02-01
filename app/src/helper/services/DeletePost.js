import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";

export const deletePost = (postId) => {
	const url = urls.DELETE_POST + postId;
	const actionCode = "";
	const payload = "";
	const method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};

export const deleteAccount = (postId) => {
	const url = urls.USER.PERMANENT_DELETE_ACCOUNT + postId;
	const actionCode = "";
	const payload = "";
	const method = "DELETE";

	return executeGet(url, actionCode, payload, method);
};
