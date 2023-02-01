import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const BusinessCategoryService = (requestLoad) => {
	let url = urls.ASSETS.CATEGORY;
	let actionCode = "ACTION_FILTER_CATEGORY";

	let method = "POST";
	return executePost(url, actionCode, requestLoad, method, {});
};
export const createBusinessService = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BUSINESS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const updateBusinessService = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BUSINESS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";

	return executePost(url, actionCode, payload, method, {});
};
export const listBusinessService = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.LIST_BUSINESS;
	let actionCode = "";
	let payload = "";
	let method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};

export const findBusinessByID = (id) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BUSINESS + id;
	let actionCode = "";
	let payload = "";
	let method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const FilterService = async (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FILTER_BUSINESS;
	let actionCode = "";
	let method = "POST";

	return await executePost(url, actionCode, requestLoad, method, {});
};
export const deleteBusinessService = (id) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BUSINESS + "/" + id;
	let actionCode = "";
	let payload = "";
	let method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};
