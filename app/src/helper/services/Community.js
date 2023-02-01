import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const getMyGroupService = (id) => {
	const url = urls.GEO_CLOUD.COMMUNITY.MY_GROUP_LIST;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};

export const filterGroupService = (params) => {
	const url = urls.GEO_CLOUD.COMMUNITY.FILTER_GROUP;
	const actionCode = "";
	const payload = params;
	const method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const AddMemberInCommunityService = (params) => {
	const url = urls.GEO_CLOUD.COMMUNITY.ADD_MEMBER_GROUP;
	const actionCode = "";
	const payload = params;
	const method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const joinGroupService = (params) => {
	const url = urls.GEO_CLOUD.COMMUNITY.JOIN + params;
	const actionCode = "";
	const payload = {};
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const leaveGroupService = (params) => {
	const url = urls.GEO_CLOUD.COMMUNITY.LEAVE + params;
	const actionCode = "";
	const payload = {};
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};

export const groupFindByIdService = (params) => {
	const url = urls.GEO_CLOUD.COMMUNITY.FIND_BY_ID + params;
	const actionCode = "";
	const payload = {};
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
