import React, { createContext } from "react";

// import {
//   getApiChatMessage,
//   clearChatMessageState,
// } from "../../../redux/store/action/chatMessageActions";

export const MainChatContext = createContext({
	chat: [],
	setChat: () => {},
	chatUser: {},
	setChatUser: () => {},
});
