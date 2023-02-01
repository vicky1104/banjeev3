import urls from "../../constants/env/urls";
import { executePost } from "../../helper/apis/postORput";

export const subCategoryService = (requestLoad) => {
	let url = urls.ASSETS.SUB_CATEGORY;
	let actionCode = "ACTION_FILTER_SUB-CATEGORY";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const categoryService = (requestLoad) => {
	let url = urls.ASSETS.CATEGORY;
	let actionCode = "ACTION_FILTER_CATEGORY";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const createCategoryService = (requestLoad) => {
	let url = urls.ASSETS.CREATE_SUB_CATEGORY;
	let actionCode = "ACTION_CREATE_SUB-CATEGORY";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
