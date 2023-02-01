import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const RemoveFriendFromGroup = (requestLoad) => {
	const url = urls.USER.REMOVE_MEMBER_FROM_GROUP;
	const actionCode = "ACTION_REMOVE-MEMBER_CONNECTION";
	const payload = requestLoad;
	const method = "POST";

	return executePost(url, actionCode, payload, method, false);
};
