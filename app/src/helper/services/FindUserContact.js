import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const findUserContact = (data) => {
	let url = urls.USER.ACTION_CONTACTS_REGISTRY;
	let actionCode = "ACTION_CONTACTS_REGISTRY";
	let payload = data;
	let method = "POST";
	return executePost(url, actionCode, payload, method, {});
};
