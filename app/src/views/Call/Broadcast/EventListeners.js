import { Alert, StyleSheet, Text, View } from "react-native";
import React, { memo, useContext, useMemo } from "react";
import SocketContext from "../../../Context/Socket";
import BroadcastContext from "./Context";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import { Button, Modal, ScrollView, useToast } from "native-base";
import { deactivateKeepAwake } from "expo-keep-awake";
import { ClientRole } from "react-native-agora";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../../Context/AppContext";
import PushNotification from "react-native-push-notification";
import { removeLocalStorage } from "../../../utils/Cache/TempStorage";

function EventListeners() {
	const { goBack } = useNavigation();
	const Toast = useToast();
	const _rtcEngine = React.useContext(CallRtcEngine)._rtcEngine || false;
	const { setRtcEngine } = React.useContext(CallRtcEngine);
	const { setActiveCallTimer, setCallType } = React.useContext(AppContext);

	const socket = React.useContext(SocketContext)?.socket || false;
	const memberObj = React.useContext(BroadcastContext)?.memberObj || false;
	const host = React.useContext(BroadcastContext)?.host || false;

	const [modalState, setModalState] = React.useState({ open: false });

	const {
		setMembers,
		setChat,
		setHost,
		setPromoted,
		setLocalVideo,
		setLocalAudio,
		setActionLoading,
		setJoinReqLoading,
	} = React.useContext(BroadcastContext);

	const newMemberJoined = React.useCallback((mData) => {
		setMembers((prev) =>
			prev.filter((ele) => ele.id === mData.memberObj.id)?.length > 0
				? prev
				: [...prev, { ...mData.memberObj }]
		);
	}, []);

	const memberPromoteFunction = React.useCallback((mData) => {
		// setChat((prev) => [
		// 	...prev,
		// 	{
		// 		memberId: mData?.memberId,
		// 		memberObj: mData?.memberObj,
		// 		content: {
		// 			src: "promoted to co-host",
		// 			type: "ALERT",
		// 		},
		// 	},
		// ]);
		setActionLoading((prev) => prev.filter((item) => item !== mData?.memberId));
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
		// setChat((prev) => [
		// 	...prev,
		// 	{
		// 		memberId: mData?.memberId,
		// 		memberObj: mData?.memberObj,
		// 		content: {
		// 			src: "demoted to member",
		// 			type: "ALERT",
		// 		},
		// 	},
		// ]);

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

	const selfPromoteFunction = React.useCallback(
		async (mData) => {
			setJoinReqLoading(false);
			Toast.show({
				description:
					host?.firstName +
					" " +
					host?.lastName +
					" (Admin) promoted you to co-host.",
			});
			await _rtcEngine.setClientRole(ClientRole.Broadcaster);
			await _rtcEngine.setVideoEncoderConfiguration({
				dimensions: {
					width: 320,
					height: 240,
				},
				frameRate: 15,
				orientationMode: 2,
			});
			await _rtcEngine.enableVideo();
			await _rtcEngine.enableAudio();
			await _rtcEngine.startPreview();
			setPromoted(true);
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
							return {
								...ele,
								role: 1,
								isCoHost: true,
							};
						}
					} else return ele;
				})
			);
		},
		[_rtcEngine, host]
	);

	const acceptPromote = async (mData) => {
		if (mData?.actionBy === "ADMIN") {
			await _rtcEngine.setClientRole(ClientRole.Broadcaster);
			await _rtcEngine.enableVideo();
			await _rtcEngine.enableAudio();
			await _rtcEngine.startPreview();
			setPromoted(true);
			Toast.show({
				description:
					host?.firstName +
					" " +
					host?.lastName +
					"(Admin) promoted you to co-host.",
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
			socket &&
				socket.send(
					JSON.stringify({
						action: "BROADCAST_CHAT",
						data: {
							cloudId: mData?.cloudId,
							memberId: mData?.memberId,
							memberObj: mData?.memberObj,
							createdOn: new Date().toISOString(),
							content: { src: "promoted to co-host", type: "ALERT" },
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

			socket &&
				socket.send(
					JSON.stringify({
						action: "BROADCAST_CHAT",
						data: {
							cloudId: mData?.cloudId,
							memberId: mData?.memberId,
							memberObj: mData?.memberObj,
							createdOn: new Date().toISOString(),
							content: { src: "promoted to co-host", type: "ALERT" },
						},
					})
				);
		}
	};

	const declinePromoteRequestSocket = (mData) => {
		socket &&
			socket.send(
				JSON.stringify({
					action: "DECLINE_PROMOTE_REQUEST",
					data: {
						cloudId: mData?.cloudId,
						hostId: host?.id,
						memberId: mData?.memberId,
						actionBy: mData?.actionBy === "ADMIN" ? "MEMBER" : "ADMIN",
					},
				})
			);
	};

	const promoteRequestRecieve = React.useCallback((mData) => {
		setModalState({ open: true, data: mData });
	}, []);

	const declinePromoteRequest = React.useCallback(
		(mData) => {
			if (mData?.actionBy === "ADMIN") {
				setJoinReqLoading(false);
			} else {
				setActionLoading((prev) => prev.filter((item) => item !== mData?.memberId));
			}

			Toast.show({
				description:
					mData?.actionBy === "ADMIN"
						? host?.firstName +
						  " " +
						  host?.lastName +
						  " (Admin) deny your joining request."
						: `${mData?.memberObj?.firstName || ""} ${
								mData?.memberObj?.lastName || ""
						  } deny your joining request.`,
			});
		},
		[host]
	);

	const selfDemoteFunction = React.useCallback(
		async (mData) => {
			if (mData?.actionBy === "ADMIN") {
				Toast.show({
					description:
						host?.firstName + " " + host?.lastName + " removed you as co-host",
				});
			}
			await _rtcEngine.setClientRole(ClientRole.Audience);
			// await _rtcEngine.enableVideo();
			// await _rtcEngine.enableAudio();
			await _rtcEngine.stopPreview();
			setLocalVideo(true);
			setLocalAudio(true);
			setPromoted(false);
			setMembers((prev) =>
				prev.map((ele) => {
					if (ele?.isCoHost || ele?.role === 1) {
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
				})
			);
		},
		[_rtcEngine, host]
	);

	const memberLeaveFunction = React.useCallback((mData) => {
		console.warn("mData", mData);
		// setChat((prev) => [
		// 	...prev,
		// 	{
		// 		memberId: mData?.memberId,
		// 		memberObj: mData?.memberObj,
		// 		content: {
		// 			src: "left",
		// 			type: "ALERT",
		// 		},
		// 	},
		// ]);
		setMembers((prev) => prev.filter((ele) => ele.id !== mData?.memberId));
	}, []);

	const leaveSelfFunction = React.useCallback(
		(mData, finished) => {
			deactivateKeepAwake();
			if (finished) {
				Toast.show({ description: "Broadcast ended." });
			}
			// _rtcEngine?.leaveChannel().then(() => {
			_rtcEngine?.destroy().then(() => {
				// callDetector && callDetector.dispose();
				PushNotification.cancelLocalNotification(8);
				setRtcEngine(false);
				setCallType(false);
				removeLocalStorage("CallType").then().catch();
				setActiveCallTimer(0);
				goBack();
			});
			// });
		},
		[_rtcEngine]
	);

	const kickAdminFunction = React.useCallback(
		(mData) => {
			deactivateKeepAwake();
			Toast.show({
				description:
					host?.firstName + " " + host?.lastName + " removed you from broadcast.",
			});

			// _rtcEngine?.leaveChannel().then(() => {
			_rtcEngine?.destroy().then(() => {
				// callDetector && callDetector.dispose();
				PushNotification.cancelLocalNotification(8);
				setRtcEngine(false);
				setCallType(false);
				removeLocalStorage("CallType").then().catch();
				setActiveCallTimer(0);
				goBack();
			});
			// });
		},
		[_rtcEngine, host]
	);

	const chatRecieve = React.useCallback((mData) => {
		setChat((prev) =>
			prev.filter((ele) => ele?.chatId === mData?.chatId).length > 0
				? prev
				: [...prev, mData]
		);
	}, []);

	React.useMemo(() => {
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
						setTimeout(() => {
							setHost(mData?.host);
							setMembers((prev) => [
								mData?.host,
								{
									...mData?.self?.memberObj,
									id: mData?.self?.memberId,
								},
								...mData?.members,
							]);
						}, 1000);
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
						chatRecieve(mData);
						break;
					default:
						break;
				}
			});
	}, [
		socket,
		newMemberJoined,
		memberLeaveFunction,
		selfPromoteFunction,
		selfDemoteFunction,
		memberPromoteFunction,
		memberDemoteFunction,
		promoteRequestRecieve,
		leaveSelfFunction,
		kickAdminFunction,
	]);

	return (
		<React.Fragment>
			<Modal
				isOpen={modalState?.open}
				// onClose={() => setModalState({ open: false })}
				size="md"
			>
				<Modal.Content maxH="212">
					<Modal.Header>Joining Request</Modal.Header>
					<Modal.Body>
						<ScrollView>
							<Text>
								{modalState?.data?.actionBy === "ADMIN"
									? `${host?.firstName} ${host?.lastName} (Admin) sent you request to join as Co-Host.`
									: `${modalState?.data?.memberObj?.firstName} ${modalState?.data?.memberObj?.lastName} (Member) sent you request to join as Co-Host.`}
							</Text>
						</ScrollView>
					</Modal.Body>
					<Modal.Footer>
						<Button.Group space={2}>
							<Button
								variant="ghost"
								colorScheme="blueGray"
								onPress={() => {
									setModalState({ open: false });
									declinePromoteRequestSocket(modalState?.data);
								}}
								size="sm"
							>
								Deny
							</Button>
							<Button
								onPress={() => {
									setModalState({ open: false });
									acceptPromote(modalState?.data);
								}}
								size="sm"
							>
								Accept
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</React.Fragment>
	);
}

export default memo(EventListeners);
