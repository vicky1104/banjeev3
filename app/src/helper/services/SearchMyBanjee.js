import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const searchMyBanjee = (reqload) => {
	const url = urls.USER.SEARCH_FRIEND;
	const actionCode = "ACTION_FILTER_CONNECTION";
	const payload = reqload;
	const method = "POST";
	return executePost(url, actionCode, payload, method, {});
};
