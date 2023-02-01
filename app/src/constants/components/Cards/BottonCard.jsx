import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import KeyboardView from "../KeyboardView";

export default function BottonCard(props) {
	const {
		gender,
		isActive,
		name,
		setState,
		age,
		profileImg,
		distance,
		voiceIntroSrc: voice,
	} = props;

	const { icons, playAudio } = usePlayPauseAudio(voice);
	const [modalVisible, setModalVisible] = React.useState(false);

	const {
		userData: { currentUser, voiceIntroSrc, systemUserId },
	} = React.useContext(MainContext);

	React.useEffect(() => {
		if (voice && isActive) {
			playAudio(voice);
		}
	}, [voice, isActive]);

	const saveIntro = async () => {
		const toUser = {
			avtarUrl: profileImg,
			domain: "208991",
			email: props?.email,
			firstName: props?.name,
			id: props?.userId,
			lastName: props?.lastName,
			locale: "eng",
			mcc: props?.mcc,
			mobile: props?.mobile,
			realm: "banjee",
			ssid: null,
			systemUserId: props?.systemUserId,
			timeZoneId: "GMT",
			username: props?.name,
		};
		let d = await Location.getCurrentPositionAsync();
		const { latitude, longitude } = d.coords;

		let payload = {
			accepted: null,
			circleId: null,
			content: {
				aspectRatio: null,
				base64Content: null,
				caption: null,
				description: null,
				height: null,
				length: null,
				mediaSource: null,
				mimeType: "audio/mp3",
				sequenceNumber: null,
				sizeInBytes: null,
				src: null,
				subTitle: null,
				tags: null,
				title: "MediaVoice",
				type: null,
				width: null,
			},
			currentLocation: {
				lat: latitude,
				lon: longitude,
			},
			defaultReceiver: systemUserId,
			domain: "banjee",
			fromUser: {
				...currentUser,
				systemUserId,
				avtarUrl: currentUser.avtarImageUrl,
				firstName: currentUser.userName,
			},
			fromUserId: currentUser.id,
			message: `from ${currentUser.userName} to ${name}`,
			processedOn: null,
			rejected: null,
			toUser: { ...toUser, id: systemUserId },
			toUserId: systemUserId,
			voiceIntroSrc,
		};
		delete payload.fromUser.authorities;

		FriendRequest(payload)
			.then(async (res) => {
				let notificationRingtone = require("../../../assets/ringtones/sendFriendRequestTone.mp3");
				let { sound } = await Audio.Sound.createAsync(notificationRingtone);
				await sound.playAsync();
				ToastMessage("Friend Request Sent Successfully");
				setTimeout(() => {
					setState((prev) => ({ currentIndex: prev.currentIndex + 1 }));
				}, 1000);
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const handleModelVisible = () => {
		setModalVisible(!modalVisible);
	};

	const handleCurrentIndexFunc = () => {
		setState((prev) => ({ currentIndex: prev.currentIndex + 1 }));
	};
	return (
		<React.Fragment>
			<View style={styles.mainBottomView}>
				<View style={styles.iconView}>
					<AppFabButton
						onPress={playAudio}
						style={[styles.icons, { backgroundColor: color.primary }]}
						icon={
							<MaterialCommunityIcons
								name={icons}
								size={18}
								color={color.white}
							/>
						}
					/>
					<View style={{ height: 30, width: "60%" }}>
						{icons === "pause" && (
							<FastImage
								source={require("../../../Animations/wave.gif")}
								style={styles.gif}
							/>
						)}
					</View>

					<AppFabButton
						onPress={handleModelVisible}
						style={styles.icons}
						icon={
							<FastImage
								style={{ height: 20, width: 20, tintColor: color.primary }}
								source={require("../../../assets/EditDrawerIcon/ic_flag.png")}
							/>
						}
					/>
				</View>

				{/* `````````````````````````````` BOTTOM VIEW ```````````````````` */}

				<View style={styles.bottomView}>
					<AppText style={{ fontWeight: "400", marginTop: 10 }}>
						{name ? name : "---"}
					</AppText>

					<AppText
						style={{
							fontSize: 14,
							color: "grey",
							marginTop: 9,
						}}
					>
						{gender ? gender : "---"} , {age} Years , {Math.round(distance)}
						Kms
					</AppText>

					<View style={styles.btnGrp}>
						<AppFabButton
							size={20}
							onPress={saveIntro}
							style={styles.fabButton}
							icon={
								<FastImage
									style={{ height: 20, width: 20 }}
									source={require("../../../assets/EditDrawerIcon/ic_add_contact.png")}
								/>
							}
						/>

						<AppFabButton
							size={20}
							style={styles.fabButton}
							onPress={handleCurrentIndexFunc}
							icon={
								<FastImage
									style={{ height: 20, width: 20 }}
									source={require("../../../assets/EditDrawerIcon/ic_close.png")}
								/>
							}
						/>
					</View>
				</View>
			</View>
			{modalVisible && (
				<ReportUser
					setModalVisible={setModalVisible}
					modalVisible={true}
					systemUserId={systemUserId}
				/>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	iconView: {
		zIndex: 1,
		alignSelf: "center",
		width: "90%",
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
	},
	mainBottomView: {
		backgroundColor: color.white,
		height: 150,
		width: "100%",
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		alignItems: "center",
		flexDirection: "column",
		paddingTop: 10,
	},
	bottomView: {
		height: 130,
		width: "100%",
		justifyContent: "space-evenly",
		flexDirection: "column",
		backgroundColor: color.white,
		alignSelf: "center",
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		alignItems: "center",
		paddingBottom: 40,
	},
	fabButton: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50,
		backgroundColor: color.primary,
	},

	icons: {
		height: 34,
		width: 34,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
	},
	gif: {
		height: 30,
		width: "100%",
		zIndex: 1,
		marginLeft: 5,
	},
	btnGrp: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
		width: 96,
	},
});
