import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";

export const deleteComment = (id) => {
	const url = urls.DELETE_COMMENT + id;
	const actionCode = "";
	const payload = "";
	const method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};

export const deleteAlertAndBlogComment = (id) => {
	const url = urls.LOCAL_DISCOVERY.DELETE_BLOG_COMMENT + id;
	const actionCode = "";
	const payload = "";
	const method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};
