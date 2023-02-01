import React from "react";
import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import InCallManager from "react-native-incall-manager";
import SocketContext from "../Context/Socket";
// import { GetChatRoom } from "../helper/services/RoomServices";
import { showToast } from "../constants/components/ShowToast";
import axios from "axios";
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { AppContext } from "../Context/AppContext";
import { MainContext } from "../../context/MainContext";

export default function NotificationActionsHandler() {
	const { navigate, goBack } = useNavigation();
	const { socket } = React.useContext(SocketContext);
	const { setEmergency } = React.useContext(AppContext);
	const { setModalData, setOpenPostModal } = React.useContext(MainContext);

	const getUid = (mobile) => {
		if (mobile.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	};

	const rejectCall = (data) => {
		socket.send(
			JSON.stringify({
				action: "REJECT_CALL",
				data: {
					sender: {
						firstName: data?.receiver?.firstName,
						lastName: data?.receiver?.lastName,
					},
					senderId: data?.receiverId,
					receiver: {
						firstName: data?.sender?.firstName,
						lastName: data?.sender?.lastName,
					},
					receiverId: data?.senderId,
					roomId: data?.roomId,
					callType: data?.callType,
				},
			})
		);
		goBack();
		InCallManager.stopRingtone();
	};

	const acceptCall = (data) => {
		navigate("OneToOneCall", {
			...data,
			firstName: data?.senderFirstName,
			lastName: data?.senderLastName,
			mobile: data?.receiverMobile,
			senderId: data?.senderId,
			userId: data?.senderId,
			initiator: false,
			fromNotification: true,
		});
	};

	const missedCall = (data) => {
		navigate("BanjeeUserChatScreen", {
			item: {
				group: false,
				firstName:
					data?.senderFirstName || data?.sender?.firstName || data?.firstName || "",
				lastName:
					data?.senderLastName || data?.sender?.lastName || data?.lastName || "",
				roomId: data?.roomId || "",
				userId: data?.senderId || data?.sender?.id || data?.id || "",
				fromNotification: true,
			},
		});
	};

	const backToCall = (data) => {
		navigate("OneToOneCall", {
			fromFixedNotification: true,
		});
	};
	const backToGroupCall = (data) => {
		navigate("GroupCall", {
			fromFixedNotification: true,
		});
	};

	const groupChat = (data) => {
		navigate("BanjeeUserChatScreen", {
			item: {
				group: true,
				name: data?.groupName || "Name",
				roomId: data?.roomId || "",
				fromNotification: true,
				imageUrl: data?.imageUrl,
			},
		});
	};

	const personalChat = (data) => {
		navigate("BanjeeUserChatScreen", {
			item: {
				group: false,
				firstName: data?.sender?.firstName || data?.firstName || "",
				lastName: data?.sender?.lastName || data?.lastName || "",
				roomId: data?.roomId || "",
				userId: data?.sender?.id || data?.senderId || data?.id || "",
				fromNotification: true,
			},
		});
	};

	const navigateToUserChat = (data, group, check) => {
		if (check) {
			goBack();
			if (group) {
				groupChat({ ...data, groupName: data?.name });
			} else {
				personalChat(data);
			}
		} else {
			if (group) {
				groupChat({ ...data, groupName: data?.name });
			} else {
				personalChat(data);
			}
		}
	};

	const joinGroupCall = (data) => {
		axios
			.get(
				"https://gateway.banjee.org/services/message-broker/api/rooms/findByRoomId/" +
					data?.chatRoomId
			)
			.then((res) => {
				// alert("groupcall");
				console.warn(res.data, {
					cloudId: data?.cloudId,
					chatRoomId: data?.chatRoomId,
					chatRoomName: data?.chatRoomName,
					chatRoomImage: data?.chatRoomImage,
					userObject: {
						firstName: data?.userObject?.firstName || data?.rFirstName || "",
						lastName: data?.userObject?.lastName || data?.rLastName || "",
						id: data?.userObject?.id || data?.rId || "",
						mobile: data?.userObject?.mobile || data?.rMobile || "",
						email: data?.userObject?.email || data?.rEmail || "",
						uid: data?.userObject?.uid || data?.rUid || "",
					},
					joinGroup: true,
					adminId: res.data?.createdByUser?.id,
				});
				if (res.data.live) {
					navigate("GroupCall", {
						cloudId: data?.cloudId,
						chatRoomId: data?.chatRoomId,
						chatRoomName: data?.chatRoomName,
						chatRoomImage: data?.chatRoomImage,
						userObject: {
							firstName: data?.userObject?.firstName || data?.rFirstName || "",
							lastName: data?.userObject?.lastName || data?.rLastName || "",
							id: data?.userObject?.id || data?.rId || "",
							mobile: data?.userObject?.mobile || data?.rMobile || "",
							email: data?.userObject?.email || data?.rEmail || "",
							uid: data?.userObject?.uid || data?.rUid || "",
						},
						joinGroup: true,
						adminId: res.data?.createdByUser?.id,
					});
				} else {
					showToast("Group call " + data?.chatRoomName + " has been ended.");
				}
			})
			.catch((err) => console.error(err));
	};

	const joinBroadcast = (data) => {
		console.warn("firebasedataaaa--------------", data);
		axios
			.get(
				`https://imydp54x0j.execute-api.eu-central-1.amazonaws.com/broadcast/status/${data?.cloudId}`
			)
			.then((res) => {
				if (res.data.data) {
					navigate("Broadcast", {
						cloudId: data?.cloudId || "",
						name: data?.name || "",
						imageUri: data?.imageUri || "",
						memberId: data?.memberObj?.id || data?.uId || "",
						memberObj: {
							id: data?.memberObj?.id || data?.uId || "",
							firstName: data?.memberObj?.firstName || data?.uFirstName || "",
							lastName: data?.memberObj?.lastName || data?.uLastName || "",
							email: data?.memberObj?.email || data?.uEmail || "",
							mobile: data?.memberObj?.mobile || data?.uMobile || "",
						},
						isHost: false,
					});
				} else {
					showToast("Broadcast " + data?.name + " has been ended.");
				}
			})
			.catch((err) => console.error(err));
	};

	const adminNotification = (data) => {
		navigate("FeedNotification", { adminNotification: true });
	};

	const newAlert = (data) => {
		navigate("DetailAlert", {
			alertId:
				data?.contents?.postId || data?.alertId || data?.contents?.id || data?.id,
		});
	};

	const newEmergencyAlert = (data) => {
		navigate("DetailEmergencyAlert", {
			alertId:
				data?.contents?.postId || data?.alertId || data?.contents?.id || data?.id,
		});
	};

	const openEmergencyAlert = (data) => {
		console.warn(data);
		setEmergency(data?.contents);
	};

	const openGroupDetail = (data) => {
		console.warn("action data", data);
		navigate("DetailGroup", {
			cloudId: data.cloudId,
			name: data.groupName ? data.groupName : data.payload.name,
		});
	};

	const openBlog = (data) => {
		console.warn("OPEN_BLOG action --->>> data", data);
		navigate("ViewBlog", {
			id: data?.contents?.postId || data?.blogId,
		});
	};

	const openNeighburhood = (data) => {
		console.warn("OPEN_BLOG action --->>> data", data);
		navigate("DetailNeighbourhood", {
			cloudId: data?.cloudId || data?.contents?.cloudId || "",
			cloudName: data?.cloudName || data?.contents?.cloudName || "",
		});
	};

	const openFeed = (data) => {
		if (data?.payload?.feedId || data?.nodeId) {
			setModalData({ feedID: data?.payload?.feedId || data?.nodeId || "" });
			setOpenPostModal(true);
		}
	};

	PushNotification.configure({
		onNotification: function (notification) {
			console.log("notification", notification);
			const { data } = notification;
			if (data?.fromSocket) {
				switch (data?.click_action) {
					case "ANSWER_CALL":
						acceptCall(data);
						break;
					case "MISSED_CALL":
						missedCall(data);
						break;
					case "JOIN_GROUP_CALL":
						joinGroupCall(data);
						break;
					case "ADMIN_NOTIFICATION":
						adminNotification(data);
						break;
					case "OPEN_GROUP_CHAT":
						navigateToUserChat(data, true, true);
						break;
					case "OPEN_CHAT":
						navigateToUserChat(data, false, true);
						break;
					case "ONETOONECALL":
						backToCall(data);
						break;
					case "GROUPCALL":
						backToGroupCall(data);
						break;
					case "OPEN_GROUP":
						openGroupDetail(data);
						break;
					case "OPEN_ALERT":
						newAlert(data);
						break;
					case "OPEN_BLOG":
						openBlog(data);
						break;
					case "OPEN_NEIGHBOURHOOD":
						openNeighburhood(data);
						break;
					case "JOIN_BROADCAST":
						joinBroadcast(data);
						break;
					case "OPEN_FEED":
						openFeed(data);
						break;
					default:
						break;
				}
			} else {
				switch (data.action) {
					case "ANSWER_CALL":
						acceptCall(data);
						break;
					case "MISSED_CALL":
						missedCall(data);
						break;
					case "OPEN_GROUP_CHAT":
						navigateToUserChat(data, true, false);
						break;
					case "OPEN_CHAT":
						navigateToUserChat(data, false, false);
						break;
					case "JOIN_GROUP_CALL":
						joinGroupCall(data);
						break;
					case "ADMIN_NOTIFICATION":
						adminNotification(data);
						break;
					case "OPEN_ALERT":
						newAlert(data);
						break;
					case "OPEN_EMERGENCY_ALERT":
						newEmergencyAlert(data);
						break;
					case "OPEN_GROUP":
						openGroupDetail(data);
						break;
					case "OPEN_BLOG":
						openBlog(data);
						break;
					case "OPEN_NEIGHBOURHOOD":
						openNeighburhood(data);
						break;
					case "JOIN_BROADCAST":
						joinBroadcast(data);
						break;
					case "OPEN_FEED":
						openFeed(data);
						break;
					default:
						break;
				}
			}
			// console.warn("click.....", action, data);
		},
		onAction: function (notification) {
			console.error("ACTION:", notification.action);
			console.error("NOTIFICATION:", notification);
		},
		permissions: {
			alert: true,
			badge: true,
			sound: true,
		},
		popInitialNotification: true,
		requestPermissions: true,
	});

	// React.useEffect(() => {
	// 	PushNotificationIOS.addEventListener("localNotification", (e) => {
	// 		// alert("ios nottt");
	// 		console.warn("ios push notification", e);
	// 	});
	// }, []);

	return null;
}
