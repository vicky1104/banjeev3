import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const NeighbourhoodMemberListService = (requestLoad) => {
	let url = urls.GEO_CLOUD.LIST_NEIGHBOURHOOD_MEMBER;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const assignAdminService = (requestLoad) => {
	let url = urls.GEO_CLOUD.ASSIGN_ADMIN;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
