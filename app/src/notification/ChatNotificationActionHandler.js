import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";

export default function ChatNotificationActionsHandler() {
	const { navigate, goBack, getCurrentRoute } = useNavigation();

	const groupChat = (data) => {
		navigate("BanjeeUserChatScreen", {
			item: {
				group: true,
				name: data?.groupName || "Name",
				roomId: data?.roomId || "",
				fromNotification: true,
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

	const navigateToUserChat = (data, group) => {
		const currentScreen = getCurrentRoute();
		if (currentScreen && currentScreen?.name === "BanjeeUserChatScreen") {
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

	PushNotification.configure({
		onNotification: function (notification) {
			console.log("notification", notification);
			const { data } = notification;
			if (data?.fromSocket) {
				switch (data?.click_action) {
					case "OPEN_GROUP_CHAT":
						navigateToUserChat(data, true);
						break;
					case "OPEN_CHAT":
						navigateToUserChat(data, false);
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

	return null;
}
