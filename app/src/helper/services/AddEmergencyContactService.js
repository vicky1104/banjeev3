import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";
import { executeGet } from "../apis/getORdelete";

export const addEmergencyContactService = (payload) => {
	let method = "POST";
	let url = urls.GEO_CLOUD.ADD_EMERGENCY_CONTACT;
	let actionCode = "";
	return executePost(url, actionCode, payload, method, {});
};

export const emergencyContactListService = () => {
	let url = urls.GEO_CLOUD.LIST_EMERGENCY_CONTACT;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
export const deleteEmergencyContact = (id) => {
	const url = urls.GEO_CLOUD.DELETE_EMERGENCY_CONTACT + id;
	const actionCode = "";
	const payload = "";
	const method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};
