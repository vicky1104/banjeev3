import React from "react";
import {
	Image,
	ImageBackground,
	Platform,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { RtcLocalView, RtcRemoteView } from "react-native-agora";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import CallingScreen from "./CallingScreen";
import SocketContext from "../../../../Context/Socket";
import CallContext from "../Context";
import Actionbar from "./Actionbar";
import CallerInfo from "./CallerInfo";
import { Text } from "native-base";
import { AppContext } from "../../../../Context/AppContext";
import { HeaderBackButton } from "@react-navigation/elements";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import Constants from "expo-constants";
import color from "../../../../constants/env/color";

export default function VideoCallSurface({
	timer,
	showCalling,
	callDetector,
	ringer,
}) {
	const { goBack } = useNavigation();
	const isFocused = useIsFocused();
	const { setActiveCallTimer } = React.useContext(AppContext);
	const { socket } = React.useContext(SocketContext);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const firstName = React.useContext(CallContext)?.callerObj?.firstName || "";
	const lastName = React.useContext(CallContext)?.callerObj?.lastName || "";
	const callerId = React.useContext(CallContext)?.callerId || "";
	const roomId = React.useContext(CallContext)?.roomId || "";
	const callType = React.useContext(CallContext)?.callType || "audio";
	const remoteUid = React.useContext(CallContext)?.remoteUid || false;
	const callId = React.useContext(CallContext)?.callId || "";
	const systemUserId = React.useContext(CallContext)?.systemUserId || "";
	const initiator = React.useContext(CallContext)?.initiator || "";
	const videoMute = React.useContext(CallContext)?.videoMute || {
		remote: false,
		local: false,
	};
	const audioMute = React.useContext(CallContext)?.audioMute || {
		remote: false,
		local: false,
	};
	const switchCall = React.useContext(CallContext)?.switchCall || {
		receive: false,
		requesting: false,
	};
	const connectionState = React.useContext(CallContext)?.connectionState || 3;
	const callingTune = React.useContext(CallContext)?.callingTune || false;
	const timerContext = React.useContext(CallContext)?.timer || 0;

	const localSsystemUserId =
		React.useContext(AppContext)?.profile?.systemUserId || "";
	const localFirstName = React.useContext(AppContext)?.profile?.firstName || "";
	const localLastName = React.useContext(AppContext)?.profile?.lastName || "";

	const [view, setView] = React.useState("remote");
	const [display, setDisplay] = React.useState(true);
	const [remoteProfileImageError, setRemoteProfileImageError] =
		React.useState(false);
	const [localProfileImageError, setLocalProfileImageError] =
		React.useState(false);

	const handleGoBack = () => {
		if (isFocused) {
			goBack();
			setActiveCallTimer(timerContext);
		}
	};
	if (_rtcEngine) {
		return (
			<View
				style={{
					flex: 1,
					height: "100%",
					width: "100%",
				}}
			>
				{view === "remote" && (
					<View style={{ height: "100%", width: "100%", flex: 1 }}>
						{remoteUid ? (
							videoMute.remote ? (
								<View style={{ height: "100%", width: "100%", flex: 1 }}>
									<ImageBackground
										style={{
											height: "100%",
											width: "100%",
											flex: 1,
											backgroundColor: color.primary,
										}}
										source={{
											uri: listProfileUrl(callerId),
										}}
										blurRadius={1.5}
										resizeMode="cover"
										onError={() => {
											setRemoteProfileImageError(true);
										}}
									>
										<View
											style={{
												height: "100%",
												paddingBottom: "4%",
											}}
										>
											<CallerInfo timer={timer()} />
											{remoteProfileImageError && (
												<Text
													fontSize={100}
													textAlign="center"
													mt={20}
													color="#FFF"
												>
													{`${firstName ? firstName?.slice(0, 1) || "" : "" || ""}${
														lastName ? lastName.slice(0, 1) || "" : "" || ""
													}`}
												</Text>
											)}
											{audioMute.remote && (
												<View
													style={{
														height: 60,
														width: 60,
														position: "absolute",
														top: Constants.statusBarHeight + 5,
														right: -15,
													}}
												>
													<MaterialCommunityIcons
														size={28}
														color={"rgba(255,255,255,1)"}
														name="microphone-off"
													/>
												</View>
											)}
										</View>
									</ImageBackground>
								</View>
							) : (
								<TouchableWithoutFeedback onPress={() => setDisplay(!display)}>
									<View style={{ flex: 1, height: "100%", width: "100%" }}>
										<RtcRemoteView.SurfaceView
											style={{ height: "100%", width: "100%" }}
											uid={parseInt(remoteUid)}
										/>
										{audioMute.remote && (
											<View
												style={{
													height: 60,
													width: 60,
													position: "absolute",
													top: Constants.statusBarHeight + 5,
													right: -15,
												}}
											>
												<MaterialCommunityIcons
													size={28}
													color={"rgba(255,255,255,1)"}
													name="microphone-off"
												/>
											</View>
										)}
									</View>
								</TouchableWithoutFeedback>
							)
						) : (
							showCalling && <CallingScreen />
						)}
						{videoMute.remote && videoMute.local ? null : videoMute.local ? (
							<View
								style={{
									height: "18%",
									width: "25%",
									position: "absolute",
									bottom: "15%",
									right: 20,
								}}
							>
								<Image
									style={{
										height: "100%",
										width: "100%",
										flex: 1,
										borderRadius: 5,
										backgroundColor: "#000",
										padding: 3,
									}}
									source={{
										uri: listProfileUrl(systemUserId),
									}}
									blurRadius={1.5}
									resizeMode="cover"
								/>
							</View>
						) : (
							<View
								style={{
									height: "18%",
									width: "25%",
									position: "absolute",
									bottom: "15%",
									right: 20,
								}}
							>
								<TouchableWithoutFeedback
									onPress={() => {
										if (remoteUid) {
											setView("local");
										}
									}}
								>
									<View
										style={{
											height: "100%",
											width: "100%",
											padding: 3,
											backgroundColor: "#FFF",
											borderRadius: 5,
										}}
									>
										<RtcLocalView.SurfaceView
											zOrderMediaOverlay={true}
											style={{ height: "100%", width: "100%" }}
										/>
									</View>
								</TouchableWithoutFeedback>
							</View>
						)}
					</View>
				)}
				{view === "local" && (
					<View style={{ height: "100%", width: "100%", flex: 1 }}>
						{videoMute.local ? (
							<View style={{ height: "100%", width: "100%", flex: 1 }}>
								<ImageBackground
									style={{
										height: "100%",
										width: "100%",
										flex: 1,
										backgroundColor: color.primary,
									}}
									source={{
										uri:
											videoMute.remote && videoMute.local
												? listProfileUrl(callerId)
												: listProfileUrl(systemUserId),
									}}
									blurRadius={1.5}
									resizeMode="cover"
									onError={() => {
										setLocalProfileImageError(true);
									}}
								>
									<View
										style={{
											height: "100%",
											paddingBottom: "4%",
										}}
									>
										<CallerInfo timer={timer()} />
										{videoMute.remote && videoMute.local
											? remoteProfileImageError && (
													<Text
														fontSize={100}
														textAlign="center"
														mt={20}
														color="#FFF"
													>
														{`${firstName ? firstName?.slice(0, 1) || "" : "" || ""}${
															lastName ? lastName.slice(0, 1) || "" : "" || ""
														}`}
													</Text>
											  )
											: localProfileImageError && (
													<Text
														fontSize={100}
														textAlign="center"
														mt={20}
														color="#FFF"
													>
														{`${
															localFirstName ? localFirstName?.slice(0, 1) || "" : "" || ""
														}${localLastName ? localLastName.slice(0, 1) || "" : "" || ""}`}
													</Text>
											  )}
									</View>
								</ImageBackground>
							</View>
						) : (
							<RtcLocalView.SurfaceView style={{ height: "100%", width: "100%" }} />
						)}
						{videoMute.remote && videoMute.local ? null : (
							<View
								style={{
									height: "18%",
									width: "25%",
									position: "absolute",
									bottom: "15%",
									right: 20,
								}}
							>
								<TouchableWithoutFeedback onPress={() => setView("remote")}>
									<View
										style={{
											height: "100%",
											width: "100%",
											padding: 3,
											backgroundColor: "#FFF",
											borderRadius: 5,
										}}
									>
										{remoteUid && (
											<RtcRemoteView.SurfaceView
												style={{ height: "100%", width: "100%" }}
												uid={parseInt(remoteUid)}
												zOrderMediaOverlay={true}
											/>
										)}
										{audioMute.remote && (
											<View
												style={{
													height: 20,
													width: 20,
													position: "absolute",
													top: 10,
													left: 7,
												}}
											>
												<MaterialCommunityIcons
													size={20}
													color={"rgba(255,255,255,1)"}
													name="microphone-off"
												/>
											</View>
										)}
									</View>
								</TouchableWithoutFeedback>
							</View>
						)}
					</View>
				)}
				{connectionState === 4 && (
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							width: "100%",
							position: "absolute",
						}}
					>
						<Text color="#FFF">Natwork issue. Reconnecting...</Text>
					</View>
				)}
				<View
					style={{
						height: 220,
						width: "100%",
						position: "absolute",
						top: 0,
						left: 0,
						flex: 1,
					}}
				>
					{display && remoteUid && <CallerInfo timer={timer()} />}
				</View>
				{display && (
					<View
						style={{
							position: "absolute",
							width: "100%",
							bottom: "3%",
							left: 0,
						}}
					>
						<Actionbar
							ringer={ringer}
							callDetector={callDetector}
							videoOnOffBtn={{ view: true, disabled: !remoteUid }}
							muteUnmuteBtn={{ view: true, disabled: !remoteUid }}
							flipCameraBtn={true}
							videoSpeakerOnOffBtn={true}
						/>
					</View>
				)}
				<View
					style={{
						position: "absolute",
						top: Constants.statusBarHeight,
						left: Platform.OS === "ios" ? 10 : 0,
						height: 30,
						width: 30,
					}}
				>
					<View>
						<HeaderBackButton
							labelVisible={false}
							tintColor="#FFF"
							onPress={handleGoBack}
						/>
					</View>
				</View>
			</View>
		);
	} else {
		return null;
	}
}
