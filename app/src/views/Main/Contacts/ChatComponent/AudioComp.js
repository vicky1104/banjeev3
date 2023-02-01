import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "native-base";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import Sound from "react-native-sound";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import { destructChat } from "../../../../helper/services/ChatService";
import CircularProgress from "react-native-circular-progress-indicator";
import { useRef } from "react";
import { useIsFocused } from "@react-navigation/core";
import { useContext } from "react";
import { MainChatContext } from "../MainChatContext";
import { MainContext } from "../../../../../context/MainContext";

function AudioComp({
	messId,
	status,
	isSender,
	chatContent,
	src,
	base64Content,
	selfDestructive,
	...rest
}) {
	const { audios, setAudios } = useContext(MainContext);
	const [audio, setAudio] = useState(null);
	const [icons, setIcons] = useState("play");
	const [currentPlayTime, setCurrentPlayTime] = useState(0);
	const timerRef = useRef();

	useEffect(() => {
		if (audios === src) {
			Sound.setCategory("Playback");
			let ding = new Sound(audios, null, (error) => {
				if (error) {
					console.log("failed to load the sound", error);
					return;
				}
				ding.setVolume(1);
				setIcons("pause");
				play(ding);
				setAudio(ding);
			});
		} else {
			setCurrentPlayTime(0);
			audio?.pause();
			setIcons("play");
		}
		return () => {
			setAudios(null);
			setAudio(null);
		};
	}, [audios, src]);

	const isFocused = useIsFocused();

	useEffect(() => {
		if (!isFocused && audio) {
			audio?.stop();
		}
		return () => {
			// stopPlayer();
			if (audio) {
				audio?.release();
			}
		};
	}, [
		// stopPlayer,
		audio,
		isFocused,
	]);

	const play = (ding) => {
		try {
			if (!ding || !ding?.isLoaded()) return;

			if (timerRef.current) clearInterval(timerRef.current);
			timerRef.current = setInterval(() => {
				ding?.getCurrentTime((seconds, isPlaying) => {
					setCurrentPlayTime(seconds); // HERE is time of current player
				});
			}, 300);

			setIcons("pause");
			ding?.play();
		} catch (err) {
			console.log("can't play voice message", err);
		}
	};

	useEffect(() => {
		if (Math.ceil(currentPlayTime) === Math.ceil(audio?._duration)) {
			clearInterval(timerRef.current);
			setCurrentPlayTime(0);
			setIcons("replay");
		}

		return () => {};
	}, [currentPlayTime]);
	const [timer, setTimer] = React.useState(
		selfDestructive?.destructiveAgeInSeconds
	);
	const [timerStart, setTimerStart] = React.useState(false);

	const destructChatApiCall = React.useCallback(() => {
		destructChat(messId)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.warn(err));
	}, []);

	React.useEffect(() => {
		if (selfDestructive?.selfDestructive && isSender && timerStart) {
			let myInterval = setInterval(() => {
				if (timer > 0) {
					setTimer(timer - 1);
				}
				if (timer === 26) {
					destructChatApiCall();
				}
				if (timer === 0) {
					console.log("time over");
					clearInterval(myInterval);
				}
			}, 1000);
			return () => {
				clearInterval(myInterval);
			};
		}
	}, [timer, timerStart]);

	const d = () => (
		<View style={{ flex: 1 }}>
			{selfDestructive?.selfDestructive && !isSender && (
				<View
					style={{
						position: "absolute",
						left: 60,
						top: 22,
						shadowOpacity: 0,
					}}
				>
					<FastImage
						source={require("../../../../../assets/EditDrawerIcon/ic_distructive.png")}
						style={{ height: 40, width: 40, shadowOpacity: 0 }}
					/>
				</View>
			)}
			{selfDestructive?.selfDestructive && isSender && (
				<View
					style={{
						height: 40,
						width: 40,
						backgroundColor: "#FFF",
						position: "absolute",
						top: 8,
						right: 10,
						borderRadius: 50,
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<FastImage
						source={require("../../../../../assets/EditDrawerIcon/oval.png")}
						style={{ height: "100%", width: "100%" }}
					/>
					<Text style={{ position: "absolute" }}>{timer}</Text>
				</View>
			)}
			<View
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				{!chatContent?.loader ? (
					<TouchableWithoutFeedback
						onPress={() => {
							if (icons === "pause") {
								audio?.pause();
								setIcons("play");
							} else {
								setAudios(src ? src : `data:audio/mp3;base64,${base64Content}`);
							}
						}}
					>
						<View style={{ padding: 5 }}>
							<View style={{ position: "absolute", right: -2, top: -2 }}>
								<CircularProgress
									value={currentPlayTime}
									radius={20}
									duration={audio?._duration}
									progressValueColor={"#ecf0f100"}
									activeStrokeColor={"#2465FD"}
									activeStrokeSecondaryColor={"#C25AFF"}
									maxValue={audio?._duration}
								/>
							</View>

							<MaterialCommunityIcons
								name={icons}
								size={25}
								color={"#000"}
							/>
						</View>
					</TouchableWithoutFeedback>
				) : (
					<ActivityIndicator
						size={"large"}
						color={color?.white}
					/>
				)}

				{/* <ScrollView
					showsHorizontalScrollIndicator={false}
					horizontal
					ref={scrollViewRef}
					onContentSizeChange={() =>
						scrollViewRef.current?.scrollToEnd({ animated: true })
					}
				>
					{status?.map(({ meter: ele }, index, arr) => {
						return (
							<View
								key={Math.random()}
								style={{
									width: 2,
									borderRadius: 16,
									transform: [
										{ translateY: Math.abs(ele) / 2 },
										{ scaleY: Math.abs(ele) / 100 },
									],
									backgroundColor: "black",
									height: 100 + ele,
									marginTop: -20,
									marginRight: 3,
								}}
							/>
						);
					})}
				</ScrollView> */}
			</View>
		</View>
	);

	return (
		<View
			style={{
				// width: "0%",
				display: "flex",
				flexDirection: isSender ? "row-reverse" : "row",
				alignItems: "center",
				justifyContent: "flex-end",
			}}
		>
			{isSender ? (
				<View
					style={{
						backgroundColor: color.primary,
						borderRadius: 10,
						padding: 10,
						maxWidth: 280,
					}}
				>
					{d()}
				</View>
			) : (
				<View
					style={{
						backgroundColor: "#505050",
						borderRadius: 10,
						padding: 10,
						maxWidth: 280,
					}}
				>
					{d()}
				</View>
			)}
		</View>
	);
}

export default AudioComp;
