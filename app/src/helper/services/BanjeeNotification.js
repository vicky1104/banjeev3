import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";

export const MarkAsReadNotification = (id) => {
	const url = urls.RTC.CHAT.READ_NOTIFICATION + id;
	const actionCode = "";
	const payload = "";
	const method = "GET";
	return executeGet(url, actionCode, payload, method);
};
