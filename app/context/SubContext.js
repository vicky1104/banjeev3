import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { MainContext } from "./MainContext";
import {
	Feather,
	FontAwesome,
	FontAwesome5,
	MaterialIcons,
} from "@expo/vector-icons";
import { useRef } from "react";

function SubContext({ children }) {
	// const { navigate } = useNavigation();
	const c = [
		{
			name: "Feed",
			iconType: Feather,
			iconName: "edit",
			iconSize: 22,
			title: "Create Post",
			onPress: () => navigate("CreateFeed"),
		},
		{
			name: "Blogs",
			iconType: FontAwesome5,
			iconName: "blog",
			iconSize: 22,
			title: "Create Blog",
			onPress: () => navigate("CreateBlog"),
		},
		{
			name: "Alerts",
			iconType: Feather,
			iconName: "alert-triangle",
			iconSize: 22,
			title: "Create Alert",
			onPress: () => navigate("SelectAlertLocation"),
		},
	];
	const [imageBg, setImageBg] = useState(null);
	const [feedData, setFeedData] = useState({});
	const [room, setRoom] = useState({});
	const [darkMode, setDarkMode] = useState("light");
	// const [colors, setcolors] = useState();
	const [items, setItems] = useState(c);
	// const color = useColorScheme();
	const [postId, setPostId] = useState();
	const [blogComment, setBlogComment] = useState(false);
	const [commentCount, setCommentCount] = useState(null);
	const [incidentCount, setIncidentCount] = useState(null);
	const [alertId, setAlertId] = useState(null);
	const [toggleFeed, setToggleFeed] = useState(false);
	const [audios, setAudios] = useState(false);
	const [openPostModal, setOpenPostModal] = useState(false);
	const [modalData, setModalData] = useState();
	// const colorHandler = useCallback(() => {
	// 	setDarkMode(color === "dark" ? "light" : "dark");

	// 	// light mode colors

	// 	// primary: "#dd4269",
	// 	// white: "#ffffff",
	// 	// black: "#000000",
	// 	// gradientWhite: "#ffffff",
	// 	// gradientBlack: "#000001",
	// 	// card: "#f3f3f6",
	// 	// transparent: "#ffffff00",
	// 	// shadow: "grey",
	// 	// link: "#087bff",
	// 	// drawerGrey: "rgba(052,053,061,1)",
	// 	// drawerDarkGrey: "rgba(036,036,042,1)",
	// 	// activeGreen: "#57B862",
	// 	// gradient: "#c53b7d",
	// 	// lightGrey: "#E8E8E8",
	// 	// grey: "#A6A6A4",
	// 	// greyText: "#575757",
	// 	// line: "#dcdcdc",
	// 	// textBG: "#F7FBFF",
	// 	// lightWhite: "#ffffff",
	// 	// subTitle: "#575757",
	// 	// border: "#ffffff",

	// 	setcolors(
	// 		color === "dark"
	// 			? {
	// 					// primary: "linear-gradient(180deg, #ED475C , #A93294 )",
	// 					primary: "#FFF",
	// 					// primary: "#D84568",
	// 					white: "#000000",
	// 					black: "#ffffff",
	// 					gradientWhite: "#202124",
	// 					gradientBlack: "#686868",
	// 					card: "#f3f3f6",
	// 					transparent: "#ffffff00",
	// 					shadow: "grey",
	// 					link: "#087bff",
	// 					drawerGrey: "rgba(052,053,061,1)",
	// 					drawerDarkGrey: "rgba(036,036,042,1)",
	// 					activeGreen: "#57B862",
	// 					gradient: "#c53b7d",
	// 					lightGrey: "#E8E8E8",
	// 					grey: "#A6A6A4",
	// 					greyText: "#575757",
	// 					line: "#dcdcdc",
	// 					textBG: "#F7FBFF",
	// 					lightWhite: "#403f3f",
	// 					subTitle: "#E0E0E0",
	// 					border: "#575757",
	// 			  }
	// 			: {
	// 					// 			// primary: "linear-gradient(180deg, #ED475C , #A93294 )",
	// 					primary: "#FFF",
	// 					white: "#000000",
	// 					black: "#ffffff",
	// 					gradientWhite: "#202124",
	// 					gradientBlack: "#686868",
	// 					card: "#f3f3f6",
	// 					transparent: "#ffffff00",
	// 					shadow: "grey",
	// 					link: "#087bff",
	// 					drawerGrey: "rgba(052,053,061,1)",
	// 					drawerDarkGrey: "rgba(036,036,042,1)",
	// 					activeGreen: "#57B862",
	// 					gradient: "#c53b7d",
	// 					lightGrey: "#E8E8E8",
	// 					grey: "#A6A6A4",
	// 					greyText: "#575757",
	// 					line: "#dcdcdc",
	// 					textBG: "#F7FBFF",
	// 					lightWhite: "#403f3f",
	// 					subTitle: "#E0E0E0",
	// 					border: "#575757",
	// 			  }
	// 	);
	// }, [color]);

	const BGColorContextHandler = React.useCallback((data) => {
		setImageBg(data);
	}, []);

	const SinglePostContextHandler = React.useCallback((data) => {
		setSinglePost(data);
	}, []);

	return (
		<MainContext.Provider
			value={{
				imageBG: imageBg,
				setImageBg: BGColorContextHandler,
				feedData,
				createFeedData: setFeedData,
				room,
				setRoom,
				darkMode,
				setDarkMode: setDarkMode,
				// colors: colors,
				// setColors: colorHandler,
				items,
				setItems,
				postId,

				setPostId,

				commentCount,
				setCommentCount,

				blogComment,
				setBlogComment,
				incidentCount,
				setIncidentCount,
				alertId,
				setAlertId,
				toggleFeed,
				setToggleFeed,
				audios,
				setAudios,
				openPostModal,
				setOpenPostModal,
				modalData,
				setModalData,
			}}
		>
			{children}
		</MainContext.Provider>
	);
}

export default SubContext;
