import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const createAlertService = (requestLoad, onUploadProgress) => {
	let url = urls.GEO_CLOUD.CREATE_ALERT;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {}, onUploadProgress);
};
export const deleteAlertService = (requestLoad) => {
	let url = urls.GEO_CLOUD.REPORT_ALERT;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const filterNHService = (requestLoad) => {
	let url = urls.GEO_CLOUD.FILTER_ALERT;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const confirmIncidentService = (requestLoad) => {
	let url = urls.GEO_CLOUD.CONFIRM_INCIDENCE;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const myAlertService = () => {
	let url = urls.GEO_CLOUD.MY_ALERTS;
	let actionCode = "";
	let payload = "";
	let method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};

export const deleteMyAlertService = (id) => {
	let url = urls.GEO_CLOUD.DELETE_MY_ALERTS + id;
	let actionCode = "";
	let payload = "";
	let method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};

export const getAlertByID = (id) => {
	let url = urls.GEO_CLOUD.GET_ALERT_BY_ID + id;
	let actionCode = "";
	let payload = "";
	let method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
