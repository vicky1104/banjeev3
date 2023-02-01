import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const createClassifiedService = (reqload) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_CLASSIFIEDS;
	let actionCode = "";
	let payload = reqload;
	let method = "POST";
	return executePost(url, actionCode, payload, method, {});
};

export const updateClassifiedService = (reqload) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_CLASSIFIEDS;
	let actionCode = "";
	let payload = reqload;
	let method = "PUT";
	return executePost(url, actionCode, payload, method, {});
};

export const filterClassifiedService = async (reqLoad) => {
	let url = urls.LOCAL_DISCOVERY.FILTER_CLASSIFIEDS;
	let actionCode = "";
	let method = "POST";

	return await executePost(url, actionCode, reqLoad, method, {});
};

export const findProductService = (id) => {
	let url = urls.LOCAL_DISCOVERY.FIND_PRODUCT + id;
	let actionCode = "";
	let payload = "";
	let method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
export const deleteProductService = (id) => {
	let url = urls.LOCAL_DISCOVERY.DELETE_PRODUCT + id;
	const actionCode = "";
	const payload = "";
	const method = "DELETE";

	return executeGet(url, actionCode, payload, method, {});
};
export const activateProductService = (id) => {
	let url = urls.LOCAL_DISCOVERY.ACTIVATE_PRODUCT + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const deactivateProductService = (id) => {
	let url = urls.LOCAL_DISCOVERY.DEACTIVATE_PRODUCT + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const sellProductService = (id) => {
	let url = urls.LOCAL_DISCOVERY.SELL_PRODUCT + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
