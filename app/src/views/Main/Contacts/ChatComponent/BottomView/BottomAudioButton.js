import {
	Linking,
	Platform,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import color from "../../../../../constants/env/color";

import { Audio } from "expo-av";
import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
import { useRef } from "react";
import AudioRecord from "react-native-audio-record";
import { Buffer } from "buffer";
import usePermission from "../../../../../utils/hooks/usePermission";
import { openAppSetting } from "../../../../../utils/util-func/constantExport";

export default function BottomAudioButton({
	setRecordingURI,
	status,
	setStatus,
	recording,
	playabeData,
	setRecording,
}) {
	const scrollViewRef = useRef();
	const [icon, setIcon] = React.useState("microphone");
	const [timer, setTimer] = React.useState(0);
	const inverval_timer = useRef();
	const { checkPermission } = usePermission();
	React.useEffect(() => {
		AudioRecord.on("data", (data) => {
			// console.log("data", data);
			// base64-encoded audio data chunks
			const chunk = Buffer.from(data, "base64");
		});
		return () => {
			setRecording(null);
			setIcon("microphone");
		};
	}, []);

	const down = async () => {
		setIcon("microphone");

		const audioFile = await AudioRecord.stop();
		console.warn("audioFile ---->>", audioFile);
		if (audioFile) {
			clearInterval(inverval_timer.current);
			setTimer(0);
			setRecordingURI(`file://${audioFile}`);
		}
		// if (recording) {
		// 	await recording.stopAndUnloadAsync();
		// 	const uri = await recording.getURI();

		// 	console.log("Recording stopped and stored at", uri);
		// 	setRecordingURI(uri);
		// 	setRecording(null);
		// }
	};

	const formatTime = () => {
		const getSeconds = `0${parseInt(timer) % 60}`.slice(-2);
		const minutes = `${Math.floor(parseInt(timer) / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(parseInt(timer) / 3600)}`.slice(-2);
		return getHours > 0
			? `${getHours} : ${getMinutes} : ${getSeconds}`
			: `${getMinutes} : ${getSeconds}`;
	};

	async function up() {
		let microPer = await checkPermission("AUDIO");
		if (microPer != "granted") {
			if (Platform.OS === "android") {
				Linking.openSettings();
			} else {
				openAppSetting(
					"Banjee wants to access microphone for record voice message"
				);
			}
		} else {
			const options = {
				sampleRate: 16000, // default 44100
				channels: 1, // 1 or 2, default 1
				bitsPerSample: 16, // 8 or 16, default 16
				audioSource: 6, // android only (see below)
				wavFile: "record.wav", // default 'audio.wav'
			};
			try {
				AudioRecord.init(options);
				AudioRecord.start();
				setIcon("stop");

				if (inverval_timer.current) clearInterval(inverval_timer.current);
				inverval_timer.current = setInterval(() => {
					setTimer((prev) => prev + 1);
					setStatus(true);
				}, 1000);
			} catch (error) {
				console.error(error);
			}
		}

		// try {
		// 	const permission = await Audio.requestPermissionsAsync();

		// 	if (permission.status === "granted") {
		// 		await Audio.setAudioModeAsync({
		// 			allowsRecordingIOS: true,
		// 			playsInSilentModeIOS: true,
		// 		});

		// 		setStatus((pre) => [
		// 			...pre,
		// 			{ time: 0, meter: -100 },
		// 			{ time: 0, meter: -100 },
		// 		]);
		// 		const { recording } = await Audio.Recording.createAsync(
		// 			Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
		// 			(data) => {
		// 				if (data.metering) {
		// 					setStatus((pre) =>
		// 						[...pre, { time: data.durationMillis, meter: data.metering }].filter(
		// 							(ele) => ele.meter > -101
		// 						)
		// 					);
		// 				}
		// 			},
		// 			500
		// 		);
		// 		setIcon("stop");
		// 		setRecording(recording);
		// 	} else {
		// 		setMessage("Please grant permission to app to access microphone");
		// 	}
		// } catch (err) {
		// 	console.error("Failed to start recording", err);
		// }
	}

	return (
		<View
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexDirection: "row",
				flex: 1,
			}}
		>
			{timer > 0 && icon === "stop" && (
				<Text style={{ color: "#ffff", marginRight: 20 }}>{formatTime()}</Text>
			)}

			<TouchableWithoutFeedback onPress={icon === "microphone" ? up : down}>
				<MaterialCommunityIcons
					name={icon}
					size={24}
					color={color.primary}
				/>
			</TouchableWithoutFeedback>
		</View>
	);
}

