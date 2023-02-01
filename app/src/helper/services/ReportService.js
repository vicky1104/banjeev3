import urls from "../../constants/env/urls";
import { executePost } from "../apis/postORput";

const ReportUserService = (requestLoad) => {
	let url = urls.USER.CREATE_REPORT;
	let actionCode = "ACTION_CREATE_REPORT";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export default ReportUserService;
