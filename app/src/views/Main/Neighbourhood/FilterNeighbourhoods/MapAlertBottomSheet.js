import { Text } from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	Platform,
	Linking,
	TouchableWithoutFeedback,
} from "react-native";
import FastImage from "react-native-fast-image";
import RBSheet from "react-native-raw-bottom-sheet";
import color from "../../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import Sound from "react-native-sound";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { AntDesign } from "@expo/vector-icons";
import { AppContext } from "../../../../Context/AppContext";
import VideoType from "../../Feed/ViewTypes/VideoType";
import GetDistance from "../../../../constants/components/GetDistance";

function MapAlertBottomSheet({ bottomSheetData, openSheet, rbSheet }) {
	const [audio, setAudio] = useState();
	const [icon, setIcons] = useState("playcircleo");
	const reverseCountRef = useRef(null);
	const [reverseTimer, setReverseTimer] = useState(0);
	const { location } = useContext(AppContext);
	const navigateToMap = () => {
		const scheme = Platform.select({
			ios: "maps:0,0?q=",
			android: "geo:0,0?q=",
		});
		const latLng = `${bottomSheetData?.location?.coordinates?.[1]},${bottomSheetData?.location?.coordinates?.[0]}`;
		const label = bottomSheetData?.eventName;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});
		Linking.openURL(url);
	};

	function reverseTimefunc() {
		const getSeconds = `0${reverseTimer % 60}`.slice(-2);
		const minutes = `${Math.floor(reverseTimer / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(reverseTimer / 3600)}`.slice(-2);

		return `${getHours} : ${getMinutes} : ${getSeconds}`;
	}

	useEffect(() => {
		if (bottomSheetData?.audioSrc) {
			loadSound();
		}
	}, [bottomSheetData]);

	const loadSound = () => {
		console.warn("loading sound");

		Sound.setCategory("Playback");
		var ding = new Sound(
			cloudinaryFeedUrl(bottomSheetData?.audioSrc, "audio"),
			null,
			(error) => {
				if (error) {
					console.log("failed to load the sound", error);
					return;
				}
				// when loaded successfully
				//console.log("when loaded successfully");
			}
		);

		ding.setVolume(1);
		setAudio(ding);
	};

	const playPause = () => {
		if (audio?.isPlaying()) {
			audio.pause();
			setIcons("playcircleo");
			clearInterval(reverseCountRef.current);

			// setReverseTimer(0);
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

	return (
		<View style={styles.container}>
			<RBSheet
				customStyles={{
					container: {
						borderRadius: 10,
						backgroundColor: color.gradientWhite,
						paddingHorizontal: 10,
					},
				}}
				// height={420}
				height={520}
				ref={rbSheet}
				onOpen={() => {
					setReverseTimer(0);
					clearInterval(reverseCountRef.current);
					setIcons("playcircleo");
				}}
				onClose={() => {
					if (audio?.isPlaying()) {
						console.warn("release");
						audio?.pause();
						audio?.release();
					}
				}}
				dragFromTopOnly={true}
				closeOnDragDown={true}
				closeOnPressMask={true}
				draggableIcon
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text
						color={color?.black}
						alignSelf="center"
						fontSize={16}
						fontWeight="medium"
					>
						{bottomSheetData?.eventName}
					</Text>

					{bottomSheetData?.anonymous ? (
						<Text color={color?.black}>
							{bottomSheetData?.createdByUser.firstName}{" "}
							{bottomSheetData?.createdByUser.lastName}
						</Text>
					) : (
						<Text color={color?.black}>Anonymous</Text>
					)}
					<Text
						numberOfLines={2}
						color={color?.black}
					>
						{bottomSheetData?.metaInfo?.address}
					</Text>

					<GetDistance
						lat1={location?.location?.latitude}
						lon1={location?.location?.longitude}
						lat2={bottomSheetData?.location?.coordinates[1]}
						lon2={bottomSheetData?.location?.coordinates[0]}
					/>

					<Text
						color={color?.black}
						my={5}
					>
						{bottomSheetData?.description}
					</Text>

					{bottomSheetData?.imageUrl && (
						<>
							<Text
								fontSize={14}
								color={color?.black}
								my={3}
							>
								Image
							</Text>

							<FastImage
								source={{ uri: cloudinaryFeedUrl(bottomSheetData?.imageUrl, "image") }}
								style={{ marginBottom: 10, height: 250, width: "100%" }}
							/>
						</>
					)}

					{bottomSheetData?.videoUrl && (
						<>
							<Text
								fontSize={14}
								color={color?.black}
								my={3}
							>
								Video
							</Text>
							<View
								style={{
									height: 300,
									width: 300,
									alignSelf: "center",
									marginBottom: 10,
								}}
							>
								<VideoType src={bottomSheetData?.videoUrl} />
							</View>
						</>
					)}

					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<AppFabButton
							size={20}
							onPress={() => {
								playPause();
							}}
							icon={
								<AntDesign
									name={icon}
									size={26}
									color={color?.black}
								/>
							}
						/>
						<Text color={color?.black}>
							{reverseTimefunc()}
							{/* {icon !== "playcircleo" ? reverseTimefunc() : "00 : 00 : 00"} */}
						</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							width: "75%",
							alignSelf: "center",
							justifyContent: "center",
							marginBottom: 20,
						}}
					>
						{bottomSheetData?.audioSrc && (
							<TouchableWithoutFeedback
								onPress={() => {
									playPause();
								}}
							>
								<View
									style={{
										paddingHorizontal: 20,
										paddingVertical: 10,
										borderWidth: 1,
										backgroundColor: color.primary,
										borderColor: color?.primary,
										marginRight: 20,
										borderRadius: 25,
									}}
								>
									<Text color={color.white}>Play voice note</Text>
								</View>
							</TouchableWithoutFeedback>
						)}

						<TouchableWithoutFeedback onPress={navigateToMap}>
							<View
								style={{
									backgroundColor: color.primary,
									borderColor: color?.primary,
									paddingHorizontal: 20,
									paddingVertical: 10,
									borderWidth: 1,
									borderRadius: 25,
								}}
							>
								<Text color={"#000"}>Get Direction</Text>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</ScrollView>
			</RBSheet>
		</View>
	);
}

const styles = StyleSheet.create({});

export default MapAlertBottomSheet;
