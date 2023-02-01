import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	VirtualizedList,
} from "react-native";
import React, { useEffect, useState } from "react";
// import * as MediaLibrary from "expo-media-library";
import FastImage from "react-native-fast-image";
import { useFocusEffect } from "@react-navigation/native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import IonIcon from "react-native-vector-icons/Ionicons";

export default function GalaryMedia({
	video,
	setMediaState,
	displayCameraMedia,
}) {
	const [media, setMedia] = useState([]);

	useFocusEffect(
		React.useCallback(() => {
			CameraRoll.getPhotos({
				first: 20,
				assetType: video ? "All" : "Photos",
			})
				.then((mediaResult) => {
					setMedia(mediaResult?.edges);
				})
				.catch((err) => console.error(err));
			return () => {
				setMedia([]);
			};
		}, [])
	);

	return (
		<View
			style={{
				height: 100,
				width: Dimensions.get("screen").width,
				flexDirection: "row",
				justifyContent: "space-between",
				paddingHorizontal: 5,
			}}
		>
			<VirtualizedList
				data={media}
				horizontal={true}
				refreshing={false}
				getItemCount={(data) => data.length}
				getItem={(data, index) => data[index]}
				keyExtractor={(data) => data.id}
				nestedScrollEnabled={true}
				scrollEnabled={true}
				renderItem={({ item }) => {
					let type = item?.node?.type?.split("/")?.[0];
					return (
						<TouchableOpacity
							onPress={() => {
								setMediaState((prev) => ({
									...prev,
									media: {
										...item?.node?.image,
										fileUri: item?.node?.image.uri,
										mimeType: item?.node?.type,
										captured: false,
									},
									type: type === "image" ? "photo" : "video",
								}));
								displayCameraMedia();
							}}
						>
							<View
								style={{
									height: 80,
									width: 80,
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									marginRight: 5,
								}}
							>
								<Image
									source={{
										uri: item?.node?.image.uri,
									}}
									resizeMode={FastImage.resizeMode.cover}
									style={{ height: 80, width: 80 }}
								/>
								{type === "video" && (
									<IonIcon
										name="videocam"
										size={20}
										color="white"
										style={{
											position: "absolute",
											bottom: 0,
											left: 5,
										}}
									/>
								)}
							</View>
						</TouchableOpacity>
					);
				}}
			/>
			{/* <ScrollView
				horizontal={true}
				style={{
					height: 80,
					width: "100%",
					backgroundColor: "red",
					flex: 1,
					flexDirection: "column",
				}}
			>
				{media &&
					media?.length > 0 &&
					media?.map((ele, index) => (
						<View
							style={{
								height: 100,
								width: "24%",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<FastImage
								source={{
									uri: ele?.node?.image.uri,
									priority: FastImage.priority.normal,
								}}
								resizeMode={FastImage.resizeMode.contain}
								style={{ width: "100%", height: "100%" }}
							/>
						</View>
					))}
			</ScrollView> */}
		</View>
	);
}

const styles = StyleSheet.create({});
