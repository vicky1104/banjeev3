import urls from "../../constants/env/urls";
import { executeGet } from "../../helper/apis/getORdelete";

export const acceptRequest = (id) => {
	const url = urls.USER.ACCEPT_FRIEND_REQUEST + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
export const rejectRequest = (id) => {
	const url = urls.USER.REJECT_FRIEND_REQUEST + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
