import React from "react";

export const MainContext = React.createContext({
	imageBG: {},
	setImageBg: () => {},
	feedData: {},
	createFeedData: () => {},
	room: {},
	setRoom: () => {},
	darkMode: {},
	setDarkMode: () => {},
	colors: {},
	// setColor: () => {},
	// setColors: () => {},
	items: [],
	setItems: () => {},

	// ============================================================ for commentSheet

	postId: {},
	setPostId: () => {},
	blogComment: {},
	setBlogComment: () => {},
	commentCount: {},
	setCommentCount: () => {},

	incidentCount: {},
	setIncidentCount: () => {},

	alertId: {},
	setAlertId: () => {},
	toggleFeed: false,
	setToggleFeed: () => {},
	audios: null,
	setAudios: () => {},

	openPostModal: false,
	setOpenPostModal: () => {},

	modalData: {},
	setModalData: () => {},
});
