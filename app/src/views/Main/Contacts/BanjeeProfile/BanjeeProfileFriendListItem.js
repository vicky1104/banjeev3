import { useNavigation, useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";
import React, { useContext } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import * as Location from "expo-location";
import { Avatar, Text } from "native-base";
import { otherBanjee_service } from "../../../../helper/services/OtherBanjee";
import { FriendRequest } from "../../../../helper/services/FriendRequest";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import { showToast } from "../../../../redux/store/action/toastAction";
import usePlayPauseAudio from "../../../../utils/hooks/usePlayPauseAudio";
import { AppContext } from "../../../../Context/AppContext";

function BanjeeProfileFriendListItem({ item }) {
	const { navigate } = useNavigation();
	const iconSize = 18;
	const { icons, playAudio } = usePlayPauseAudio(userAudio);
	const [userAudio, setUserAudio] = React.useState();
	const [reqSent, setReqSent] = React.useState(false);

	const { systemUserId, currentUser, gender } = useContext(AppContext);

	const {
		params: { pendingId },
	} = useRoute();

	const mutualFriends = [
		{
			onPress: () => searchBanjee(item.systemUserId, "video"),
			img: require("../../../../../assets/EditDrawerIcon/ic_video_call.png"),
		},
		{
			onPress: () => searchBanjee(item.systemUserId, "voice"),
			img: require("../../../../../assets/EditDrawerIcon/ic_call_black.png"),
		},
		{
			onPress: () => searchBanjee(item.systemUserId, "chat"),
			// onPress: () => navigate("BanjeeUserChatScreen", { user: user }),
			img: require("../../../../../assets/EditDrawerIcon/ic_voice_black.png"),
		},
	];

	const searchBanjee = React.useCallback((userId, type) => {
		otherBanjee_service({
			blocked: "false",
			circleId: null,
			connectedUserId: null,
			fromUserId: systemUserId,
			id: null,
			keyword: null,
			page: 0,
			pageSize: 0,
			toUserId: userId,
			userId: null,
		})
			.then((res) => {
				res.content.map((ele) => {
					let x = {
						age: 0,
						avtarUrl: ele.user.avtarUrl,
						birthDate: ele.user.birthDate,
						chatroomId: ele.chatroomId,
						connectedUserOnline: ele.connectedUserOnline,

						email: ele.user.email,
						firstName: ele.user.firstName,
						gender: ele.user.gender,
						id: ele.user.id,

						mobile: ele.user.id,
						name: null,
						realm: null,
						ssid: null,
						systemUserId: null,
						timeZoneId: null,
						userId: ele.userId,
						userLastSeen: ele.userLastSeen,
						username: null,
					};
					switch (type) {
						case "video":
							navigate("MakeVideoCall", { ...x, callType: "Video" });
							break;
						case "voice":
							navigate("MakeVideoCall", { ...x, callType: "Voice" });
							break;
						case "chat":
							navigate("BanjeeUserChatScreen", { item: x });
							break;
					}
				});
			})
			.catch((err) => console.warn(err));
	}, []);

	const saveIntro = async () => {
		const toUser = {
			avtarUrl: item.avtarUrl,
			domain: null,
			email: item?.email,
			firstName: item?.name,
			id: item?.systemUserId,
			lastName: item?.lastName,
			locale: "eng",
			mcc: item?.mcc,
			mobile: item?.mobile,
			realm: "banjee",
			ssid: null,
			systemUserId: item?.systemUserId,
			timeZoneId: "GMT",
			username: item?.name,
		};
		let d = await Location.getCurrentPositionAsync();
		const { latitude, longitude } = d.coords;

		let payload = {
			accepted: false,
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
			defaultReceiver: toUser.systemUserId,
			domain: "banjee",
			fromUser: {
				...currentUser,
				id: systemUserId,
				firstName: currentUser.userName,
				avtarUrl: currentUser.avtarUrl,
				gender: gender,
			},
			fromUserId: systemUserId,
			message: `from ${currentUser.userName} to ${toUser.username}`,
			processedOn: null,
			rejected: null,
			toUser: toUser,
			toUserId: toUser.id,
			voiceIntroSrc: null,
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
				showToast("Friend Request Sent Successfully");
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	function checkConnection(type, item) {
		switch (type) {
			case "YOU":
				return (
					<View style={{ alignItems: "flex-end", width: "30%" }}>
						<Text>You</Text>
					</View>
				);

			case "MUTUAL":
				return (
					<View style={styles.iconView}>
						{mutualFriends.map((ele, i) => (
							<AppFabButton
								key={i}
								onPress={() => {
									ele.onPress();
								}}
								size={iconSize}
								icon={
									<FastImage
										source={ele.img}
										style={styles.iconImg}
									/>
								}
							/>
						))}
					</View>
				);

			case "UNKNOWN":
				let { systemUserId } = item;

				// console.warn(systemUserId);
				// console.warn(pendingId);

				return (
					<View style={styles.iconView}>
						<AppFabButton
							onPress={() => {
								setUserAudio(item.voiceIntroSrc);
								playAudio();
							}}
							size={iconSize}
							icon={
								<FastImage
									source={
										icons === "pause" && item.voiceIntroSrc === userAudio
											? require("../../../../../assets/EditDrawerIcon/ic_pause.png")
											: require("../../../../../assets/EditDrawerIcon/ic_play_round.png")
									}
									style={styles.iconImg}
								/>
							}
						/>

						{pendingId?.filter((ele) => ele === item.systemUserId).length > 0 ||
						reqSent ? (
							<AppFabButton
								size={iconSize}
								icon={
									<FastImage
										source={require("../../../../../assets/EditDrawerIcon/ic_add_friend_black.png")}
										style={[styles.iconImg, { tintColor: "grey" }]}
									/>
								}
							/>
						) : (
							<AppFabButton
								onPress={() => {
									saveIntro();
								}}
								size={iconSize}
								icon={
									<FastImage
										source={require("../../../../../assets/EditDrawerIcon/ic_add_friend_black.png")}
										style={styles.iconImg}
									/>
								}
							/>
						)}
					</View>
				);

			default:
				console.log("Default");
				break;
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.view}>
				<TouchableWithoutFeedback
					onPress={() => {
						if (item.type === "YOU") {
							if (pendingId?.filter((ele) => ele === systemUserId).length > 0) {
								// dispatch(pendingConnection({ pendingReq: true }));
							}

							return navigate("Profile");
						} else {
							{
								// dispatch(removeProfileData({}));
								// dispatch(getProfile({ profileId: item.systemUserId }));
								navigate("BanjeeProfile");
							}
						}
					}}
				>
					<View style={styles.subView}>
						{/* <FastImage
              onError={({ nativeEvent: { error } }) => {
                setImageError(error);
              }}
              source={
                imageError
                  ? checkGender(item.gender)
                  : { uri: listProfileUrl(item?.systemUserId) }
              }
              style={styles.img}
            /> */}

						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={styles.img}
							source={{ uri: profileUrl(item?.avtarUrl) }}
						>
							{item.name.charAt(0).toUpperCase()}
							{/* <FastImage source={checkGender(item.gender)} style={styles.img} /> */}
						</Avatar>
						{item.type === "YOU"
							? null
							: item.online && <View style={styles.status} />}
					</View>
				</TouchableWithoutFeedback>

				<Text
					numberOfLines={1}
					style={{ marginLeft: 15, width: "50%" }}
				>
					{item.name}
				</Text>
				{checkConnection(item.type, item)}
			</View>
			<View
				style={{
					height: 0.5,
					backgroundColor: "grey",
					marginLeft: 55,
					width: "100%",
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		height: 56,
		width: "100%",
		alignItems: "center",
		flexDirection: "row",
	},
	subView: {
		height: 40,
		width: 40,
		borderRadius: 50,
		position: "relative",
	},
	status: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: color.activeGreen,
		position: "absolute",
		bottom: 0,
		left: "10%",
		zIndex: 1,
	},
	img: {
		// borderColor: color.primary,
		// borderWidth: 1,
		height: 40,
		width: 40,
		borderRadius: 50,
	},

	iconImg: { height: 18, width: 18 },
	iconView: {
		position: "absolute",
		right: 0,
		flexDirection: "row",
	},
});

export default BanjeeProfileFriendListItem;
