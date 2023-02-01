import { executePost } from "../apis/postORput";
import urls from "../../constants/env/urls";

export const AddMemberInGroup = (requestLoad) => {
	let url = urls.USER.ADD_MEMBER_IN_GROUP;
	let actionCode = "ACTION_GROUP-ADD-MEMBER_REQUEST";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
