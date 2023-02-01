import React, { useContext } from "react";
import { View, StyleSheet, Platform, StatusBar, Linking } from "react-native";
import FastImage from "react-native-fast-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
// import RNFetchBlob from 'rn-fetch-blob';
import * as FileSystem from "expo-file-system";
import { Text } from "native-base";
import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
import AppButton from "../../../../../constants/components/ui-component/AppButton";
import color from "../../../../../constants/env/color";
import usePermission from "../../../../../utils/hooks/usePermission";
import { MainContext } from "../../../../../../context/MainContext";
import Constants from "expo-constants";
import { openAppSetting } from "../../../../../utils/util-func/constantExport";

function RecordVoice(props) {
	const { checkPermission } = usePermission();
	const height = Constants.statusBarHeight;
	const { goBack, navigate } = useNavigation();

	const { setRoom: setRoomData } = useContext(MainContext);

	const [recorder, setRecorder] = React.useState();

	const [recorderingState, setRecordingState] = React.useState(false);

	const player = new Audio.Sound();

	const [icons, setIcons] = React.useState("play");

	const [visible, setVisible] = React.useState(false);

	const [timeErr, setTimeErr] = React.useState("");

	const [timer, setTimer] = React.useState(0);

	const countRef = React.useRef(null);

	const [audio, setAudio] = React.useState("");
	const [view, setView] = React.useState(false);

	const formatTime = () => {
		const getSeconds = `0${timer % 60}`.slice(-2);
		const minutes = `${Math.floor(timer / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

		return `${getHours} : ${getMinutes} : ${getSeconds}`;
	};

	const saveIntro = async () => {
		const options = { encoding: FileSystem.EncodingType.Base64 };
		const audioBase64 = await FileSystem.readAsStringAsync(audio, options);
		navigate(
			"CreateRoom"
			// , {
			// 	audio: {
			// 		audioBase64: audioBase64,
			// 		url: audio.split("/")[audio.split("/").length - 1],
			// 	},
			// }
		);

		setRoomData((pre) => ({
			...pre,
			audioTitle: audio.split("/")[audio.split("/").length - 1],
			audioBase64,
		}));
	};
	// `````````````````````````````` START RECORDING

	const startRecording = async () => {
		try {
			setAudio(undefined);
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			const localRecorder = new Audio.Recording();
			setRecorder(localRecorder);
			const result = await localRecorder.getStatusAsync();
			setTimeErr("");
			setTimer(0); //reset Timer
			countRef.current = setInterval(() => {
				setTimer((timer) => timer + 1);
			}, 1000);

			await localRecorder.prepareToRecordAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			await localRecorder.startAsync();

			console.log("Starting recording..");
			setRecordingState(true);
			console.log("Recording started");
		} catch (error) {
			console.warn("Error in recording audio", error);
		}
	};

	// `````````````````````````````` STOP RECORDING
	const stopRecording = async () => {
		clearInterval(countRef.current); // pause timer

		console.warn("record stop 000000");
		const result = await recorder.getStatusAsync();
		if (result.canRecord) {
			recorder
				.stopAndUnloadAsync()
				.then(async (e) => {
					console.warn("recording stop", e);
					// if (e.durationMillis > 10) {
					const uri = recorder.getURI();
					console.log("Recording stopped and stored at", uri);
					setAudio(uri);
					setRecordingState(false);
					setVisible(false);
					setRecorder(null);
					// } else {
					// 	setTimeErr("Minimum 5 second of voice is required*");
					// 	setRecordingState(false);
					// }
				})
				.catch((err) => {
					console.warn(err);
				});
		} else {
			await startRecording();
		}
	};

	const askUserPermission = React.useCallback(async () => {
		const result = await checkPermission("AUDIO");
		console.log(result);
		if (result === "granted") {
			setView(true);
		} else {
			if (Platform.OS === "android") {
				Linking.openSettings();
			} else {
				openAppSetting(
					"Banjee needs permission to access micrphone for recording voice"
				);
			}
		}
	}, [Audio]);

	React.useEffect(() => {
		askUserPermission();
		() => {
			setTimer(0);
			setTimerError("");
			stopPlayer();
			setRecordingState(false);
			setRecorder();
			clearInterval(countRef.current);
			setIcons("play");
			setVisible(false);
			stopRecording();
		};
	}, [askUserPermission]);

	//``````````````````````````` Load Sound

	const loadSound = async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: false,
		});

		player
			.loadAsync(
				{
					uri: audio,
				},
				Platform.OS === "ios" ? true : false
			)
			.then(async (res) => {
				if (res.isLoaded) {
					await playSoundFunc();
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	async function stopPlayer() {
		setIcons("play");
		await player.unloadAsync();
	}

	//``````````````````````````` Play Effect

	async function playSoundFunc() {
		const result = await player.getStatusAsync();

		if (result.isLoaded) {
			if (result.isPlaying === false) {
				player.playAsync().then((res) => {
					// console.log("Playing res", res);
					setTimeout(async () => {
						await stopPlayer();
					}, res.durationMillis);
				});
			} else {
				await stopPlayer();
			}
		}
	}

	async function playAudio() {
		console.log("loading sound");
		const result = await player.getStatusAsync();
		if (!result.isLoaded) {
			await loadSound();
		} else {
			await playSoundFunc();
		}
	}

	const navigation = useNavigation();

	const player1 = () =>
		React.useCallback(async () => {
			if (visible && icons === "play") {
				await stopPlayer();
			}
			const unsubscribe = navigation.addListener("blur", async () => {
				await stopPlayer();
			});

			return unsubscribe;
		}, [navigation, visible, icons]);

	React.useEffect(() => {
		player1;
	}, [player1]);

	const recordingStateView = (
		<View
			style={{
				alignItems: "center",
				marginTop: 36,
				height: "100%",
				width: "100%",
				flex: 1,
				justifyContent: "space-evenly",
			}}
		>
			{countRef && (
				<Text
					fontSize={30}
					style={{
						color: color.white,
					}}
				>
					{timer ? formatTime() : "00 : 00 : 00"}
				</Text>
			)}

			<Text style={styles.Err}>{timeErr}</Text>

			{/* ````````````````````````````RE-RECORDING  */}

			<View
				style={{
					alignItems: "center",
					width: "60%",
					justifyContent: "space-evenly",
					flexDirection: "row",
				}}
			>
				<View style={{ alignItems: "center" }}>
					<AppFabButton
						onPress={() => {
							recorderingState ? stopRecording() : startRecording();
						}}
						style={styles.icon}
						icon={
							<MaterialCommunityIcons
								name={"replay"}
								size={25}
								color={color.black}
							/>
						}
					/>
					<Text style={styles.txt}>RE-RECORD</Text>
				</View>

				<View style={{ alignItems: "center" }}>
					<AppFabButton
						onPress={() => {
							setIcons(icons === "play" ? "pause" : "play");
							playAudio();
						}}
						style={styles.icon}
						icon={
							<MaterialCommunityIcons
								name={icons}
								size={25}
								color={color.black}
							/>
						}
					/>
					<Text style={styles.txt}>{icons === "play" ? "PLAY" : "PAUSE"}</Text>
				</View>
			</View>

			{!visible && audio && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-evenly",
						width: "80%",
						position: "absolute",
						bottom: 40,
					}}
				>
					<AppButton
						style={styles.saveBtn}
						onPress={async () => {
							goBack();
							await player.stopAsync();
						}}
						title={"Cancel"}
					/>
					<AppButton
						style={styles.saveBtn}
						onPress={() => saveIntro()}
						title={"Save Intro"}
					/>
				</View>
			)}
		</View>
	);

	const playerStateView = (
		<React.Fragment>
			<View style={styles.container}>
				{!recorderingState && (
					<Text style={{ color: color.white, width: "80%", textAlign: "center" }}>
						Add Intro Voice about your topic, which describes about your Room and
						activity
					</Text>
				)}

				{countRef && (
					<Text
						fontSize={30}
						color={color.white}
					>
						{timer ? formatTime() : "00 : 00 : 00"}
					</Text>
				)}

				<View style={{ flexDirection: "column", alignItems: "center" }}>
					<AppFabButton
						onPress={() => (recorderingState ? stopRecording() : startRecording())}
						size={25}
						style={{ backgroundColor: "white", borderRadius: 50 }}
						icon={
							<MaterialCommunityIcons
								name={recorderingState ? "stop" : "microphone-outline"}
								color={color.black}
								size={22}
							/>
						}
					/>

					<Text style={{ color: color.white, fontSize: 12, marginTop: 10 }}>
						{recorderingState ? "STOP" : "START"}
					</Text>
				</View>
			</View>
		</React.Fragment>
	);
	const isAudioPresent = (
		<React.Fragment>
			{audio && !visible ? recordingStateView : playerStateView}
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{view && (
				<View style={{ backgroundColor: color.drawerGrey, flex: 1 }}>
					<AppFabButton
						style={{
							position: "absolute",
							top: height,
							right: 0,
							borderWidth: 1,
						}}
						onPress={() => {
							goBack();
						}}
						size={20}
						icon={
							<MaterialCommunityIcons
								name="close"
								color={color.white}
								size={20}
								onPress={() => goBack()}
							/>
						}
					/>

					{isAudioPresent}
				</View>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	icons: {
		borderWidth: 1,
		borderColor: color.white,
		height: 60,
		width: 60,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	iconView: {
		width: "50%",
		justifyContent: "space-between",
		flexDirection: "row",
		alignSelf: "center",
	},
	img: { height: 150, width: "100%" },
	icon: {
		borderWidth: 1,
		borderColor: color.white,
		height: 60,
		width: 60,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		backgroundColor: color.white,
	},
	txt: { color: color.white, fontSize: 14, marginTop: 17 },
	Err: {
		marginVertical: 10,
		fontStyle: "italic",
		color: color.white,
	},
	wave: {
		height: 150,
		width: "50%",
		alignSelf: "center",
	},
	saveBtn: { width: 110 },
	reRecord: { color: color.white, fontSize: 12, marginTop: 17 },
});

export default RecordVoice;
