import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const findBanjeeContacts = (payload) => {
	let url = urls.USER.FIND_CONTACTS;
	let actionCode = "ACTION_FILTER_PROFILE";
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
