import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const listMyNeighbourhood = () => {
	const url = urls.GEO_CLOUD.LISTMYNEIGHBOURHOOD;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};
export const listAllNeighbourhood = (reqLoad) => {
	const url = urls.GEO_CLOUD.LISTALLNEIGHBOURHOOD;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";
	return executePost(url, actionCode, payload, method, {});
};

export const leaveNeighbourhoodService = (id) => {
	const url = urls.GEO_CLOUD.LEAVE_NEIGHBOURHOOD + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};

export const joinNeighbourhoodService = (id) => {
	const url = urls.GEO_CLOUD.JOIN_NEIGHBOURHOOD + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method, {});
};

export const listMyNHService = () => {
	const url = urls.GEO_CLOUD.MY_CLOUD_LIST;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const removeMemberFromNHService = (id) => {
	const url = urls.GEO_CLOUD.CANCEL_MEMBER + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
export const quitNHService = (reqLoad) => {
	const url = urls.GEO_CLOUD.QUIT_NH;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const createNeighbourhoodService = (reqLoad) => {
	const url = urls.GEO_CLOUD.CREATE_NEIGHBOURHOOD;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
export const switchNeighbourhoodService = (reqLoad) => {
	const url = urls.GEO_CLOUD.SWITCH_CLOUD;
	const actionCode = "";
	const payload = reqLoad;
	const method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
