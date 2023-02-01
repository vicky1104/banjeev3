import React, { useContext } from "react";
import { View, StyleSheet, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { Text } from "native-base";
import color from "../../../../constants/env/color";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import { AppContext } from "../../../../Context/AppContext";
import { voiceIntro } from "../../../../helper/services/SettingService";

function PlayVoice(props) {
	const { registry } = useContext(AppContext);

	const [recorder, setRecorder] = React.useState();

	const [recorderingState, setRecordingState] = React.useState(false);

	const player = new Audio.Sound();

	const [icons, setIcons] = React.useState("play");

	const [visible, setVisible] = React.useState(false);

	const [timeErr, setTimeErr] = React.useState("");

	const [timer, setTimer] = React.useState(0);

	const countRef = React.useRef(null);

	const [audio, setAudio] = React.useState(
		registry?.voiceIntroSrc ? profileUrl(registry?.voiceIntroSrc) : null
	);

	const formatTime = () => {
		const getSeconds = `0${timer % 60}`.slice(-2);
		const minutes = `${Math.floor(timer / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

		return `${getHours} : ${getMinutes} : ${getSeconds}`;
	};

	// `````````````````````````````` START RECORDING

	const startRecording = async () => {
		try {
			const localRecorder = new Audio.Recording();
			setRecorder(localRecorder);
			const result = await localRecorder.getStatusAsync();
			setTimeErr("");
			setTimer(0); //reset Timer
			countRef.current = setInterval(() => {
				setTimer((timer) => timer + 1);
			}, 1000);

			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			await localRecorder.prepareToRecordAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			await localRecorder.startAsync();

			console.log("Starting recording..");
			setRecordingState(true);
			console.log("Recording started");
		} catch (error) {
			console.warn("Error in recording vedio", error);
		}
	};

	// `````````````````````````````` STOP RECORDING

	const stopRecording = async () => {
		clearInterval(countRef.current); // pause timer

		const result = await recorder.getStatusAsync();

		if (result.canRecord) {
			recorder
				.stopAndUnloadAsync()
				.then(async (e) => {
					if (e.durationMillis > 5000) {
						const uri = recorder.getURI();
						// console.log("Recording stopped and stored at", uri);
						setAudio(uri);
						setRecordingState(false);
						setVisible(false);
						setRecorder(null);
					} else {
						setTimeErr("Minimum 5 second of voice is required*");
						setRecordingState(false);
					}
				})
				.catch((err) => {
					console.warn(err);
				});
		} else {
			await startRecording();
		}
	};

	React.useEffect(() => {
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
	}, []);

	//``````````````````````````` Load Sound

	const loadSound = async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: false,
		});
		let localUri = "";
		if (audio?.split("/").includes("iwantcdn")) {
			const downloadResumable = FileSystem.createDownloadResumable(
				audio,
				FileSystem.documentDirectory + "sample.mp4"
			);
			const { uri } = await downloadResumable.downloadAsync();
			localUri = uri;
		} else {
			localUri = audio;
		}

		player
			.loadAsync(
				{
					uri: localUri,
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

	const player1 = React.useCallback(async () => {
		if (visible && icons === "play") {
			await stopPlayer();
		}
		const unsubscribe = navigation.addListener("blur", async () => {
			await stopPlayer();
		});

		return unsubscribe;
	}, [navigation, visible, icons]);

	React.useEffect(() => {
		player1();
	}, [player1]);

	const recordingStateView = (
		<View style={{ alignItems: "center", marginTop: 36 }}>
			{countRef && (
				<Text
					style={{
						color: color.white,
						fontSize: 30,
					}}
				>
					{timer ? formatTime() : "00 : 00 : 00"}
				</Text>
			)}

			<Text style={styles.Err}>{timeErr}</Text>

			{/* ```````````````````````````` START/STOP RECORDING  */}

			<View style={{ alignItems: "center" }}>
				<AppFabButton
					onPress={() => {
						recorderingState ? stopRecording() : startRecording();
					}}
					style={styles.icon}
					icon={
						<MaterialCommunityIcons
							name={recorderingState ? "stop" : "microphone-outline"}
							size={25}
							color={color.black}
						/>
					}
				/>

				<Text style={styles.txt}>{recorderingState ? "STOP" : "START"}</Text>
			</View>
		</View>
	);

	async function uploadRecording() {
		await stopPlayer();
		const mimeType = audio?.split(".")[audio?.split(".").length - 1];
		let data = await FileSystem.readAsStringAsync(audio, {
			encoding: FileSystem.EncodingType.Base64,
		});

		const payload = {
			content: {
				aspectRatio: null,
				base64Content: data,
				caption: null,
				description: null,
				height: 0,
				length: 0,
				mediaDesignType: 0,
				mediaSource: null,
				mimeType: `audio/${mimeType}`,
				sequenceNumber: 0,
				sizeInBytes: 0,
				src: null,
				subTitle: null,
				tags: null,
				title: "MediaIntro",
				type: null,
				width: 0,
			},
			id: registry?.id,
			systemUserId: registry?.systemUserId,
		};

		if (registry?.voiceIntroSrc) {
			// console.log("Present ", voiceIntroSrc);
			voiceIntro(payload, true)
				.then((res) => {
					// console.log("Present Response ", res);
					const audioUrl = profileUrl(res.content.src);
					// console.log("-------> ", audioUrl);
					setAudio(audioUrl);
				})
				.catch((err) => {
					console.warn(JSON.stringify(err, null, 2));
				});
		} else {
			// console.log("Not Present ", voiceIntroSrc);

			voiceIntro(payload, false)
				.then((res) => {
					// console.log("Not Present Response ", res);
					const audioUrl = profileUrl(res.content.src);
					// console.log("-------> ", audioUrl);
					setAudio(audioUrl);
				})
				.catch((err) => {
					console.warn(JSON.stringify(err, null, 2));
				});
		}
	}

	const playerStateView = (
		<React.Fragment>
			<View
				style={{
					height: 150,
				}}
			>
				<FastImage
					source={require("../../../../../assets/Animations/wave.gif")}
					style={[styles.wave, { opacity: icons === "pause" ? 1 : 0 }]}
				/>
			</View>
			<View style={styles.iconView}>
				<View style={{ alignItems: "center" }}>
					<AppFabButton
						onPress={() => {
							setVisible(true);
							setIcons("play");
						}}
						style={styles.icons}
						icon={
							<MaterialCommunityIcons
								name="replay"
								size={25}
								color={color.white}
							/>
						}
					/>

					<Text style={styles.reRecord}>RE-RECORD</Text>
				</View>

				{/* `````````````````````````````` PLAY PAUSE BUTTON `````````````````````  */}

				<View style={{ alignItems: "center" }}>
					<AppFabButton
						onPress={() => {
							setIcons(icons === "play" ? "pause" : "play");
							playAudio();
						}}
						style={[styles.icons, { backgroundColor: color.white }]}
						icon={
							<MaterialCommunityIcons
								name={icons}
								size={28}
								color={color.black}
							/>
						}
					/>

					<Text style={{ color: color.white, fontSize: 12, marginTop: 17 }}>
						{icons === "play" ? "PLAY" : "PAUSE"}
					</Text>
				</View>
			</View>
			{!visible && !audio.split("/").includes("iwantcdn") && (
				<AppButton
					style={styles.saveBtn}
					onPress={uploadRecording}
					title={"Save My Recording"}
				/>
			)}
		</React.Fragment>
	);
	const isAudioPresent = (
		<React.Fragment>
			{audio && !visible ? playerStateView : recordingStateView}
		</React.Fragment>
	);

	return <View>{isAudioPresent}</View>;
}

const styles = StyleSheet.create({
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
	saveBtn: {
		marginTop: 20,
		width: "50%",
		alignSelf: "center",
	},
	reRecord: { color: color.white, fontSize: 12, marginTop: 17 },
});

export default PlayVoice;
