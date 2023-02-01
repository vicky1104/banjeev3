import { Text } from "native-base";
import React, { Fragment, useEffect, useState } from "react";
import {
	Image,
	Keyboard,
	Linking,
	Platform,
	TouchableOpacity,
} from "react-native";
import { View, StyleSheet } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Sound from "react-native-sound";
import color from "../../constants/env/color";
import { AppContext } from "../../Context/AppContext";
import { darkMap, profileUrl } from "../../utils/util-func/constantExport";
import ReportFeed from "../../constants/components/Cards/ReportFeed";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { CreateRoomService } from "../../helper/services/RoomServices";
import ringtone from "../../../assets/ringtones/emergency.mp3";
import GetDistance from "../../constants/components/GetDistance";

function EmergencyModal() {
	const handleIgnore = () => {
		setEmergency({ open: false });
	};
	const { navigate } = useNavigation();
	const { emergency, setEmergency, location, profile } =
		React.useContext(AppContext);
	console.warn(emergency);
	const [audio, setAudio] = useState();
	const mapRef = React.useRef().current;
	const [reportModal, setReportModal] = useState(false);

	const navigateToMap = () => {
		handleIgnore();
		navigate("TrackDirection", { data: emergency });

		// const scheme = Platform.select({
		// 	ios: "maps:0,0?q=",
		// 	android: "geo:0,0?q=",
		// });
		// const latLng = `${emergency?.location?.coordinates?.[1]},${emergency?.location?.coordinates?.[0]}`;
		// const label = "Emergency";
		// const url = Platform.select({
		// 	ios: `${scheme}${label}@${latLng}`,
		// 	android: `${scheme}${latLng}(${label})`,
		// });
		// Linking.openURL(url);
	};

	React.useEffect(() => {
		Sound.setCategory("Playback");
		var ding = new Sound(ringtone, (error) => {
			if (error) {
				console.log("failed to load the sound", error);
				return;
			} else {
				ding.play();
			}
		});
		ding.setVolume(1);
		setAudio(ding);

		return () => {
			if (ding) {
				ding.release();
			}
		};
	}, []);

	const goToComment = () => {
		handleIgnore();
		navigate("AlertComment", { alertId: emergency?.id });
	};

	// const goToChat = () => {
	// 	CreateRoomService({
	// 		userA: {
	// 			avtarImageUrl: profile?.avtarUrl,
	// 			domain: profile?.domain,
	// 			email: profile?.email,
	// 			externalReferenceId: profile?.systemUserId,
	// 			firstName: profile?.firstName,
	// 			id: profile?.systemUserId,
	// 			lastName: profile?.lastName,
	// 			mcc: profile?.mcc,
	// 			mobile: profile?.mobile,
	// 			profileImageUrl: profile?.avtarUrl,
	// 			userName: profile?.username,
	// 			userType: 0,
	// 		},
	// 		userB: emergency?.createdByUser,
	// 	})
	// 		.then((res) => {
	// 			handleIgnore();
	// 			navigate("BanjeeUserChatScreen", {
	// 				item: {
	// 					group: false,
	// 					firstName: emergency?.createdByUser?.firstName || "",
	// 					lastName: emergency?.createdByUser?.lastName || "",
	// 					roomId: res?.id || "",
	// 					userId: emergency?.createdByUser?.id || "",
	// 					fromNotification: true,
	// 				},
	// 			});
	// 		})
	// 		.catch((err) => console.error(err));
	// };

	useEffect(() => {
		Keyboard.dismiss();
		if (audio) {
			audio?.play((success) => {
				if (success) {
					console.log("successfully finished playing");
				} else {
					console.log("playback failed due to audio decoding errors");
				}
			});
		}
	}, [audio]);
	const actionArray = [
		{
			label: "Direction",
			iconName: "assistant-direction",
			onPress: navigateToMap,
		},
		{
			label: "Comment",
			iconName: "comment",
			onPress: goToComment,
		},
		{
			label: "Report",
			iconName: "report",
			onPress: () => setReportModal(emergency?.cloudId),
		},
		{
			label: "Ignore",
			iconName: "cancel",
			onPress: handleIgnore,
		},
	];

	return (
		<Fragment>
			<View
				style={{
					position: "absolute",
					height: "100%",
					width: "100%",
					zIndex: 9,
					backgroundColor: "rgba(0,0,0,0.7)",
				}}
			>
				<View
					style={{
						display: "flex",
						justifyContent: "center",
						height: "100%",
						width: "100%",
						paddingHorizontal: 20,
					}}
				>
					<View
						style={{
							borderRadius: 12,
							backgroundColor: color?.gradientWhite,
							borderWidth: 1,
							borderColor: "#999",
							width: "100%",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<View
							style={{
								position: "absolute",
								top: -45,
								borderRadius: 35,
								backgroundColor: "#000",
								height: 70,
								width: 70,
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								color="#FFF"
								fontWeight={900}
								fontSize={18}
							>
								Alert
							</Text>
						</View>
						<Text
							fontSize={18}
							style={{
								textAlign: "center",
								paddingTop: 30,
								paddingBottom: 10,
								color: color?.black,
							}}
							fontWeight={700}
						>
							Someone need your help
						</Text>

						<View
							style={{
								borderRadius: 24,
								borderWidth: 1,
								borderColor: "red",
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-around",
								marginBottom: 10,
								paddingVertical: 5,
								paddingHorizontal: 10,
							}}
						>
							<View style={{ marginRight: 10 }}>
								<MaterialIcons
									name="directions-run"
									size={20}
									color="red"
								/>
							</View>
							<GetDistance
								lat1={location?.location?.latitude}
								lon1={location?.location?.longitude}
								lat2={emergency?.location?.coordinates[1]}
								lon2={emergency?.location?.coordinates[0]}
							/>
						</View>

						<View
							style={{
								width: "100%",
								backgroundColor: "#D0D0D0",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							{emergency?.createdByUser?.avtarImageUrl && (
								<View style={{ width: "40%", flex: 1, zIndex: 11 }}>
									<FastImage
										source={{ uri: profileUrl(emergency?.createdByUser?.avtarImageUrl) }}
										style={{ width: "100%", flex: 1 }}
										resizeMode="cover"
									/>
								</View>
							)}
							<View
								style={{
									width: emergency?.createdByUser?.avtarImageUrl ? "60%" : "100%",
								}}
							>
								{emergency?.location?.coordinates?.[0] &&
									emergency?.location?.coordinates?.[1] && (
										<MapView
											mapType="hybrid"
											ref={mapRef}
											showsPointsOfInterest={true}
											showsCompass={false}
											maxZoomLevel={15}
											customMapStyle={darkMap}
											userLocationPriority="low"
											initialRegion={{
												longitude: emergency?.location?.coordinates?.[0],
												latitude: emergency?.location?.coordinates?.[1],
												latitudeDelta: 0.001,
												longitudeDelta: 0.001,
											}}
											region={{
												longitude: emergency?.location?.coordinates?.[0],
												latitude: emergency?.location?.coordinates?.[1],
												latitudeDelta: 0.001,
												longitudeDelta: 0.001,
											}}
											provider={PROVIDER_GOOGLE}
											style={{
												zIndex: -1,
												height: 200,
												width: "100%",
												alignSelf: "center",
											}}
										>
											<Marker
												coordinate={{
													longitude: emergency?.location?.coordinates?.[0],
													latitude: emergency?.location?.coordinates?.[1],
												}}
											>
												<Entypo
													name="location-pin"
													size={30}
													color="red"
												/>
											</Marker>
										</MapView>
									)}
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								paddingVertical: 20,
								paddingHorizontal: 10,
							}}
						>
							{actionArray?.map((ele, index) => (
								<TouchableOpacity
									onPress={() => ele.onPress()}
									style={{
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										width: "25%",
									}}
								>
									<React.Fragment>
										<MaterialIcons
											name={ele.iconName}
											size={26}
											color="#FFF"
										/>
										<Text
											color="#FFF"
											mt={0.5}
										>
											{ele?.label}
										</Text>
									</React.Fragment>
								</TouchableOpacity>
							))}
							{/* <AppButton
							// 	style={{ width: 120 }}
							// 	title={"Get Direction"}
							// 	onPress={navigateToMap}
							// />
							// <AppBorderButton
							// 	width={80}
							// 	title={"Ignore"}
							// 	onPress={handleIgnore}
							// />
							// <AppButton
							// 	style={{ width: 120 }}
							// 	title={"Report"}
							// 	onPress={() => setReportModal(emergency?.cloudId)}
							// /> */}
						</View>
					</View>
				</View>
			</View>

			{reportModal && (
				<ReportFeed
					onPress={handleIgnore}
					setModalVisible={setReportModal}
					modalVisible={reportModal}
					feedId={reportModal}
					reportType="alert"
				/>
			)}
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		elevation: 50,
		shadowColor: "grey",
		shadowOffset: {
			height: 10,
			width: 10,
		},

		borderRadius: 8,
		shadowRadius: 50,
		shadowOpacity: 0.8,
		alignSelf: "center",
		zIndex: 2,
		// height: 200,
		width: "100%",
		justifyContent: "center",
	},
});

export default EmergencyModal;
