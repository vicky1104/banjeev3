import { useState } from "react";
import { MainChatContext } from "./MainChatContext";
import React from "react";
import MainChatScreenComp from "./MainChatComp";

const MainChatScreen = () => {
	const [chat, setChat] = useState([]);
	const [chatUser, setChatUser] = useState({});

	return (
		<MainChatContext.Provider
			value={{
				chat,
				setChat,
				chatUser,
				setChatUser,
			}}
		>
			<MainChatScreenComp />
		</MainChatContext.Provider>
	);
};

export default MainChatScreen;
