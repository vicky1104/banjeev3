import React from "react";
import SocketContext from "../../../../Context/Socket";
import BroadcastContext from "../Context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import { useToast } from "native-base";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import {
	removeLocalStorage,
	setLocalStorage,
} from "../../../../utils/Cache/TempStorage";
import { deactivateKeepAwake } from "expo-keep-awake";
import { AppContext } from "../../../../Context/AppContext";
import { Alert } from "react-native";

export default function EventListners({
	details,
	callDetector,
	promoteMember,
	demoteMember,
}) {
	const { setRtcEngine } = React.useContext(CallRtcEngine);

	const { setActiveCallTimer, setCallType } = React.useContext(AppContext);

	// const firstName = details?.memberObj?.firstName || "";
	// const lastName = details?.memberObj?.lastName || "";
	// const systemUserId = details?.memberId || "";
	// const cloudId = details?.cloudId || "";
	// const name = details?.name || "";
	const memberId = details?.memberId || "";
	const memberObj = details?.memberObj || "";

	const rtcEngineContext = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const _rtcEngine = React.useMemo(() => rtcEngineContext, [rtcEngineContext]);

	const { goBack } = useNavigation();
	const Toast = useToast();
	const { socket } = React.useContext(SocketContext);

	const { setMembers, setHost, setChat } = React.useContext(BroadcastContext);

	const newMemberJoined = React.useCallback((mData) => {
		Toast.show({
			description:
				mData?.memberObj?.firstName +
				" " +
				mData?.memberObj?.lastName +
				" joined the group call.",
		});
		setMembers((prev) =>
			prev.filter((ele) => ele.id === mData.memberObj.id)?.length > 0
				? prev
				: [...prev, { ...mData.memberObj }]
		);
	}, []);

	const memberPromoteFunction = React.useCallback((mData) => {
		Toast.show({
			description:
				mData?.memberObj?.firstName +
				" " +
				mData?.memberObj?.lastName +
				" promoted to co-host.",
		});
		setMembers((prev) =>
			prev.map((ele) => {
				if (ele?.id === mData?.memberId) {
					return {
						...ele,
						role: 1,
						isCoHost: true,
					};
				} else {
					return ele;
				}
			})
		);
	}, []);

	const memberDemoteFunction = React.useCallback((mData) => {
		Toast.show({
			description:
				mData?.memberObj?.firstName +
				" " +
				mData?.memberObj?.lastName +
				" demoted to member.",
		});
		setMembers((prev) =>
			prev.map((ele) => {
				if (ele?.id === mData?.memberId) {
					return {
						...ele,
						role: 2,
						isCoHost: false,
					};
				} else {
					return ele;
				}
			})
		);
	}, []);

	const selfPromoteFunction = React.useCallback((mData) => {
		Toast.show({
			description: "Admin promoted you to co-host.",
		});
		alert("Self promoted");
		setMembers((prev) =>
			prev.map((ele) => {
				if (ele?.id === mData?.memberId) {
					if (ele?.isCoHost || ele?.role === 1) {
						return {
							...ele,
							role: 1,
							isCoHost: true,
						};
					} else {
						promoteMember();
						return {
							...ele,
							role: 1,
							isCoHost: true,
						};
					}
				} else return ele;
			})
		);
	}, []);

	const acceptPromote = React.useCallback((mData) => {
		alert("Self promoted");
		if (mData?.actionBy === "ADMIN") {
			Toast.show({
				description: "Admin promoted you to co-host.",
			});
			socket &&
				socket.send(
					JSON.stringify({
						action: "PROMOTE_MEMBER",
						data: {
							cloudId: mData?.cloudId,
							memberId: mData?.memberId,
							actionBy: "MEMBER",
						},
					})
				);
			setMembers((prev) =>
				prev.map((ele) => {
					if (ele?.id === mData?.memberId) {
						if (ele?.isCoHost || ele?.role === 1) {
							return {
								...ele,
								role: 1,
								isCoHost: true,
							};
						} else {
							promoteMember();
							return {
								...ele,
								role: 1,
								isCoHost: true,
							};
						}
					} else return ele;
				})
			);
		} else {
			socket &&
				socket.send(
					JSON.stringify({
						action: "PROMOTE_MEMBER",
						data: {
							cloudId: mData?.cloudId,
							memberId: mData?.memberId,
							actionBy: "ADMIN",
						},
					})
				);
		}
	}, []);

	const declinePromoteRequestSocket = React.useCallback((mData) => {
		socket &&
			socket.send(
				JSON.stringify({
					action: "DECLINE_PROMOTE_REQUEST",
					data: {
						cloudId: mData?.cloudId,
						memberId: mData?.memberId,
						actionBy: mData?.actionBy === "ADMIN" ? "MEMBER" : "ADMIN",
					},
				})
			);
	}, []);

	const promoteRequestRecieve = React.useCallback(
		(mData) => {
			Alert.alert(
				"",
				mData?.actionBy === "ADMIN"
					? "Admin send you request to join a video call."
					: `${mData?.memberObj?.firstName} ${mData?.memberObj?.lastName} sent you request to join video call.`,
				[
					{ text: "Deny", onPress: () => declinePromoteRequestSocket(mData) },
					{ text: "Accept", onPress: () => acceptPromote(mData) },
				]
			);
		},
		[acceptPromote, declinePromoteRequestSocket]
	);
	const declinePromoteRequest = React.useCallback((mData) => {
		Toast.show({
			description:
				mData?.actionBy === "ADMIN"
					? "Admin deny your join request."
					: "Member deny your promote request.",
		});
	}, []);

	const selfDemoteFunction = React.useCallback((mData) => {
		alert("Demote");
		Toast.show({
			description: "Admin demoted you to member.",
		});
		setMembers((prev) =>
			prev.map((ele) => {
				if (ele?.id === mData?.memberId) {
					if (ele?.isCoHost || ele?.role === 1) {
						// if (_rtcEngine) {
						// 	_rtcEngine?.leaveChannel().then(() => {
						// 		_rtcEngine?.destroy().then(() => {
						// 			setRtcEngine(false);
						// 			setCallType(false);
						// 			setActiveCallTimer(0);
						// 			demoteMember();
						// 		});
						// 	});
						// } else {
						demoteMember();
						// }
						return {
							...ele,
							role: 2,
							isCoHost: false,
						};
					} else
						return {
							...ele,
							role: 2,
							isCoHost: false,
						};
				} else return ele;
			})
		);
	}, []);

	const memberLeaveFunction = React.useCallback((mData) => {
		Toast.show({
			description: mData?.kick
				? mData?.memberObj?.firstName +
				  " " +
				  mData?.memberObj?.lastName +
				  " removed by admin."
				: mData?.memberObj?.firstName +
				  " " +
				  mData?.memberObj?.lastName +
				  " left the broadcast.",
		});
		setMembers((prev) => prev.filter((ele) => ele.id !== mData?.memberId));
	}, []);

	const leaveSelfFunction = React.useCallback(
		(mData, finished) => {
			deactivateKeepAwake();
			if (finished) {
				Toast.show({ description: "Broadcast ended." });
			}
			_rtcEngine?.leaveChannel().then(() => {
				_rtcEngine?.destroy().then(() => {
					callDetector && callDetector.dispose();
					PushNotification.cancelLocalNotification(8);
					setRtcEngine(false);
					setCallType(false);
					removeLocalStorage("CallType").then().catch();
					setActiveCallTimer(0);
					goBack();
				});
			});
		},
		[_rtcEngine]
	);

	const kickAdminFunction = React.useCallback(() => {
		deactivateKeepAwake();
		Toast.show({
			description: "Admin removed you from broadcast.",
		});
		_rtcEngine?.leaveChannel().then(() => {
			_rtcEngine?.destroy().then(() => {
				callDetector && callDetector.dispose();
				PushNotification.cancelLocalNotification(8);
				setRtcEngine(false);
				setCallType(false);
				removeLocalStorage("CallType").then().catch();
				setActiveCallTimer(0);
				goBack();
			});
		});
	}, [_rtcEngine]);

	const chatRecieve = React.useCallback((mData) => {
		alert("chat receive");
		setChat((prev) => [...prev, mData]);
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			socket &&
				socket.addEventListener("message", ({ data }) => {
					const { action, data: mData } = JSON.parse(data);
					switch (action) {
						case "NEW_BROADCAST_MEMBER_JOINED":
							newMemberJoined(mData);
							break;
						case "BROADCAST_MEMBER_LEAVE":
							memberLeaveFunction(mData);
							break;
						case "BROADCAST_PROMOTED":
							selfPromoteFunction(mData);
							break;
						case "BROADCAST_DEMOTED":
							selfDemoteFunction(mData);
							break;
						case "BROADCAST_PROMOTE_REQUEST":
							promoteRequestRecieve(mData);
							break;
						case "DECLINE_BROADCAST_PROMOTE_REQUEST":
							declinePromoteRequest(mData);
							break;
						case "BROADCAST_MEMBER_PROMOTED":
							memberPromoteFunction(mData);
							break;
						case "BROADCAST_MEMBER_DEMOTED":
							memberDemoteFunction(mData);
							break;
						case "JOIN_BROADCAST_SUCCESS":
							setHost(mData?.host);
							setMembers((prev) => [
								mData?.host,
								{
									...memberObj,
									id: memberId,
								},
								...mData?.members,
							]);
							break;
						case "LEAVE_BROADCAST":
							leaveSelfFunction(mData);
							break;
						case "BROADCAST_FINISHED":
							leaveSelfFunction(mData, true);
							break;
						case "BROADCAST_ADMIN_KICK":
							kickAdminFunction(mData);
							break;
						case "BROADCAST_CHAT_RECEIVE":
							alert("111");
							chatRecieve(mData);
							break;
						default:
							break;
					}
				});
		}, [
			newMemberJoined,
			memberLeaveFunction,
			// selfPromoteFunction,
			// selfDemoteFunction,
			memberPromoteFunction,
			memberDemoteFunction,
			leaveSelfFunction,
			kickAdminFunction,
			socket,
		])
	);

	return null;
}
