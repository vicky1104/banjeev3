import React from "react";
import {
	ImageBackground,
	Platform,
	SafeAreaView,
	StatusBar,
	View,
} from "react-native";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Actionbar from "./Actionbar";
import CallerInfo from "./CallerInfo";
import CallContext from "../Context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppContext } from "../../../../Context/AppContext";
import { HeaderBackButton } from "@react-navigation/elements";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import Constants from "expo-constants";

function AudioCallSurface({ timer, showCalling, uuid, callDetector, ringer }) {
	const { goBack } = useNavigation();
	const isFocused = useIsFocused();

	const { setActiveCallTimer } = React.useContext(AppContext);

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

	const handleGoBack = () => {
		if (isFocused) {
			goBack();
			setActiveCallTimer(timerContext);
		}
	};

	// console.warn(_rtcEngine)

	if (_rtcEngine) {
		return (
			<View
				style={{
					flex: 1,
					height: "100%",
					width: "100%",
					backgroundColor: "#FFF",
				}}
			>
				<View style={{ height: "100%", width: "100%", flex: 1 }}>
					{/* {remoteUid ? ( */}
					<ImageBackground
						style={{
							height: "100%",
							width: "100%",
							flex: 1,
						}}
						source={{
							uri: listProfileUrl(callerId),
						}}
						blurRadius={1.5}
						resizeMode="cover"
					>
						<View
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								height: "100%",
								paddingBottom: "4%",
							}}
						>
							<CallerInfo timer={remoteUid ? timer() : false} />
							<SafeAreaView
								style={{
									position: "absolute",
									top: StatusBar.currentHeight,
									left: Platform.OS === "ios" ? 10 : 0,
									height: 30,
									width: 30,
								}}
							>
								<View>
									<HeaderBackButton
										labelVisible={false}
										tintColor="#FFF"
										style={{ paddingTop: 10 }}
										onPress={handleGoBack}
									/>
								</View>
							</SafeAreaView>
							<Actionbar
								ringer={ringer}
								callDetector={callDetector}
								uuid={uuid}
								muteUnmuteBtn={{ view: true, disabled: !remoteUid }}
								speakerOnOffBtn={true}
								switchToVideoBtn={{ view: true, disabled: !remoteUid }}
							/>
						</View>
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
					</ImageBackground>
					{/* ) : (
						showCalling && initiator && <Calling initiator={showCalling} />
					)} */}
				</View>
			</View>
		);
	} else {
		return null;
	}
}

export default AudioCallSurface;
