import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SocketContext from "../../../../Context/Socket";
import CallContext from "../Context";
import { showToast } from "../../../../constants/components/ShowToast";
import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import { useToast } from "native-base";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import {
	removeLocalStorage,
	setLocalStorage,
} from "../../../../utils/Cache/TempStorage";

import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { AppContext } from "../../../../Context/AppContext";

export default function EventListners({ details, callDetector }) {
	const { setRtcEngine } = React.useContext(CallRtcEngine);
	const { setActiveCallTimer, setCallType } = React.useContext(AppContext);

	const firstName =
		React.useContext(AppContext)?.profile?.firstName || details?.firstName || "";
	const lastName =
		React.useContext(AppContext)?.profile?.lastName || details?.lastName || "";
	const systemUserId =
		React.useContext(AppContext)?.systemUserId || details?.systemUserId || "";
	const cloudId =
		React.useContext(CallContext)?.callData?.cloudId || details?.cloudId || "";
	const chatRoomId =
		React.useContext(CallContext)?.callData?.chatRoomId ||
		details?.chatRoomId ||
		"";

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const { goBack } = useNavigation();
	const Toast = useToast();
	const { socket } = React.useContext(SocketContext);

	const { setMembers, setRemoteUid } = React.useContext(CallContext);

	const members = React.useContext(CallContext)?.members || [];

	const getUid = React.useCallback((mobile) => {
		if (mobile.length > 7) {
			let reverseMobile = mobile.split("").reverse();
			let newMobile = reverseMobile.slice(0, 7);
			return parseInt(newMobile.reverse().join(""));
		} else {
			return parseInt(mobile);
		}
	}, []);

	const userJoinFunction = React.useCallback((mData) => {
		if (mData?.userObject?.id !== systemUserId) {
			Toast.show({
				description:
					mData?.userObject?.firstName +
					" " +
					mData?.userObject?.lastName +
					" joined the group call.",
				duration: 1000,
			});
			const newMembers =
				members.filter((ele) => ele?.id === mData?.userObject?.id)?.length > 0
					? [...members]
					: [...members, mData?.userObject];
			setLocalStorage("GroupMembers", newMembers).then().catch();
			setMembers((prev) =>
				prev.filter((ele) => ele.id === mData.userObject.id)?.length > 0
					? [...prev]
					: [...prev, { ...mData.userObject, uid: getUid(mData.userObject.mobile) }]
			);
		}
	}, []);

	const userLeaveFunction = React.useCallback((mData) => {
		if (mData?.userId !== systemUserId) {
			Toast.show({
				description:
					mData?.userObject?.firstName +
					" " +
					mData?.userObject?.lastName +
					" left the group call.",
				duration: 1000,
			});
			const newMembers = members?.filter((ele) => ele.id !== mData?.userId);
			setLocalStorage("GroupMembers", newMembers).then().catch();
			setMembers((prev) => prev.filter((ele) => ele.id !== mData?.userId));
		}
	}, []);

	const kickUserFunction = React.useCallback(
		(mData) => {
			deactivateKeepAwake();
			if (_rtcEngine && mData.receiverId === systemUserId) {
				_rtcEngine?.leaveChannel().then(() => {
					_rtcEngine?.destroy().then(() => {
						callDetector && callDetector.dispose();
						PushNotification.cancelLocalNotification(8);
						setRtcEngine(false);
						setCallType(false);
						setActiveCallTimer(0);
						removeLocalStorage("GroupCallData").then(() => {
							removeLocalStorage("GroupRemoteUid").then(() => {
								removeLocalStorage("GroupRemoteVideo").then(() => {
									removeLocalStorage("GroupRemoteAudio").then(() => {
										removeLocalStorage("GroupLocalVideo").then(() => {
											removeLocalStorage("GroupLocalAudio").then(() => {
												removeLocalStorage("GroupMembers").then(() => {
													removeLocalStorage("GroupFeedback").then(() => {
														removeLocalStorage("RtcEngine").then().catch();
														removeLocalStorage("CallType").then().catch();
														Toast.show({
															description: "Admin removed you from the group call.",
															duration: 1000,
														});
														socket.send(
															JSON.stringify({
																action: "LEAVE_GROUP_CALL",
																data: {
																	cloudId: cloudId,
																	chatRoomId: chatRoomId,
																	userId: systemUserId,
																	userObject: {
																		firstName: firstName,
																		lastName: lastName,
																	},
																},
															})
														);
														goBack();
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			}
		},
		[systemUserId, cloudId, chatRoomId, firstName, lastName, _rtcEngine]
	);

	React.useEffect(() => {
		socket &&
			socket.addEventListener("message", ({ data }) => {
				const { action, data: mData } = JSON.parse(data);
				switch (action) {
					case "USER_JOIN_GROUP_CALL":
						userJoinFunction(mData);
						break;
					case "USER_LEAVE_GROUP_CALL":
						userLeaveFunction(mData);
						break;
					case "JOIN_GROUP_CALL_SUCCESS":
						setLocalStorage("GroupMembers", mData?.members).then().catch();
						// const newRUid = mData?.members.map((ele) => getUid(ele?.mobile));
						// console.warn("newRUid ------", newRUid);
						// setLocalStorage("GroupRemoteUid", newRUid).then().catch();
						// setRemoteUid(newRUid);
						setMembers(mData?.members);
						break;
					case "KICK_USER_GROUP_CALL":
						kickUserFunction(mData);
						break;
					default:
						break;
				}
			});
	}, [userJoinFunction, userLeaveFunction, kickUserFunction]);

	return null;
}

const styles = StyleSheet.create({});
