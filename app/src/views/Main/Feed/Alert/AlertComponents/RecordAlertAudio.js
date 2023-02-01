import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Sound from "react-native-sound";
import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../../constants/env/color";

function RecordAlertAudio({ setMicIcon, micIcon, audioUrl, setAudioUrl }) {
	const [audio, setAudio] = useState();
	const [timer, setTimer] = useState(0);
	const [recording, setRecording] = useState();
	const [icon, setIcons] = useState("playcircleo");

	const [showGif, setShowGif] = useState(false);
	const [reverseTimer, setReverseTimer] = useState(0);
	const countRef = useRef(null);
	const reverseCountRef = useRef(null);

	async function startRecording() {
		try {
			setShowGif(true);
			setMicIcon("microphone-slash");
			audio?.pause();
			setAudio();
			setAudioUrl();
			console.log("Requesting permissions..");
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			console.log("Starting recording..");

			setTimer(0);
			countRef.current = setInterval(() => {
				setTimer((timer) => timer + 1);
			}, 1000);
			const { recording } = await Audio.Recording.createAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);

			setRecording(recording);
			console.log("Recording started");
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	}

	async function stopRecording() {
		setMicIcon("microphone");
		setShowGif(false);

		clearInterval(countRef.current);
		console.log("Stopping recording..");
		setRecording(undefined);
		await recording.stopAndUnloadAsync();
		const uri = recording.getURI();
		setAudioUrl(uri);

		console.log("Recording stopped and stored at", uri);
	}

	useEffect(() => {
		if (audioUrl) {
			loadSound();
		}
		return () => {
			if (audio) {
				audio.release();
			}
			// stopPlayer();
		};
	}, [audioUrl]);

	const loadSound = () => {
		Sound.setCategory("Playback");
		var ding = new Sound(audioUrl, "", (error) => {
			if (error) {
				console.log("failed to load the sound", error);
				return;
			}
			// when loaded successfully
			//console.log("when loaded successfully");
		});
		ding.setVolume(1);
		setAudio(ding);
	};

	const playPause = () => {
		if (audio?.isPlaying()) {
			audio.pause();
			setIcons("playcircleo");
		} else {
			setReverseTimer(0);
			setIcons("pausecircleo");
			reverseCountRef.current = setInterval(() => {
				setReverseTimer((time) => time + 1);
			}, 1000);

			audio?.play((success) => {
				if (success) {
					setIcons("playcircleo");

					clearInterval(reverseCountRef.current);

					console.log("successfully finished playing");
				} else {
					setIcons("playcircleo");
					console.log("playback failed due to audio decoding errors");
				}
			});
		}
	};

	const formatTime = () => {
		const getSeconds = `0${timer % 60}`.slice(-2);
		const minutes = `${Math.floor(timer / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

		return `${getHours} : ${getMinutes} : ${getSeconds}`;
	};

	function reverseTimefunc() {
		const getSeconds = `0${reverseTimer % 60}`.slice(-2);
		const minutes = `${Math.floor(reverseTimer / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(reverseTimer / 3600)}`.slice(-2);

		return `${getHours} : ${getMinutes} : ${getSeconds}`;
	}

	return (
		<View style={{ marginTop: 20 }}>
			<Text
				fontSize={16}
				fontWeight={"medium"}
				color={color?.black}
			>
				Record Audio
			</Text>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					width: "100%",
					justifyContent: "space-between",
					marginTop: 10,
					borderRadius: 8,
					elevation: 5,
					backgroundColor: color?.lightWhite,
					shadowColor: "grey",
					shadowOffset: { height: 1, width: 1 },
					shadowOpacity: 0.2,
					shadowRadius: 8,
				}}
			>
				<AppFabButton
					size={22}
					onPress={recording ? stopRecording : startRecording}
					icon={
						<FontAwesome
							name={micIcon}
							size={24}
							color={color?.black}
						/>
					}
				/>

				{reverseCountRef?.current ? (
					<View>
						{reverseCountRef.current && (
							<View style={{ flexDirection: "row" }}>
								<Text
									fontSize={18}
									style={{
										color: color?.black,
									}}
								>
									{reverseTimefunc()}
								</Text>
								{showGif && (
									<Image
										source={require("../../../../../../assets/Animations/wave.gif")}
										style={{ height: 30, width: 100, marginHorizontal: 10 }}
									/>
								)}
							</View>
						)}
					</View>
				) : (
					<View>
						{countRef.current && (
							<View style={{ flexDirection: "row" }}>
								<Text
									fontSize={18}
									style={{
										color: color?.black,
									}}
								>
									{formatTime()}
								</Text>
								{showGif && (
									<Image
										source={require("../../../../../../assets/Animations/wave.gif")}
										style={{ height: 30, width: 100, marginHorizontal: 10 }}
									/>
								)}
							</View>
						)}
					</View>
				)}
				{audioUrl && (
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<AppFabButton
							size={22}
							onPress={() => {
								setAudioUrl();
								audio.pause();
								setAudio();
								countRef.current = null;
								reverseCountRef.current = null;
							}}
							icon={
								<AntDesign
									name={"delete"}
									size={24}
									color={color?.black}
								/>
							}
						/>
						<AppFabButton
							size={22}
							onPress={() => {
								playPause();
							}}
							icon={
								<AntDesign
									name={icon}
									size={24}
									color={color?.black}
								/>
							}
						/>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default RecordAlertAudio;
