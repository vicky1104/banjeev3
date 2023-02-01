import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Text } from "native-base";
import React, { useContext } from "react";
import {
	Alert,
	Dimensions,
	Image,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { RtcLocalView, RtcRemoteView } from "react-native-agora";

import { MainContext } from "../../../../../context/MainContext";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import SocketContext from "../../../../Context/Socket";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import BroadcastContext from "../Context";
import ChatScreen from "./Chat";
import Lottie from "lottie-react-native";

export default function BroadcastComp(props) {
	const { userObject: paramsUserObj, handleActionbar, showActionbar } = props;

	const membersRBSheet = React.useRef(null);

	const [loadDemote, setLoadDemote] = React.useState([]);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const socket = React.useContext(SocketContext)?.socket;

	const promoted = React.useContext(BroadcastContext)?.promoted || false;
	const remoteUid = React.useContext(BroadcastContext)?.remotes || [];
	const cloudId = React.useContext(BroadcastContext)?.cloudId || "";
	const remoteAudioVolume =
		React.useContext(BroadcastContext)?.remoteAudioVolume || [];
	const remoteVideo = React.useContext(BroadcastContext)?.remoteVideo || [];
	const localVideo = React.useContext(BroadcastContext)?.localVideo;
	const members = React.useContext(BroadcastContext)?.members || [];
	const raiseHand = React.useContext(BroadcastContext)?.raiseHand || [];
	const emoji = React.useContext(BroadcastContext)?.emoji || [];
	const feedback = React.useContext(BroadcastContext)?.feedback || [];
	const isHost = React.useContext(BroadcastContext)?.isHost || false;
	const hostId = React.useContext(BroadcastContext)?.host?.id || "";
	const joinReqLoading =
		React.useContext(BroadcastContext)?.joinReqLoading || false;

	const { setJoinReqLoading } = React.useContext(BroadcastContext);

	const userObject =
		React.useContext(BroadcastContext)?.callData?.userObject || paramsUserObj;

	const systemUserId =
		React.useContext(AppContext)?.profile?.systemUserId || userObject?.id;
	const firstName =
		React.useContext(AppContext)?.profile?.firstName || userObject?.firstName;
	const lastName =
		React.useContext(AppContext)?.profile?.lastName || userObject?.lastName;
	const mobile =
		React.useContext(AppContext)?.profile?.mobile || userObject?.mobile;
	const email =
		React.useContext(AppContext)?.profile?.email || userObject?.email;

	const removeFromEvent = (payload) => {};

	const getUid = (mobileNum) => {
		if (mobileNum) {
			if (mobileNum.length > 7) {
				let reverseMobile = mobileNum?.split("").reverse();
				let newMobile = reverseMobile.slice(0, 7);
				return parseInt(newMobile.reverse().join(""));
			} else {
				return parseInt(mobileNum);
			}
		}
	};

	const demoteMemberFunction = (member) => {
		setLoadDemote((prev) => [...prev, member?.uid]);
		setTimeout(() => {
			setLoadDemote((prev) => prev.filter((ele) => ele !== member?.uid));
		}, 4000);
		socket.send(
			JSON.stringify({
				action: "DEMOTE_MEMBER",
				data: {
					cloudId,
					memberId: member?.id,
					actionBy: "ADMIN",
				},
			})
		);
		socket &&
			socket.send(
				JSON.stringify({
					action: "BROADCAST_CHAT",
					data: {
						cloudId: cloudId,
						memberId: member?.id,
						memberObj: member,
						createdOn: new Date().toISOString(),
						content: { src: "demoted to member", type: "ALERT" },
					},
				})
			);
	};

	const demoteMember = (eleUid) => {
		const member = members?.filter((ele) => eleUid === getUid(ele?.mobile))?.[0];
		Alert.alert(
			"",
			`Are you sure, you want to remove ${member?.firstName} ${member?.lastName} as Co-host?`,
			[
				{ text: "Cancel" },
				{
					text: "Yes",
					onPress: () => demoteMemberFunction({ ...member, uid: eleUid }),
				},
			]
		);
	};

	const requestPromote = () => {
		if (members?.filter((ele) => ele?.role === 1)?.length < 7) {
			setJoinReqLoading(true);
			console.warn("request", {
				cloudId,
				hostId,
				memberObj: { firstName, lastName, mobile, email, id: systemUserId },
				memberId: systemUserId,
				actionBy: "MEMBER",
			});
			socket.send(
				JSON.stringify({
					action: "SEND_PROMOTE_REQUEST",
					data: {
						cloudId,
						hostId,
						memberObj: { firstName, lastName, mobile, email, id: systemUserId },
						memberId: systemUserId,
						actionBy: "MEMBER",
					},
				})
			);
		} else {
			alert("You can send promote request when 7 members already promoted.");
		}
	};

	const remoteUidsLength = remoteUid?.filter(
		(ele) => ele !== getUid(mobile)
	)?.length;

	const local = isHost || promoted;

	const getLocalHeight = () => {
		if (remoteUidsLength === 7) return "25%";
		else if (remoteUidsLength === 6) return "25%";
		else if (remoteUidsLength === 5) return "33%";
		else if (remoteUidsLength === 4) return "33%";
		else if (remoteUidsLength === 3) return "50%";
		else if (remoteUidsLength === 2) return "50%";
		else if (remoteUidsLength === 1) return "50%";
		else if (remoteUidsLength === 0) return "100%";
		else return "100%";
	};

	const getLocalWidth = () => {
		if (remoteUidsLength === 7) return "50%";
		else if (remoteUidsLength === 6) return "50%";
		else if (remoteUidsLength === 5) return "50%";
		else if (remoteUidsLength === 4) return "50%";
		else if (remoteUidsLength === 3) return "50%";
		else if (remoteUidsLength === 2) return "100%";
		else if (remoteUidsLength === 1) return "100%";
		else if (remoteUidsLength === 0) return "100%";
		else return "100%";
	};

	const getRemoteHeight = () => {
		if (remoteUidsLength === 7) return "25%";
		else if (remoteUidsLength === 6 && local) return "25%";
		else if (remoteUidsLength === 6 && !local) return "33%";
		else if (remoteUidsLength === 5) return "33%";
		else if (remoteUidsLength === 4 && local) return "33%";
		else if (remoteUidsLength === 4 && !local) return "50%";
		else if (remoteUidsLength === 3) return "50%";
		else if (remoteUidsLength === 2) return "50%";
		else if (remoteUidsLength === 1 && local) return "50%";
		else if (remoteUidsLength === 1 && !local) return "100%";
		else return "100%";
	};
	const getRemoteWidth = (index) => {
		if (remoteUidsLength === 7) return "50%";
		else if (remoteUidsLength === 6) return "50%";
		else if (remoteUidsLength === 5) return "50%";
		else if (remoteUidsLength === 4) return "50%";
		else if (remoteUidsLength === 3 && local) return "50%";
		else if (remoteUidsLength === 3 && !local && index === 0) return "100%";
		else if (remoteUidsLength === 3 && !local && index !== 0) return "50%";
		else if (remoteUidsLength === 2 && local) return "50%";
		else if (remoteUidsLength === 2 && !local) return "100%";
		else if (remoteUidsLength === 1) return "100%";
		else return "100%";
	};

	const renderComp = () => {
		return (
			<TouchableWithoutFeedback onPress={handleActionbar}>
				<View
					style={{
						flex: 1,
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					{promoted || isHost ? (
						<View
							style={{
								height: getLocalHeight(),
								width: getLocalWidth(),
								position: "relative",
								padding: 3,
							}}
						>
							{localVideo ? (
								<RtcLocalView.SurfaceView style={{ height: "100%", width: "100%" }} />
							) : (
								<Image
									style={{
										height: "100%",
										width: "80%",
										alignSelf: "center",
									}}
									source={{
										uri: listProfileUrl(systemUserId),
									}}
									resizeMode="contain"
								/>
							)}
							<View
								style={{
									position: "absolute",
									bottom: 10,
									left: 0,
									flexDirection: "row",
									justifyContent: "center",
									width: "100%",
								}}
							>
								<Text
									fontSize="16"
									color="#FFF"
									style={{
										backgroundColor: "rgba(1,1,1,0.75)",
										paddingHorizontal: 6,
										paddingVertical: 1,
										borderRadius: 5,
									}}
								>
									You
								</Text>
							</View>
						</View>
					) : null}
					{remoteUid !== undefined &&
						remoteUid &&
						remoteUid?.length > 0 &&
						remoteUid?.map((ele, index) => {
							return (
								<>
									<View
										key={index}
										style={{
											height: getRemoteHeight(),
											width: getRemoteWidth(index),
											position: "relative",
											padding: 3,
											backgroundColor: color.gradientWhite,
										}}
									>
										{ele?.video ? (
											<RtcRemoteView.SurfaceView
												style={{ height: "100%", width: "100%" }}
												uid={ele?.uid}
												zOrderMediaOverlay={true}
											/>
										) : (
											<Image
												style={{
													height: "100%",
													width: "80%",
													alignSelf: "center",
												}}
												source={{
													uri: "https://banjee.s3.eu-central-1.amazonaws.com/root/assets/images/adminVideoOff.png",
												}}
												resizeMode="contain"
											/>
										)}
										{isHost && (
											<Button
												style={{ position: "absolute", top: 10, right: 10 }}
												onPress={() => demoteMember(ele?.uid)}
												py={1}
												px={2}
												m={1}
												disabled={
													loadDemote?.filter((item) => item === ele?.uid)?.length > 0
														? true
														: false
												}
											>
												{loadDemote &&
												loadDemote?.length > 0 &&
												loadDemote?.filter((item) => item === ele?.uid)?.length > 0 ? (
													<Lottie
														source={require("../../../../../assets/loader/loader.json")}
														autoPlay
														style={{ height: 20 }}
													/>
												) : (
													"Demote"
												)}
											</Button>
										)}
										{!ele?.audio && (
											<MaterialCommunityIcons
												size={25}
												color="#FFF"
												name="microphone-off"
												style={{ position: "absolute", top: 10, left: 10 }}
											/>
										)}
										{members?.filter((item) => getUid(item?.mobile) === ele?.uid)
											?.length > 0 && (
											<View
												style={{
													position: "absolute",
													bottom: 10,
													left: 0,
													flexDirection: "row",
													justifyContent: "center",
													width: "100%",
												}}
											>
												<Text
													color="#FFF"
													style={{
														backgroundColor: "rgba(1,1,1,0.75)",
														paddingHorizontal: 6,
														paddingVertical: 1,
														borderRadius: 5,
													}}
												>
													{`${
														members?.filter((item) => getUid(item?.mobile) === ele?.uid)?.[0]
															?.firstName
													} ${
														members?.filter((item) => getUid(item?.mobile) === ele?.uid)?.[0]
															?.lastName
													}`}
												</Text>
											</View>
										)}
									</View>
								</>
							);
						})}
					{!promoted && !isHost && showActionbar && remoteUid?.length < 8 ? (
						<Button
							size="sm"
							style={{ position: "absolute", top: 70, left: 10 }}
							py={1}
							px={2}
							onPress={requestPromote}
							disabled={joinReqLoading}
						>
							{joinReqLoading ? (
								<View
									style={{
										width: 130,
										flexDirection: "row",
										justifyContent: "center",
									}}
								>
									<Lottie
										source={require("../../../../../assets/loader/loader.json")}
										autoPlay
										style={{ height: 20 }}
									/>
								</View>
							) : (
								"Request to be a Co-Host"
							)}
						</Button>
					) : null}
				</View>
			</TouchableWithoutFeedback>
		);
	};

	if (_rtcEngine) return <React.Fragment>{renderComp()}</React.Fragment>;

	return null;
}