// import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// import color from "../../../../../constants/env/color";

// import { Audio } from "expo-av";
// import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
// import { useRef } from "react";
// import AudioRecord from "react-native-audio-record";
// import { Buffer } from "buffer";

// import AudioRecorderPlayer from "react-native-audio-recorder-player";

// export default function BottomAudioButton({
// 	setRecordingURI,
// 	setStatus,
// 	setRecording,
// }) {
// 	const audioRecorderPlayer = new AudioRecorderPlayer();
// 	const [playerData, setPlayerData] = useState();
// 	const scrollViewRef = useRef();
// 	const [icon, setIcon] = React.useState("microphone");
// 	const [timer, setTimer] = React.useState(0);
// 	const inverval_timer = useRef();

// 	// React.useEffect(() => {
// 	// 	AudioRecord.on("data", (data) => {
// 	// 		// console.log("data", data);
// 	// 		// base64-encoded audio data chunks
// 	// 		const chunk = Buffer.from(data, "base64");
// 	// 	});
// 	// 	return () => {
// 	// 		setRecording(null);
// 	// 		setIcon("microphone");
// 	// 	};
// 	// }, []);

// 	const down = async () => {
// 		audioRecorderPlayer
// 			.stopRecorder()
// 			.then((result) => {
// 				setIcon("microphone");

// 				audioRecorderPlayer?.stopRecorder();
// 				audioRecorderPlayer?.pauseRecorder();
// 				audioRecorderPlayer.removeRecordBackListener();
// 				audioRecorderPlayer?.removePlayBackListener();

// 				setPlayerData({
// 					recordSecs: 0,
// 				});

// 				console.log(result);
// 				return;
// 			})
// 			.catch((err) => console.warn(err));

// 		// const audioFile = await AudioRecord.stop();
// 		// console.warn("audioFile ---->>", audioFile);
// 		// if (audioFile) {
// 		// 	clearInterval(inverval_timer.current);
// 		// 	setTimer(0);
// 		// 	setRecordingURI(`file://${audioFile}`);
// 		// }
// 		// if (recording) {
// 		// 	await recording.stopAndUnloadAsync();
// 		// 	const uri = await recording.getURI();

// 		// 	console.log("Recording stopped and stored at", uri);
// 		// 	setRecordingURI(uri);
// 		// 	setRecording(null);
// 		// }
// 	};

// 	async function up() {
// 		setIcon("stop");
// 		const result = await audioRecorderPlayer.startRecorder();
// 		audioRecorderPlayer.addRecordBackListener((e) => {
// 			// console.warn(e, "addRecordBackListener");
// 			setPlayerData({
// 				recordSecs: e.currentPosition,
// 				recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
// 			});
// 			return;
// 		});
// 		console.log(result);
// 	}
// 	console.warn(playerData, "playerdataaa");

// 	return (
// 		<View
// 			style={{
// 				display: "flex",
// 				justifyContent: "space-between",
// 				alignItems: "center",
// 				flexDirection: "row",
// 				flex: 1,
// 			}}
// 		>
// 			{playerData?.recordTime && icon === "stop" && (
// 				<Text style={{ color: "#ffff", marginRight: 20 }}>
// 					{playerData?.recordTime.split(":")[0]}:
// 					{playerData?.recordTime.split(":")[1]}
// 				</Text>
// 			)}

// 			<TouchableWithoutFeedback onPress={icon === "microphone" ? up : down}>
// 				<MaterialCommunityIcons
// 					name={icon}
// 					size={24}
// 					color={color.primary}
// 				/>
// 			</TouchableWithoutFeedback>
// 		</View>
// 	);
// }
