import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";

export const commentLike = (id) => {
	const url = urls.GET_COMMENT_LIKE + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
