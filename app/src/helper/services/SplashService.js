import urls from "../../constants/env/urls";
import { executeGet } from "../../helper/apis/getORdelete";

export const getUserProfileDataFunc = (id) => {
	let url = `${urls.USER.GET_USER_PROFILE_REMOTE}${id}`;
	let method = "GET";
	let payload = {};
	let actionCode = "";

	return executeGet(url, actionCode, payload, method, {});
};
