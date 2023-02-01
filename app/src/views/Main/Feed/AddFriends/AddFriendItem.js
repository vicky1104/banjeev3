import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
	View,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import color from "../../../../constants/env/color";
import {
	checkGender,
	listProfileUrl,
} from "../../../../utils/util-func/constantExport";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "native-base";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { getProfile } from "../../../../redux/store/action/Profile/userPendingConnection";
import { useNavigation } from "@react-navigation/native";
import usePlayPauseAudio from "../../../../utils/hooks/usePlayPauseAudio";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import FastImage from "react-native-fast-image";
import { FriendRequest } from "../../../../helper/services/FriendRequest";
import { showToast } from "../../../../redux/store/action/toastAction";
import { useContext } from "react";
import { AppContext } from "../../../../Context/AppContext";

function AddFriendItem({ item, index }) {
	const [reqSent, setReqSent] = React.useState(false);

	const { systemUserId, currentUser, voiceIntroSrc } =
		useContext(AppContext)?.registry;

	const { icons, playAudio } = usePlayPauseAudio(item.voiceIntroSrc);

	const { navigate } = useNavigation();

	const [imageError, setImageError] = React.useState();

	if (systemUserId === item.systemUserId) {
		return null;
	}

	const sendFriendRequest = async () => {
		const toUser = {
			avtarUrl: item.avtarUrl,
			domain: "208991",
			email: item?.userObject?.email,
			firstName: item?.userObject?.firstName,
			id: item?.systemUserId,
			lastName: item?.userObject?.lastName,
			locale: "eng",
			mcc: item?.userObject?.mcc,
			mobile: item?.userObject?.mobile,
			realm: "banjee",
			ssid: null,
			systemUserId: item.systemUserId,
			timeZoneId: "GMT",
			username: item?.name,
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
			defaultReceiver: toUser.id,
			domain: "banjee",
			fromUser: {
				...currentUser,
				id: systemUserId,
				firstName: currentUser.userName,
			},
			fromUserId: systemUserId,
			message: `from ${currentUser.userName} to ${toUser.firstName}`,
			processedOn: null,
			rejected: null,
			toUser: toUser,
			toUserId: toUser.id,
			voiceIntroSrc,
		};
		delete payload.fromUser.authorities;

		FriendRequest(payload)
			.then(async (res) => {
				let notificationRingtone = require("../../../../../assets/ringtones/sendFriendRequestTone.mp3");

				let { sound } = await Audio.Sound.createAsync(notificationRingtone);
				console.log("playing sound");

				await sound.playAsync();
				console.log("audio played");
				setReqSent(true);
				alert("Friend Request Sent Successfully");
			})
			.catch((err) => {
				console.warn(err);
			});
	};
	return (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<LinearGradient
				style={styles.gradient}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 1 }}
				colors={
					index % 2 === 0 ? ["#0f1dd6", "#00b0ff"] : ["#662dac", "#e84564"]
				}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						// dispatch(getProfile({ profileId: item.systemUserId })),
						navigate("BanjeeProfile");
					}}
				>
					<FastImage
						onError={({ nativeEvent: { error } }) => setImageError(error)}
						source={
							imageError
								? checkGender(item.gender)
								: { uri: listProfileUrl(item.systemUserId) }
						}
						style={styles.profileImg}
					/>
				</TouchableWithoutFeedback>
				<Text style={styles.name} numberOfLines={1}>
					{item.name}
				</Text>
				{item.newUser && (
					<Text
						style={{
							position: "absolute",
							right: 8,
							top: 8,
							borderTopRightRadius: 2,
							color: color.white,
							paddingHorizontal: 5,
							backgroundColor: "red",
						}}
					>
						New
					</Text>
				)}
				<View style={styles.btnView}>
					<AppFabButton
						disable={reqSent}
						onPress={() => sendFriendRequest()}
						size={20}
						style={styles.btn}
						icon={
							<Image
								source={
									reqSent
										? require("../../../../../assets/EditDrawerIcon/ic_delivered.png")
										: require("../../../../../assets/EditDrawerIcon/ic_add_contact.png")
								}
								style={styles.icon}
							/>
						}
					/>

					<AppFabButton
						onPress={() => playAudio()}
						size={20}
						style={styles.btn}
						icon={
							<MaterialCommunityIcons
								name={icons}
								size={20}
								color={color.black}
							/>
						}
					/>
				</View>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	gradient: {
		height: 144,
		width: 101,
		alignItems: "center",
		borderRadius: 4,
		marginLeft: 8,
	},
	profileImg: {
		marginTop: 8,
		width: 85,
		height: 111,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: "#ffffff",
	},
	name: {
		textAlign: "center",
		width: 85,
		color: color.white,
		zIndex: 1,
		position: "absolute",
		bottom: 45,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	btnView: {
		width: 85,
		justifyContent: "space-around",
		flexDirection: "row",
	},
	btn: {
		backgroundColor: color.white,
		height: 34,
		width: 34,
		borderRadius: 50,
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
		marginTop: -18,
	},
	icon: {
		tintColor: "black",
		width: 15,
		height: 17,
	},
});

export default AddFriendItem;
