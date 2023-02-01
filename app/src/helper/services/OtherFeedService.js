import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

export const OtherFeedService = (reqload) => {
	const url = urls.OTHER_POST;
	const actionCode = null;
	const payload = reqload;
	const method = "POST";

	return executePost(url, actionCode, payload, method, {});
};
