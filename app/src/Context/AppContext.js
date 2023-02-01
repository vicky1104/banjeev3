import React, { createContext, useEffect, useState } from "react";
import { memo } from "react";

export const AppContext = createContext({
	profile: null,
	token: "loading",
	location: null,
	userData: null,
	neighbourhood: "loading",
	emergency: { open: false },
	chatScreen: "",
	setEmergency: () => {},

	setProfile: () => {},
	setToken: () => {},
	setLocation: () => {},
	setUserData: () => {},
	setNeighbourhood: () => {},
	setChatScreen: () => {},

	unreadMessage: false,
	setUnreadMessage: () => {},
	hideAddButton: false,
	setHideAddButton: () => {},

	activeCallTimer: 0,
	setActiveCallTimer: () => {},

	callType: false,
	setCallType: () => {},

	incomingCallModal: { open: false, data: false },
	setIncomingCallModal: () => {},

	isLoaded: false,
	setIsLoaded: () => {},

	userUnreadMsg: {},
	setUserUnreadMsg: () => {},
});

function AppContextComponent({ children }) {
	const [userProfile, setUserProfile] = useState(null);
	const [userToken, setUserToken] = useState("loading");
	const [userTokenData, setUserTokenData] = useState(null);
	const [userNeighbourhood, setUserNeighbourhood] = useState("loading");
	const [userLocation, setUserLocation] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [emergency, setEmergency] = useState({ open: false });
	const [chatScreen, setChatScreen] = useState("");
	const [unreadMessage, setUnreadMessage] = useState(false);
	const [hideAddButton, setHideAddButton] = useState(false);
	const [activeCallTimer, setActiveCallTimer] = useState(0);
	const [callType, setCallType] = useState(false);
	const [userUnreadMsg, setUserUnreadMsg] = useState({});
	const [incomingCallModal, setIncomingCallModal] = useState({
		open: false,
		data: false,
	});

	return (
		<AppContext.Provider
			value={{
				profile: userProfile,
				token: userToken,
				isLoaded,
				setIsLoaded,
				userData: userTokenData,
				neighbourhood: userNeighbourhood,
				location: userLocation,
				emergency: emergency,
				chatScreen: chatScreen,
				unreadMessage: unreadMessage,
				setLocation: setUserLocation,
				setProfile: setUserProfile,
				setToken: setUserToken,
				setUserData: setUserTokenData,
				setNeighbourhood: setUserNeighbourhood,
				setEmergency: setEmergency,
				setChatScreen: setChatScreen,
				setUserUnreadMsg,
				userUnreadMsg,
				setUnreadMessage: setUnreadMessage,

				hideAddButton: hideAddButton,
				setHideAddButton: setHideAddButton,

				activeCallTimer: activeCallTimer,
				setActiveCallTimer: setActiveCallTimer,

				callType: callType,
				setCallType: setCallType,

				incomingCallModal: incomingCallModal,
				setIncomingCallModal: setIncomingCallModal,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export default memo(AppContextComponent);
