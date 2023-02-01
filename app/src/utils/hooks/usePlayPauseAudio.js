import React from "react";
import { Linking, Platform } from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { cloudinaryFeedUrl, openAppSetting } from "../util-func/constantExport";
import { useToast } from "native-base";
import usePermission from "./usePermission";

function usePlayPauseAudio(voiceIntroSrc, doNotPlayOnLoad) {
	const toast = useToast();
	const { addListener } = useNavigation();

	const [icons, setIcons] = React.useState("play");
	const { checkPermission } = usePermission();

	const [player] = React.useState(new Audio.Sound());

	const stopPlayer = React.useCallback(async () => {
		setIcons("play");
		await player.unloadAsync();
	}, [player]);

	const loadSound = React.useCallback(async () => {
		if (voiceIntroSrc && voiceIntroSrc.length > 0) {
			const audio = voiceIntroSrc
				? cloudinaryFeedUrl(voiceIntroSrc, "audio")
				: null;

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
						console.warn(res.isLoaded, "res.isLoaded");
						await playSoundFunc();
					}
				})
				.catch((err) => {
					console.warn(err, "this is loading error ");
				});
		} else {
			toast.show({ description: "No voice present" });
		}
	}, [voiceIntroSrc, player]);

	const playSoundFunc = React.useCallback(async () => {
		setIcons("pause");
		const result = await player.getStatusAsync();
		if (result.isLoaded) {
			if (result.isPlaying === false) {
				player.playAsync().then((res) => {
					setTimeout(async () => {
						await stopPlayer();
					}, res.durationMillis);
				});
			} else {
				await stopPlayer();
			}
		}
	}, [player, stopPlayer]);

	const playAudio = React.useCallback(async () => {
		const result = await player.getStatusAsync();
		if (!result.isLoaded) {
			await loadSound();
		} else {
			await playSoundFunc();
		}
	}, [loadSound, playSoundFunc]);

	React.useEffect(() => {
		addListener("focus", async () => {
			let result = await checkPermission("AUDIO");
			if (result === "granted") {
				if (voiceIntroSrc && !doNotPlayOnLoad) {
					await loadSound();
				}
			} else {
				if (Platform.OS === "android") {
					Linking.openSettings();
				} else {
					openAppSetting(
						"Banjee needs to access microphone. Allow permissions for recording audio"
					);
				}
			}
		});

		async () => {
			await stopPlayer();
			setIcons("play");
		};
	}, [
		loadSound,
		checkPermission,
		addListener,
		doNotPlayOnLoad,
		voiceIntroSrc,
		stopPlayer,
	]);

	return { playAudio, stopPlayer, icons };
}

export default usePlayPauseAudio;
