import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const CreateGroupService = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY.GROUP;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const UpdateGroupService = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY.GROUP;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";

	return executePost(url, actionCode, payload, method, {});
};
