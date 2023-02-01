import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Dimensions, TouchableWithoutFeedback, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import color from "../../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

function AudioItem({ src, localUrl, fullScreen }, ref) {
	// const { icons, audio?, stopPlayer } = usePlayPauseAudio(src, true);

	const { addListener } = useNavigation();
	const [totalDuration, setTotalDuration] = useState(0);
	const [currentDuration, setCurrentDuration] = useState(0);

	const [audio] = useState(new AudioRecorderPlayer());

	const [icons, setIcons] = useState("play");

	const isFocused = useIsFocused();

	const play = async () => {
		console.log("onPlay");
		await audio.startPlayer(localUrl ? src : cloudinaryFeedUrl(src, "audio"));
		audio.addPlayBackListener((e) => {
			// console.warn(e, "eeeee");
			// let currentPosition = e.currentPosition / 1000;
			// let duration = e.duration / 1000;
			setCurrentDuration(e.currentPosition / 1000);
			setTotalDuration(e.duration / 1000);
			setIcons("pause");
			if (e.currentPosition === e.duration) {
				setIcons("replay");
			}
			return;
		});
	};

	const pause = async () => {
		console.log("onPause");
		audio.pausePlayer();
		setIcons("play");
		audio.removePlayBackListener();
	};

	useEffect(() => {
		addListener("blur", () => {
			audio?.stopPlayer();
			// audio?.removePlayBackListener();
		});

		if (!isFocused) {
			audio?.stopPlayer();
			audio?.removePlayBackListener();
		}
		return () => {
			audio?.stopPlayer();
			audio?.removePlayBackListener();
		};
	}, [isFocused]);

	// const play = () => {
	// 	try {
	// 		if (!audio || !audio?.isLoaded()) return;

	// 		if (timerRef.current) clearInterval(timerRef.current);
	// 		timerRef.current = setInterval(() => {
	// 			audio?.getCurrentTime((seconds, isPlaying) => {
	// 				setCurrentPlayTime(seconds); // HERE is time of current player
	// 			});
	// 		}, 300);

	// 		setIcons("pause");
	// 		audio?.play();
	// 	} catch (err) {
	// 		console.log("can't play voice message", err);
	// 	}
	// };
	// const pause = () => {
	// 	audio?.pause();
	// 	setIcons("play");
	// };

	useEffect(() => {
		// useEffect only for replay icon :/
		if (audio?._isPlaying)
			if (currentDuration === totalDuration) {
				audio?.stopPlayer();
			}
	}, [audio, currentDuration, totalDuration]);

	// useEffect(() => {
	// 	if (Math.ceil(currentPlayTime) === Math.ceil(audio?._duration)) {
	// 		clearInterval(timerRef.current);
	// 		setCurrentPlayTime(0);
	// 		setIcons("replay");
	// 	}

	// 	return () => {
	// 		// clearInterval(timerRef.current);
	// 	};
	// }, [currentPlayTime])

	useImperativeHandle(
		ref,
		() => ({
			play,
			pause,
			icons,
		}),
		[play, pause, icons]
	);

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				position: "relative",
				height: fullScreen ? "100%" : undefined,
				backgroundColor: color?.white,
				justifyContent: "center",
				width: Dimensions.get("screen").width,
				aspectRatio: fullScreen ? undefined : 1,
				paddingHorizontal: "2.5%",
			}}
		>
			<TouchableWithoutFeedback
				onPress={() => {
					if (icons === "pause") {
						pause();
					} else if (icons === "replay") {
						play();
					} else {
						play();
					}
				}}
			>
				<View>
					<View style={{ position: "absolute", right: -15, top: -15 }}>
						{audio?._isPlaying && (
							<CircularProgress
								value={currentDuration}
								radius={90}
								duration={totalDuration}
								progressValueColor={"#ecf0f100"}
								activeStrokeColor={"#2465FD"}
								activeStrokeSecondaryColor={"#C25AFF"}
								maxValue={totalDuration}
							/>
						)}
					</View>
					<View
						style={{
							width: 150,
							height: 150,
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "transparent",
							borderRadius: 100,
							borderWidth: 5,
							borderColor: "#fff",
						}}
					>
						<MaterialCommunityIcons
							name={icons}
							size={100}
							color={"#fff"}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}

export default AudioType = forwardRef(AudioItem);
