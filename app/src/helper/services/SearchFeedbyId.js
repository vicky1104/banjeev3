import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const searchFeed = (id) => {
	const url = urls.FIND_POST + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const ReportFeedService = (requestLoad) => {
	let url = urls.REPORT_POST;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const ReportGroupService = (requestLoad) => {
	let url = urls.GEO_CLOUD.REPORT_GROUP;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const ReportNeighbourhoodService = (requestLoad) => {
	let url = urls.GEO_CLOUD.REPORT_NEIGHBOURHOOD;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
