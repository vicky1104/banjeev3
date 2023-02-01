import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const DetailNeighbourhoodService = (id) => {
	const url = urls.GEO_CLOUD.NEIGHBOURHOOD_DETAIL_PAGE + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
export const AddMemberNeighbourhoodService = (reqLoad) => {
	const url = urls.GEO_CLOUD.ADD_MEMBERS_IN_NEIGHBOURHOOD;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";
	return executePost(url, actionCode, payload, method, {});
};
