import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const MyPostFeed = (reqload) => {
	let url = urls.MYPOST;
	let actionCode = null;
	let payload = reqload;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
