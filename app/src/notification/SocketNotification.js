import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import SocketContext from "../Context/Socket";
import { AppContext } from "../Context/AppContext";
import { getLocalStorage } from "../utils/Cache/TempStorage";

function GetSocketNotification() {
	const { userData, setEmergency } = useContext(AppContext);
	const state = useNavigation();

	const messageChannel = {
		channelId: "Banjee_Message_Channel",
		foreground: true,
		channelName: "banjee message channel",
		playSound: true,
		soundName: "message.mp3",
		vibrate: true,
	};
	const callChannel = {
		channelId: "Banjee_Call_Channel",
		foreground: true,
		channelName: "banjee call channel",
		soundName: "call.mp3",
		playSound: true,
		vibrate: true,
	};
	const emergencyMessageChannel = {
		channelId: "Banjee_Emergency_Channel",
		foreground: true,
		channelName: "banjee emergency channel",
		soundName: "emergency.mp3",
		playSound: true,
		vibrate: true,
	};
	const alertMessageChannel = {
		channelId: "Banjee_Alert_Channel",
		foreground: true,
		channelName: "banjee alert channel",
		playSound: true,
		soundName: "alert.mp3",
		vibrate: true,
	};

	const { socket } = React.useContext(SocketContext);
	const { setUnreadMessage, setUserUnreadMsg } = React.useContext(AppContext);

	const renderMessage = (content) => {
		let type = content.mimeType.split("/")[0];
		switch (type) {
			case "plain":
				return "text message";
			case "audio":
				return "audio message";
			case "image":
				return "image";
			case "video":
				return "video";
			default:
				return "message";
		}
	};

	const onChatMessageReceive = React.useCallback((message, systemUserId) => {
		console.warn("message", message);
		let activeScreen = state?.getCurrentRoute();
		if (message?.senderId !== systemUserId) {
			if (activeScreen.name === "BanjeeUserChatScreen") {
				if (activeScreen?.params?.item?.roomId !== message?.roomId) {
					PushNotification.localNotification({
						...messageChannel,
						id: "3434",
						title: `${message?.sender?.firstName || "Someone"} ${
							message?.sender?.lastName || ""
						}`,
						message: message.group
							? `Sent a message on ${message?.groupName || message?.name || "group"}`
							: `Sent you a Private Message`,
						foreground: true,
						data: {
							...message,
							fromSocket: true,
							click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
						},
						userInfo: {
							...message,
							fromSocket: true,
							click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
						},
						action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
					});
				}
			} else {
				if (activeScreen.name !== "Contacts") {
					PushNotification.localNotification({
						...messageChannel,
						id: "3434",
						title: `${message?.sender?.firstName || "Someone"} ${
							message?.sender?.lastName || ""
						}`,
						message: message.group
							? `Sent a message on ${message?.groupName || message?.name || "group"}`
							: `Sent you a Private Message`,
						foreground: true,
						data: {
							...message,
							fromSocket: true,
							click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
						},
						userInfo: {
							...message,
							fromSocket: true,
							click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
						},
						action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
					});
				}
				setUserUnreadMsg((pre) => ({
					...pre,
					[message?.roomId]:
						pre && pre?.[message?.roomId]
							? [...pre?.[message?.roomId], message]
							: [message],
				}));
				setUnreadMessage(true);
			}
			// PushNotificationIOS.addNotificationRequest({
			// 	...messageChannel,
			// 	id: "1567577",
			// 	title: `${message.sender.firstName} ${message.sender.lastName}`,
			// 	subtitle: `Send ${renderMessage(message.content)} in chat`,
			// 	body: `Send ${renderMessage(message.content)} in chat`,
			// 	repeats: false,
			// 	repeatsComponent: {
			// 		year: false,
			// 		month: false,
			// 		day: false,
			// 		dayOfWeek: false,
			// 		hour: false,
			// 		minute: false,
			// 		second: false,
			// 	},
			// userInfo: {
			// 	...message,
			// 	fromSocket: true,
			// },
			// });
		}
	}, []);

	const onAdminNotificationReceive = React.useCallback(
		(message, systemUserId) => {
			// if (message?.initiatorId !== systemUserId) {
			PushNotification.localNotification({
				...messageChannel,
				title: `${message?.eventName || "Event"}`,
				message: message?.description || "Description",
				foreground: true,
				data: {
					...message,
					fromSocket: true,
					click_action: "ADMIN_NOTIFICATION",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "ADMIN_NOTIFICATION",
				},
				action: "ADMIN_NOTIFICATION",
			});
			// }
		},
		[]
	);

	const onChatMessageReactionReceive = (message, systemUserId) => {
		let activeScreen = state?.getCurrentRoute();
		if (message?.senderId === systemUserId) {
			if (activeScreen.name === "BanjeeUserChatScreen") {
				if (activeScreen?.params?.item?.roomId !== message?.roomId) {
					PushNotification.localNotification({
						...messageChannel,
						title: `${message?.receiver?.firstName || "Someone"} ${
							message?.receiver?.lastName || ""
						}`,
						message: `Reacted on your message`,
						foreground: true,
						data: {
							...message,
							fromSocket: true,
							click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
						},
						userInfo: {
							...message,
							fromSocket: true,
							click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
						},
						action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
					});
				}
			} else {
				PushNotification.localNotification({
					...messageChannel,
					title: `${message?.receiver?.firstName || "Someone"} ${
						message?.receiver?.lastName || ""
					}`,
					message: `Reacted on your message`,
					foreground: true,
					data: {
						...message,
						fromSocket: true,
						click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
					},
					userInfo: {
						...message,
						fromSocket: true,
						click_action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
					},
					action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
				});
				if (activeScreen.name !== "Contacts") {
					setUnreadMessage(true);
				}
			}
			// PushNotification.localNotification({
			// 	...messageChannel,
			// 	title: `${message.sender.firstName} reacted on your message`,
			// 	message: `${message.sender.firstName} reacted on your message`,
			// 	foreground: true,
			// 	data: {
			// 		...message,
			// 		fromSocket: true,
			// 	},
			// 	userInfo: {
			// 		...message,
			// 		fromSocket: true,
			// 	},
			// 	action: message?.group ? "OPEN_GROUP_CHAT" : "OPEN_CHAT",
			// });
		}
	};

	const onEmergencyReceive = (message, systemUserId) => {
		if (message?.senderId !== systemUserId) {
			setEmergency({ open: true, ...message });
		}
	};
	const onMissedCallReceive = (message, systemUserId) => {
		if (message?.senderId !== systemUserId) {
			PushNotification.cancelLocalNotification(1);
			PushNotification.localNotification({
				...messageChannel,
				title: `${message?.sender?.firstName} ${message?.sender?.lastName}`,
				message: `Missed ${message.callType === "audio" ? "Voice" : "Video"} Call`,
				data: {
					...message,
					fromSocket: true,
					click_action: "MISSED_CALL",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "MISSED_CALL",
				},
				action: "MISSED_CALL",
			});
		}
	};
	const onCallReceive = (message, systemUserId) => {
		if (message?.senderId !== systemUserId) {
			getLocalStorage("CallType")
				.then((res) => {
					if (res && JSON.parse(res) && JSON.parse(res) === "Broadcast") {
						console.log("Broadcast is running");
						PushNotification.cancelLocalNotification(1);
						PushNotification.localNotification({
							...messageChannel,
							title: `${message?.sender?.firstName} ${message?.sender?.lastName}`,
							message: `Missed ${
								message.callType === "audio" ? "Voice" : "Video"
							} Call`,
							userInteraction: false,
						});
					} else {
						PushNotification.localNotification({
							...callChannel,
							id: 1,
							title: `Incoming ${
								message?.callType === "audio" ? "Audio" : "Video"
							} Call`,
							message: `${message?.sender?.firstName || "someone"} ${
								message?.sender?.lastName || ""
							} Calling...`,
							action: "ANSWER_CALL",
							userInteraction: true,
							data: {
								...message,
								fromSocket: true,
								click_action: "ANSWER_CALL",
							},
							userInfo: {
								...message,
								fromSocket: true,
								click_action: "ANSWER_CALL",
							},
						});
					}
				})
				.catch(() => {
					PushNotification.localNotification({
						...callChannel,
						id: 1,
						title: `Incoming ${
							message?.callType === "audio" ? "Audio" : "Video"
						} Call`,
						message: `${message?.sender?.firstName || "someone"} ${
							message?.sender?.lastName || ""
						} Calling...`,
						action: "ANSWER_CALL",
						userInteraction: true,
						data: {
							...message,
							fromSocket: true,
							click_action: "ANSWER_CALL",
						},
						userInfo: {
							...message,
							fromSocket: true,
							click_action: "ANSWER_CALL",
						},
					});
				});
		}
	};

	const onGroupStartedReceive = React.useCallback((message, systemUserId) => {
		if (message?.initiatorId !== systemUserId) {
			getLocalStorage("CallType")
				.then((res) => {
					if (res && JSON.parse(res) && JSON.parse(res) === "Broadcast") {
						PushNotification.localNotification({
							...callChannel,
							id: 2,
							title: `${message?.chatRoomName || "group"} is LIVE!`,
							message: `The ADMIN started the call...`,
							foreground: true,
							userInteraction: false,
						});
					} else {
						PushNotification.localNotification({
							...callChannel,
							id: 2,
							title: `${message?.chatRoomName || "group"} is LIVE!`,
							message: `The ADMIN started the call...`,
							foreground: true,
							data: {
								...message,
								fromSocket: true,
								click_action: "JOIN_GROUP_CALL",
							},
							userInfo: {
								...message,
								fromSocket: true,
								click_action: "JOIN_GROUP_CALL",
							},
							action: "JOIN_GROUP_CALL",
						});
					}
				})
				.catch(() => {
					PushNotification.localNotification({
						...callChannel,
						id: 2,
						title: `${message?.chatRoomName || "group"} is LIVE!`,
						message: `The ADMIN started the call...`,
						foreground: true,
						data: {
							...message,
							fromSocket: true,
							click_action: "JOIN_GROUP_CALL",
						},
						userInfo: {
							...message,
							fromSocket: true,
							click_action: "JOIN_GROUP_CALL",
						},
						action: "JOIN_GROUP_CALL",
					});
				});
		}
	}, []);

	const neighbourhoodBroadcastingStart = (message, systemUserId) => {
		if (message?.hostId !== systemUserId) {
			PushNotification.localNotification({
				...callChannel,
				id: 1,
				title: `${message?.name} is LIVE`,
				message: `The admin started broadcasting.`,
				action: "JOIN_BROADCAST",
				userInteraction: true,
				data: {
					...message,
					fromSocket: true,
					click_action: "JOIN_BROADCAST",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "JOIN_BROADCAST",
				},
			});
		}
	};

	const onNewAlertReceive = (message, systemUserId) => {
		if (message?.createdBy !== systemUserId) {
			PushNotification.localNotification({
				...alertMessageChannel,
				title: `ALERT`,
				message: `There is a ${message?.eventName || ""} alert near you.`,
				userInteraction: true,
				action: "OPEN_ALERT",
				data: {
					...message,
					fromSocket: true,
					click_action: "OPEN_ALERT",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "OPEN_ALERT",
				},
			});
		}
	};
	const addMemberGroup = (message, systemUserId) => {
		// console.warn("message --->>> add group ---->>", message);
		if (message?.createdBy !== systemUserId) {
			PushNotification.localNotification({
				...messageChannel,
				title: `Welcome to ${message?.payload?.name}`,
				message: `${message?.createdByUser?.firstName || "Someone"} ${
					message?.createdByUser?.lastName || ""
				} added you to ${message?.payload?.name}`,
				userInteraction: true,
				action: "OPEN_GROUP",
				data: {
					...message,
					fromSocket: true,
					click_action: "OPEN_GROUP",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "OPEN_GROUP",
				},
			});
		}
	};

	const newAlertComment = (message, systemUserId) => {
		if (message?.sender?.id !== systemUserId) {
			PushNotification.localNotification({
				...messageChannel,
				title: `${message?.sender?.firstName || "Someone"} ${
					message?.sender?.lastName || ""
				} commented on alert`,
				message: `${message?.contents?.text || "message"}`,
				userInteraction: true,
				action: "OPEN_ALERT",
				data: {
					...message,
					fromSocket: true,
					click_action: "OPEN_ALERT",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "OPEN_ALERT",
				},
			});
		}
	};

	const reactionBlog = (message, systemUserId) => {
		if (message?.sender?.id !== systemUserId) {
			PushNotification.localNotification({
				...messageChannel,
				title: `Banjee`,
				message: `${message?.sender?.firstName || "Someone"} ${
					message?.sender?.lastName || ""
				} liked your blog`,
				userInteraction: true,
				action: "OPEN_BLOG",
				data: {
					...message,
					fromSocket: true,
					click_action: "OPEN_BLOG",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "OPEN_BLOG",
				},
			});
		}
	};

	const newBlogComment = (message, systemUserId) => {
		if (message?.sender?.id !== systemUserId) {
			PushNotification.localNotification({
				...messageChannel,
				title: `${message?.sender?.firstName || "Someone"} ${
					message?.sender?.lastName || ""
				} commented on blog`,
				message: `${message?.contents?.text || "message"}`,
				userInteraction: true,
				action: "OPEN_BLOG",
				data: {
					...message,
					fromSocket: true,
					click_action: "OPEN_BLOG",
				},
				userInfo: {
					...message,
					fromSocket: true,
					click_action: "OPEN_BLOG",
				},
			});
		}
	};

	const userCloud = (message, systemUserId) => {
		// console.log("messagee --->", message);
		PushNotification.localNotification({
			...messageChannel,
			title: `Banjee Admin`,
			message: `Yaay! We have approved your Neighbourhood request. Now you can join your Neighbourhood.`,
			userInteraction: true,
			action: "OPEN_NEIGHBOURHOOD",
			data: {
				...message,
				fromSocket: true,
				click_action: "OPEN_NEIGHBOURHOOD",
			},
			userInfo: {
				...message,
				fromSocket: true,
				click_action: "OPEN_NEIGHBOURHOOD",
			},
		});
	};
	const feedCommentRecieve = (message, systemUserId, type) => {
		// console.log("messagee --->", message);
		PushNotification.localNotification({
			...messageChannel,
			title: `${message.payload.createdByUser.firstName} ${message.payload.createdByUser.lastName}`,
			message: `Commented on your feed`,
			userInteraction: true,
			action: "OPEN_FEED",
			data: {
				...message,
				fromSocket: true,
				click_action: "OPEN_FEED",
			},
			userInfo: {
				...message,
				fromSocket: true,
				click_action: "OPEN_FEED",
			},
		});
	};
	const feedReactionRecieve = (message, systemUserId, type) => {
		// console.log("messagee --->", message);
		PushNotification.localNotification({
			...messageChannel,
			title: `${message.user.firstName} ${message.user.lastName}`,
			message: `Reacted on your feed`,
			userInteraction: true,
			action: "OPEN_FEED",
			data: {
				...message,
				fromSocket: true,
				click_action: "OPEN_FEED",
			},
			userInfo: {
				...message,
				fromSocket: true,
				click_action: "OPEN_FEED",
			},
		});
	};

	// const sendNotificationCall = (message) => {
	// 	PushNotification.localNotification({
	// 		title: `Incoming ${message.callType} Call`,
	// 		message: `from ${message.initiator.firstName}`,
	// 		actions: ["Answer", "Decline"],
	// 	});
	// };

	// const callDisconnectNotification = (message) => {
	// 	PushNotification.localNotification({
	// 		title: `Missed Call`,
	// 		message: `from ${message.initiator.firstName}`,
	// 	});
	// };

	const getLocalStorageFunc = React.useCallback(() => {
		if (userData) {
			const { id } = userData;
			socket &&
				socket.addEventListener("message", ({ data }) => {
					const { action, data: messageData } = JSON.parse(data);
					// console.log("chat message action", action);
					switch (action) {
						case "CHAT_MESSAGE":
						case "GROUP_CHAT_MESSAGE":
							onChatMessageReceive(messageData, id);
							break;
						case "REACTION_MESSAGE":
							onChatMessageReactionReceive(messageData, id);
							break;
						case "INCOMING_CALL":
							onCallReceive(messageData, id);
							break;
						case "MISSED_CALL":
							onMissedCallReceive(messageData, id);
							break;
						case "GROUP_CALL_STARTED":
							onGroupStartedReceive(messageData, id);
							break;
						case "NEW_ALERT":
							onNewAlertReceive(messageData, id);
							break;
						case "ADMIN_NOTIFICATION":
							onAdminNotificationReceive(messageData, id);
							break;
						case "EMERGENCY":
							onEmergencyReceive(messageData, id);
							break;
						case "ADD_MEMBER_GROUP":
							addMemberGroup(messageData, id);
							break;
						case "NEW_ALERT_COMMENT":
							newAlertComment(messageData, id);
							break;
						case "REACTION_BLOG":
							reactionBlog(messageData, id);
							break;
						case "NEW_BLOG_COMMENT":
							newBlogComment(messageData, id);
							break;

						case "NEW_COMMENT":
							feedCommentRecieve(messageData, id, "comment");
							break;
						case "FEED_REACTION":
							feedReactionRecieve(messageData, id, "reaction");
							break;

						case "USER_CLOUD":
							userCloud(messageData, id);
							break;
						case "NEIGHBOURHOOD_BROADCASTING_STARTED":
							neighbourhoodBroadcastingStart(messageData, id);
							break;
						// case "NEW_FEED":
						// 	newBlogComment(messageData, id);
						// 	break;
						default:
							break;
					}
				});
		}
	}, [socket, userData]);

	React.useEffect(() => {
		getLocalStorageFunc();
	}, [getLocalStorageFunc]);

	return null;
}

export default GetSocketNotification;
