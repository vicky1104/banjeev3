import React, { useContext } from "react";
import {
	TouchableHighlight,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	VirtualizedList,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import { Avatar, Text } from "native-base";
// import { useDispatch, useSelector } from "react-redux";
import { FriendRequest } from "../../../../helper/services/FriendRequest";
import { showToast } from "../../../../redux/store/action/toastAction";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import usePlayPauseAudio from "../../../../utils/hooks/usePlayPauseAudio";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import { getProfile } from "../../../../redux/store/action/Profile/userPendingConnection";
import { AppContext } from "../../../../Context/AppContext";

function OtherBanjee(props) {
	const { item } = props;
	const { navigate } = useNavigation();
	const iconSize = 18;
	const { icons, playAudio } = usePlayPauseAudio(item?.voiceIntroSrc);
	// const dispatch = useDispatch();

	const { profile } = useContext(AppContext);

	let x = item?.map((ele) => {
		return {
			systemUserId: ele.userId,
			name: ele.name,
			username: ele.name,
			avtarUrl: ele.avtarUrl,
			email: "",
			id: ele.userId,
			mobile: ele.mobile,
		};
	});

	// console.warn("data", ...x?.avtarUrl);

	const saveIntro = async () => {
		console.log("item", JSON.stringify(item, null, 2));

		const toUser = {
			avtarUrl: x[0].avtarUrl,
			domain: "208991",
			email: x[0].email,
			firstName: x[0]?.name,
			id: x[0]?.systemUserId,
			lastName: item?.lastName,
			locale: "eng",
			mcc: item?.mcc,
			mobile: x[0]?.mobile,
			realm: "banjee",
			ssid: null,
			systemUserId: x[0]?.systemUserId,
			timeZoneId: "GMT",
			username: x[0]?.name,
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
			defaultReceiver: toUser.systemUserId,
			domain: "banjee",
			fromUser: {
				...profile,
				id: profile?.systemUserId,
				firstName: profile?.username,
			},
			fromUserId: profile?.systemUserId,
			message: `from ${profile?.username} to ${x[0]?.username}`,
			processedOn: null,
			rejected: null,
			toUser: toUser,
			toUserId: x[0].systemUserId,
			voiceIntroSrc: "",
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
				alert("Friend Request Sent Successfully");
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	function renderItem({ item }) {
		return (
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: "white",
				}}
			>
				<View style={{ width: "18%" }}>
					<TouchableWithoutFeedback
						style={{ zIndex: 999999 }}
						onPress={() => {
							// dispatch(getProfile({ profileId: item.userId }));
							navigate("BanjeeProfile");
						}}
					>
						<View style={styles.imgView}>
							<Avatar
								borderColor={color?.border}
								borderWidth={1}
								bgColor={color.gradientWhite}
								style={styles.img}
								source={{ uri: profileUrl(item?.avtarUrl) }}
							>
								{item?.name?.charAt(0).toUpperCase()}
								{/* <FastImage source={checkGender(item.gender)} style={styles.img} /> */}
							</Avatar>

							{/* ````````````````````````` ACTIVE STATUS OF USER */}
						</View>
					</TouchableWithoutFeedback>
				</View>

				<TouchableWithoutFeedback activeOpacity={1}>
					<View
						style={{
							height: 72,
							width: "82%",
						}}
					>
						<View style={styles.container}>
							<View style={styles.txtView}>
								<Text numberOfLines={1}>{item.name}</Text>
							</View>

							<View style={styles.icons}>
								<AppFabButton
									onPress={() => {
										// setUserAudio(user.voiceIntroSrc);
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
							</View>
						</View>

						{/*````````````````````` ITEM SEPERATOR */}

						<View style={styles.border} />
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
	return (
		<VirtualizedList
			showsVerticalScrollIndicator={false}
			getItemCount={(item) => item.length}
			getItem={(item, index) => item[index]}
			data={item}
			keyExtractor={() => Math.random()}
			renderItem={renderItem}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		zIndex: -2,
	},
	img: {
		// borderColor: color.primary,
		// borderWidth: 1,
		height: "100%",
		width: "100%",
		borderRadius: 20,
	},
	icons: {
		position: "absolute",
		right: 0,
		justifyContent: "space-between",
		flexDirection: "row",
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
	imgView: {
		position: "relative",
		elevation: 10,
		height: 40,
		width: 40,
		borderRadius: 20,
		marginLeft: 16,
		shadowColor: color.black,
		shadowOffset: { width: 2, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		zIndex: 99,
	},
	border: {
		height: 1,
		position: "absolute",
		right: 0,
		bottom: 0,
		width: "100%",
		borderBottomColor: "lightgrey",
		borderBottomWidth: 1,
	},
	txtView: {
		flexDirection: "column",
		width: "49%",
	},
	iconImg: { height: 18, width: 18 },
});

export default OtherBanjee;
