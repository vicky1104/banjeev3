import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";

export const unfriend = (id) => {
	const url = urls.USER.UNFRIEND + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
