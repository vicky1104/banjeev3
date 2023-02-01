import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";

const API_KEY = "2an1ZhO16wRaU46OokZ4HOEOKnmMISU8";

export const randomGif = (limit) => {
	let url = urls.GIF.RANDOM_GIF + API_KEY + "&limit=" + limit + "&rating=g";
	let actionCode = "";
	let method = "GET";
	return executeGet(url, actionCode, {}, method, null);
};
