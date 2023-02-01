import urls from "../../constants/env/urls";
import { executeGet } from "../apis/getORdelete";
import { executePost } from "../apis/postORput";

export const CreateRoomService = (requestLoad) => {
	let url = urls.ROOM.CREATE;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const GetAllRooms = (requestLoad) => {
	let url = urls.ROOM.GET_ALL;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";

	return executePost(url, actionCode, payload, method, {});
};

export const GetChatRoom = (requestLoad) => {
	let url = urls.ROOM.GET_ROOM + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";

	return executeGet(url, actionCode, payload, method, {});
};
