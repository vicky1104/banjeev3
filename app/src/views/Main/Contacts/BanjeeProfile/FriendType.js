import { Text } from "native-base";
import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FastImage from "react-native-fast-image";
import color from "../../../../constants/env/color";
import { useSelector } from "react-redux";
import { FriendRequest } from "../../../../helper/services/FriendRequest";
import { showToast } from "../../../../redux/store/action/toastAction";
import { otherBanjee_service } from "../../../../helper/services/OtherBanjee";
import usePlayPauseAudio from "../../../../utils/hooks/usePlayPauseAudio";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

function FriendType({
	ourProfile,
	setUnfriendModal,
	setReportModal,
	setBlockModal,
	setAcceptFrndReq,
	setRejectFrndReq,
}) {
	const { mutualFriend, pendingId, showReqestedFriend, profileId } = useSelector(
		(state) => state.viewProfile
	);

	const { systemUserId, currentUser, voiceIntroSrc, ...userData } = useSelector(
		(state) => state.registry
	);
	const { navigate, goBack } = useNavigation();

	const { playAudio, icons } = usePlayPauseAudio(ourProfile?.voiceIntroSrc);

	const saveIntro = async () => {
		// console.log("===============>", userItem);
		const toUser = {
			avtarUrl: ourProfile.avtarUrl,
			domain: "208991",
			email: ourProfile?.user?.email,
			firstName: ourProfile?.user?.firstName,
			id: ourProfile?.systemUserId,
			lastName: ourProfile?.user?.lastName,
			locale: "eng",
			mcc: ourProfile?.user?.mcc,
			mobile: ourProfile?.user?.mobile,
			realm: "banjee",
			ssid: null,
			systemUserId: ourProfile.systemUserId,
			timeZoneId: "GMT",
			username: ourProfile?.name,
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

		// console.log("payload ---> ", JSON.stringify(payload, null, 2));
		delete payload.fromUser.authorities;

		FriendRequest(payload)
			.then(async (res) => {
				let notificationRingtone = require("../../../../../assets/ringtones/sendFriendRequestTone.mp3");

				let { sound } = await Audio.Sound.createAsync(notificationRingtone);
				console.log("playing sound");

				await sound.playAsync();
				console.log("audio played");
				dispatch(
					showToast({
						open: true,
						description: "Friend Request Sent Successfully",
					})
				);
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const searchBanjee = React.useCallback(
		(userId, type) => {
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
							avtarUrl: ele.connectedUser.avtarUrl,
							birthDate: ele.connectedUser.birthDate,
							chatroomId: ele.chatroomId,
							connectedUserOnline: ele.connectedUserOnline,
							email: ele.connectedUser.email,
							firstName: ele.connectedUser.firstName,
							gender: ele.connectedUser.gender,
							id: ele.connectedUser.id,
							mobile: ele.connectedUser.mobile,
							name: null,
							realm: null,
							ssid: null,
							systemUserId: null,
							timeZoneId: null,
							userId: ele.userId,
							userLastSeen: ele.cuserLastSeen,
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
		},
		[systemUserId]
	);
	const frndReqData = [
		{
			label: "Intro",
			onPress: () => playAudio(),
		},
		{
			img: require("../../../../../assets/EditDrawerIcon/ic_delivered.png"),
			label: "Accept",
			onPress: () => setAcceptFrndReq(true),
			tintColor: "white",
		},
		{
			img: require("../../../../../assets/EditDrawerIcon/wrong.png"),
			label: "Reject",
			onPress: () => setRejectFrndReq(true),
			tintColor: "white",
		},
	];

	const data = [
		{
			label: "Intro",
			onPress: () => playAudio(),
		},
		{
			img: require("../../../../../assets/EditDrawerIcon/ic_video_call_white.png"),
			label: "Video",
			onPress: () => searchBanjee(profileId, "video"),
		},
		{
			img: require("../../../../../assets/EditDrawerIcon/ic_call.png"),
			label: "Call",
			onPress: () => searchBanjee(profileId, "voice"),
		},
		{
			img: require("../../../../../assets/EditDrawerIcon/ic_voice_record.png"),
			label: "Voice",
			onPress: () => searchBanjee(profileId, "chat"),
		},
	];

	const unMutual = [
		{
			label: "Intro",
			onPress: () => playAudio(),
		},
		{
			label:
				pendingId?.filter((ele) => ele === systemUserId).length > 0
					? "Request Sent"
					: "Connect",
			img: require("../../../../../assets/EditDrawerIcon/ic_add_contact.png"),
			tintColor:
				pendingId?.filter((ele) => ele === systemUserId).length > 0
					? "grey"
					: "white",
			borderColor:
				pendingId?.filter((ele) => ele === systemUserId).length > 0
					? "grey"
					: "white",
			onPress:
				pendingId?.filter((ele) => ele === systemUserId).length > 0
					? console.log("hiii")
					: saveIntro,
		},
	];

	const userType = () => {
		switch (true) {
			case showReqestedFriend:
				return frndReqData;
			case mutualFriend:
				return data;
			default:
				return unMutual;
		}
	};

	return (
		<ImageBackground
			source={require("../../../../../assets/EditDrawerIcon/rectangle.png")}
			style={styles.blackBox}
		>
			{/* ---------------------------- APPMENU */}

			<View
				style={{
					position: "absolute",
					right: 0,
					marginTop: 20,
				}}
			>
				<AppMenu
					menuColor={color.white}
					menuContent={
						mutualFriend
							? [
									// {
									// 	icon: "account-minus",
									// 	label: "Unfriend",
									// 	onPress: () => setUnfriendModal(true),
									// },
									// {
									// 	icon: "block-helper",
									// 	label: "Block User",
									// 	onPress: () => setBlockModal(true),
									// },
									{
										icon: "flag",
										label: "Report This User",
										onPress: () => setReportModal(true),
									},
							  ]
							: [
									// {
									// 	icon: "block-helper",
									// 	label: "Block User",
									// 	onPress: () => setBlockModal(true),
									// },
									{
										icon: "flag",
										label: "Report This User",
										onPress: () => setReportModal(true),
									},
							  ]
					}
				/>
			</View>

			<Text
				style={styles.name}
				numberOfLines={1}
			>
				{ourProfile?.name}
			</Text>

			<View style={styles.iconImg}>
				{userType().map((ele, i) => (
					<View
						key={i}
						style={{
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<AppFabButton
							onPress={() => ele.onPress()}
							size={22}
							icon={
								<View
									style={[
										styles.icon,
										{
											borderColor: ele?.borderColor ? "grey" : color.white,
										},
									]}
								>
									{i === 0 ? (
										<MaterialCommunityIcons
											name={icons}
											color={color.white}
											size={24}
										/>
									) : (
										<FastImage
											source={ele.img}
											style={{
												height: 24,
												width: 24,
												tintColor: ele?.tintColor,
											}}
										/>
									)}
								</View>
							}
						/>
						<Text style={styles.label}>{ele.label}</Text>
					</View>
				))}
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	name: {
		fontSize: 20,
		color: color.white,
		alignSelf: "center",
		textAlign: "center",
		marginTop: 25,
		width: "70%",
	},
	iconImg: {
		marginTop: 44,
		flexDirection: "row",
		justifyContent: "space-around",
		width: "80%",
		alignSelf: "center",
	},
	blackBox: {
		height: 170,
		width: "100%",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		marginTop: -68,
	},
	label: {
		fontSize: 14,
		color: color.white,
		marginTop: 5,
	},
	icon: {
		// backgroundColor: "rgba(0,0,0,0.2)",
		height: 40,
		width: 40,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 0.5,
	},
});

export default FriendType;
