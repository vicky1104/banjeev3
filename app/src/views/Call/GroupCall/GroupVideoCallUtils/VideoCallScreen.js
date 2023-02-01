import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "native-base";
import React, { useContext } from "react";
import {
	Dimensions,
	Image,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { RtcLocalView, RtcRemoteView } from "react-native-agora";

import { MainContext } from "../../../../../context/MainContext";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
import SocketContext from "../../../../Context/Socket";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import CallContext from "../Context";
import Members from "./Members";

function VideoCallScreen(props) {
	const { userObject: paramsUserObj, handleActionbar } = props;

	const membersRBSheet = React.useRef(null);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;

	const socket = React.useContext(SocketContext);

	const remoteUid = React.useContext(CallContext)?.remoteUid || [];
	const remoteAudio = React.useContext(CallContext)?.remoteAudio || [];
	const remoteAudioVolume =
		React.useContext(CallContext)?.remoteAudioVolume || [];
	const remoteVideo = React.useContext(CallContext)?.remoteVideo || [];
	const localVideo = React.useContext(CallContext)?.localVideo;
	const members = React.useContext(CallContext)?.members || [];
	const raiseHand = React.useContext(CallContext)?.raiseHand || [];
	const emoji = React.useContext(CallContext)?.emoji || [];
	const feedback = React.useContext(CallContext)?.feedback || [];

	const userObject =
		React.useContext(CallContext)?.callData?.userObject || paramsUserObj;

	const systemUserId =
		React.useContext(AppContext)?.profile?.systemUserId || userObject?.id;
	const firstName =
		React.useContext(AppContext)?.profile?.firstName || userObject?.firstName;
	const lastName =
		React.useContext(AppContext)?.profile?.lastName || userObject?.lastName;
	const mobile =
		React.useContext(AppContext)?.profile?.mobile || userObject?.mobile;

	const removeFromEvent = (payload) => {};

	const getUid = (mobileNum) => {
		if (mobileNum) {
			if (mobileNum.length > 7) {
				let reverseMobile = mobileNum?.split("").reverse();
				let newMobile = reverseMobile.slice(0, 7);
				return parseInt(newMobile.reverse().join(""));
			} else {
				return parseInt(mobileNum);
			}
		}
	};
	const renderComp = () => {
		if (remoteUid && remoteUid?.length > 5) {
			return (
				<TouchableWithoutFeedback onPress={handleActionbar}>
					<ScrollView
						style={{
							width: Dimensions.get("screen").width,
							// backgroundColor: color?.white,
						}}
						onPress={handleActionbar}
					>
						<View
							style={{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "row",
							}}
						>
							<View
								style={{
									height: 140,
									width: Dimensions.get("screen").width / 3,
									marginTop: 5,
									paddingHorizontal: 5,
								}}
							>
								<View
									style={{
										height: "100%",
										width: "100%",
									}}
								>
									{localVideo ? (
										<RtcLocalView.SurfaceView
											style={{ height: "100%", width: "100%", borderRadius: 8 }}
										/>
									) : (
										<View
											style={{
												display: "flex",
												flexDirection: "column",
												height: "85%",
												width: "100%",
												alignItems: "center",
												justifyContent: "space-between",
												marginTop: "17%",
											}}
										>
											<Image
												source={{
													uri: listProfileUrl(systemUserId),
												}}
												style={{
													height: 80,
													width: 80,
													borderRadius: 50,
												}}
											/>
											<Text color={color?.black}>{`${firstName} ${lastName} (You)`}</Text>
										</View>
									)}
								</View>
							</View>
							{remoteUid &&
								remoteUid?.length > 0 &&
								remoteUid?.map((value, index) => {
									return (
										<View
											key={index}
											style={{
												height: 140,
												width: Dimensions.get("screen").width / 3,
												marginTop: 5,
												paddingHorizontal: 5,
											}}
										>
											<View
												style={{
													height: "100%",
													width: "100%",
												}}
											>
												<View style={{ height: "100%", width: "100%", borderRadius: 8 }}>
													{/* <View
														style={{
															position: "absolute",
															width: "100%",
															height: "100%",
															zIndex: 5,
														}}
													>
														<View
															style={{
																height: "100%",
																width: "100%",
																display: "flex",
																alignItems: "center",
																justifyContent: "flex-end",
															}}
														>
															{groupActionState && groupActionState[value] && (
																<Text>
																	{groupActionState &&
																	groupActionState[value] &&
																	groupActionState[value].name
																		? groupActionState[value].name
																		: ""}
																</Text>
															)}
														</View>
													</View> */}
													{/* <View
														style={{
															position: "absolute",
															width: "100%",
															height: "100%",
															zIndex: 5,
														}}
													>
														<View
															style={{
																height: "100%",
																width: "100%",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
															}}
														>
															{groupActionState &&
																groupActionState[value] &&
																groupActionState[value].emoji &&
																emojiTimer && (
																	<Image
																		source={{
																			uri:
																				"http://media1.giphy.com/media/" +
																				groupActionState[value].emoji +
																				"/giphy.gif",
																		}}
																		style={{ height: 60, width: 60 }}
																	/>
																)}
														</View>
													</View> */}

													<View
														style={{
															position: "absolute",
															width: "100%",
															height: "15%",
															zIndex: 1,
															top: 5,
															paddingHorizontal: 3,
														}}
													>
														<View
															style={{
																width: "100%",
																display: "flex",
																flexDirection: "row",
																justifyContent: "space-between",
															}}
														>
															<View>
																{remoteAudio?.filter((ele) => ele === value)?.length > 0 ? (
																	<MaterialCommunityIcons
																		size={22}
																		color={color?.black}
																		name="microphone-off"
																	/>
																) : remoteAudioVolume?.filter((ele) => ele?.uid === value)
																		?.length > 0 &&
																  remoteAudioVolume?.filter((ele) => ele?.uid === value)?.[0]
																		?.volume > 5 ? (
																	<MaterialCommunityIcons
																		size={22}
																		color={"yellow"}
																		name="microphone"
																	/>
																) : (
																	<MaterialCommunityIcons
																		size={22}
																		color={color?.black}
																		name="microphone"
																	/>
																)}
															</View>
															<View>
																{raiseHand?.filter((ele) => ele?.uid === value)?.length > 0 && (
																	<Image
																		source={{
																			uri: "https://gateway.banjee.org//services/media-service/iwantcdn/resources/61e7d352374f282c5b4caba9?actionCode=ACTION_DOWNLOAD_RESOURCE",
																		}}
																		style={{
																			height: 20,
																			width: 20,
																		}}
																	/>
																)}
															</View>
														</View>
													</View>

													{remoteVideo?.filter((ele) => ele === value)?.length > 0 ? (
														<View
															style={{
																display: "flex",
																flexDirection: "column",
																height: "80%",
																width: "100%",
																alignItems: "center",
																marginTop: "20%",
															}}
														>
															<Image
																source={{
																	uri: listProfileUrl(
																		members?.filter((ele) => getUid(ele.mobile) === value)?.[0]
																			?.id
																	),
																}}
																style={{
																	height: "82%",
																	width: "82%",
																	borderRadius: 50,
																}}
															/>
															<Text
																color="#FFF"
																numberOfLines={1}
															>
																{members?.filter((ele) => getUid(ele.mobile) === value)?.[0]
																	?.firstName +
																	" " +
																	members?.filter((ele) => getUid(ele.mobile) === value)?.[0]
																		?.lastName}
															</Text>
														</View>
													) : (
														<View style={{ position: "relative" }}>
															{emoji?.filter((ele) => ele?.uid === value)?.length > 0 && (
																<View
																	style={{
																		position: "absolute",
																		top: 0,
																		left: 0,
																		flexDirection: "column",
																		justifyContent: "center",
																		alignItems: "center",
																		width: "100%",
																		height: "100%",
																		zIndex: 500,
																	}}
																>
																	<Image
																		source={{
																			uri: `http://media1.giphy.com/media/${
																				emoji?.filter((ele) => ele?.uid === value)?.[0]?.src
																			}/giphy.gif`,
																		}}
																		style={{
																			height: 50,
																			width: 50,
																		}}
																	/>
																</View>
															)}
															<View
																style={{
																	width: "100%",
																	position: "absolute",
																	bottom: 0,
																	left: 0,
																	zIndex: 510,
																}}
															>
																<Text
																	color={color?.black}
																	textAlign="center"
																>
																	{members?.filter((ele) => getUid(ele.mobile) === value)?.[0]
																		?.firstName +
																		" " +
																		members?.filter((ele) => getUid(ele.mobile) === value)?.[0]
																			?.lastName}
																</Text>
															</View>
															<RtcRemoteView.SurfaceView
																style={{ height: "100%", width: "100%" }}
																uid={value}
																zOrderMediaOverlay={true}
															/>
														</View>
													)}
												</View>
											</View>
										</View>
									);
								})}
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			);
		} else {
			return (
				<TouchableWithoutFeedback onPress={handleActionbar}>
					<View
						style={{
							flex: 1,
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
						}}
					>
						<View
							style={{
								height:
									remoteUid?.length === 0
										? "100%"
										: remoteUid?.length < 4
										? "50%"
										: "33.33%",
								width:
									remoteUid?.length < 3
										? "100%"
										: remoteUid?.length === 4
										? "100%"
										: "50%",
							}}
						>
							{localVideo ? (
								<RtcLocalView.SurfaceView
									style={{ height: "100%", width: "100%", borderRadius: 8 }}
								/>
							) : (
								<View
									style={{
										height: "100%",
										width: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										position: "relative",
									}}
								>
									<View
										style={{
											height:
												remoteUid?.length === 1 ? "75%" : remoteUid?.length < 6 ? 150 : 80,
											width:
												remoteUid?.length === 1 ? "75%" : remoteUid?.length < 6 ? 150 : 80,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
										}}
									>
										<Image
											source={{
												uri: listProfileUrl(systemUserId),
											}}
											resizeMode="contain"
											style={{
												height: "90%",
												width: "90%",
												borderRadius: 10,
												marginBottom: 7,
											}}
										/>
										<Text
											color={color?.black}
											fontSize={
												remoteUid?.length === 1 ? 18 : remoteUid?.length === 2 ? 16 : 14
											}
										>
											{firstName + " " + lastName + " (You)"}
										</Text>
									</View>
								</View>
							)}
						</View>
						{remoteUid !== undefined &&
							remoteUid &&
							remoteUid?.length > 0 &&
							remoteUid?.map((value, index) => {
								return (
									<View
										style={{
											position: "relative",
											height: remoteUid?.length > 3 ? "33.33%" : "50%",
											width: remoteUid?.length === 1 ? "100%" : "50%",
										}}
									>
										<View
											style={{
												position: "absolute",
												width: "100%",
												height: "15%",
												zIndex: 1,
												top: 5,
												paddingHorizontal: 5,
												paddingTop: 3,
											}}
										>
											<View
												style={{
													width: "100%",
													display: "flex",
													flexDirection: "row",
													justifyContent: "space-between",
												}}
											>
												<View>
													{remoteAudio?.filter((ele) => ele === value)?.length > 0 ? (
														<MaterialCommunityIcons
															size={
																remoteUid?.length === 1 ? 35 : remoteUid?.length < 4 ? 30 : 23
															}
															color={color?.black}
															name="microphone-off"
														/>
													) : remoteAudioVolume?.filter((ele) => ele?.uid === value)
															?.length > 0 &&
													  remoteAudioVolume?.filter((ele) => ele?.uid === value)?.[0]
															?.volume > 5 ? (
														<MaterialCommunityIcons
															size={
																remoteUid?.length === 1 ? 35 : remoteUid?.length < 4 ? 30 : 23
															}
															color={"yellow"}
															name="microphone"
														/>
													) : (
														<MaterialCommunityIcons
															size={
																remoteUid?.length === 1 ? 35 : remoteUid?.length < 4 ? 30 : 23
															}
															color={color?.black}
															name="microphone"
														/>
													)}
												</View>
												<View>
													{raiseHand?.filter((ele) => ele?.uid === value)?.length > 0 && (
														<Image
															source={{
																uri: "https://gateway.banjee.org//services/media-service/iwantcdn/resources/61e7d352374f282c5b4caba9?actionCode=ACTION_DOWNLOAD_RESOURCE",
															}}
															style={{
																height:
																	remoteUid?.length === 1 ? 40 : remoteUid?.length < 4 ? 30 : 20,
																width:
																	remoteUid?.length === 1 ? 40 : remoteUid?.length < 4 ? 30 : 20,
															}}
														/>
													)}
												</View>
											</View>
										</View>
										{remoteVideo?.filter((ele) => ele === value)?.length > 0 ? (
											<View
												style={{
													height: "100%",
													width: "100%",
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
													alignItems: "center",
													position: "relative",
												}}
											>
												{emoji?.filter((ele) => getUid(ele?.mobile) === value)?.length >
													0 && (
													<View
														style={{
															position: "absolute",
															top: 0,
															left: 0,
															flexDirection: "column",
															justifyContent: "center",
															alignItems: "center",
															width: "100%",
															height: "100%",
															zIndex: 500,
														}}
													>
														<Image
															source={{
																uri: `http://media1.giphy.com/media/${
																	emoji?.filter((ele) => getUid(ele?.mobile) === value)?.[0]?.src
																}/giphy.gif`,
															}}
															style={{
																height: remoteUid?.length > 5 ? 50 : 100,
																width: remoteUid?.length > 5 ? 50 : 100,
															}}
														/>
													</View>
												)}
												<View
													style={{
														height:
															remoteUid?.length === 1
																? "75%"
																: remoteUid?.length < 6
																? 150
																: 80,
														width:
															remoteUid?.length === 1
																? "75%"
																: remoteUid?.length < 6
																? 150
																: 80,
														display: "flex",
														flexDirection: "column",
														alignItems: "center",
													}}
												>
													<Image
														source={{
															uri: listProfileUrl(
																members?.filter((ele) => getUid(ele?.mobile) === value)?.[0]?.id
															),
														}}
														resizeMode="contain"
														style={{
															height: "90%",
															width: "90%",
															borderRadius: 10,
															marginBottom: 7,
														}}
													/>
													<Text
														color={color?.black}
														fontSize={
															remoteUid?.length === 1 ? 18 : remoteUid?.length === 2 ? 16 : 14
														}
													>
														{members?.filter((ele) => getUid(ele?.mobile) === value)?.[0]
															?.firstName +
															" " +
															members?.filter((ele) => getUid(ele?.mobile) === value)?.[0]
																?.lastName}
													</Text>
												</View>
											</View>
										) : (
											<View
												style={{ position: "relative", height: "100%", width: "100%" }}
											>
												{emoji?.filter((ele) => getUid(ele?.mobile) === value)?.length >
													0 && (
													<View
														style={{
															position: "absolute",
															top: 0,
															left: 0,
															flexDirection: "column",
															justifyContent: "center",
															alignItems: "center",
															width: "100%",
															height: "100%",
															zIndex: 500,
														}}
													>
														<Image
															source={{
																uri: `http://media1.giphy.com/media/${
																	emoji?.filter((ele) => getUid(ele?.mobile) === value)?.[0]?.src
																}/giphy.gif`,
															}}
															style={{
																height: remoteUid?.length > 5 ? 50 : 100,
																width: remoteUid?.length > 5 ? 50 : 100,
															}}
														/>
													</View>
												)}
												<View
													style={{
														position: "absolute",
														bottom: 10,
														left: 0,
														// width: "100%",
														zIndex: 510,
														width: "100%",
														flexDirection: "row",
														justifyContent: "center",
													}}
												>
													<Text
														style={{
															color: "#FFF",
															paddingHorizontal: 10,
															paddingVertical: 2,
															borderRadius: 5,
															// backgroundColor: "rgba(0,0,0,0.5)",
														}}
														letterSpacing={0.5}
														fontSize={16}
														fontWeight="medium"
													>
														{`${
															members?.filter((ele) => getUid(ele?.mobile) === value)?.[0]
																?.firstName || ""
														} ${
															members?.filter((ele) => getUid(ele?.mobile) === value)?.[0]
																?.lastName || ""
														}`}
													</Text>
												</View>
												<RtcRemoteView.SurfaceView
													style={{ height: "100%", width: "100%" }}
													uid={value}
													zOrderMediaOverlay={true}
												/>
											</View>
										)}
									</View>
								);
							})}
					</View>
				</TouchableWithoutFeedback>
			);
		}
	};

	if (_rtcEngine) return <React.Fragment>{renderComp()}</React.Fragment>;

	return null;

	// if (_rtcEngine) {
	// 	return (
	// 		<View
	// 			style={{
	// 				display: "flex",
	// 				flexWrap: "wrap",
	// 				flexDirection: "row",
	// 				width: "100%",
	// 				backgroundColor: color?.gradientWhite,
	// 			}}
	// 		>
	// 			<View
	// 				style={{
	// 					height: 140,
	// 					width: "33.33%",
	// 					marginTop: 10,
	// 					paddingHorizontal: 5,
	// 				}}
	// 			>
	// 				<View
	// 					style={{
	// 						height: "100%",
	// 						width: "100%",
	// 						borderWidth: 1,
	// 						borderColor: color?.border,
	// 						borderRadius: 8,
	// 						padding: 6,
	// 					}}
	// 				>
	// 					{localVideo ? (
	// 						<RtcLocalView.SurfaceView
	// 							style={{ height: "100%", width: "100%", borderRadius: 8 }}
	// 						/>
	// 					) : (
	// 						<View
	// 							style={{
	// 								display: "flex",
	// 								flexDirection: "column",
	// 								height: "85%",
	// 								width: "100%",
	// 								alignItems: "center",
	// 								justifyContent: "space-between",
	// 								marginTop: "17%",
	// 							}}
	// 						>
	// 							<Image
	// 								source={{
	// 									uri: listProfileUrl(systemUserId),
	// 								}}
	// 								style={{
	// 									height: 80,
	// 									width: 80,
	// 									borderRadius: 50,
	// 								}}
	// 							/>
	// 							<Text color={color?.black}>{`${firstName} ${lastName}`}</Text>
	// 						</View>
	// 					)}
	// 				</View>
	// 			</View>

	// 			{remoteUid !== undefined &&
	// 				remoteUid &&
	// 				remoteUid?.length > 0 &&
	// 				remoteUid?.map((value, index) => {
	// 					return (
	// 						<View
	// 							key={index}
	// 							style={{
	// 								height: 140,
	// 								width: "33.33%",
	// 								marginTop: 10,
	// 								paddingHorizontal: 5,
	// 							}}
	// 						>
	// 							<View
	// 								style={{
	// 									height: "100%",
	// 									width: "100%",
	// 									borderWidth: 1,
	// 									borderColor: color?.border,
	// 									borderRadius: 8,
	// 									padding: 6,
	// 								}}
	// 							>
	// 								<View style={{ height: "100%", width: "100%", borderRadius: 8 }}>
	// 									<View
	// 										style={{
	// 											position: "absolute",
	// 											width: "100%",
	// 											height: "100%",
	// 											zIndex: 5,
	// 										}}
	// 									>
	// 										<View
	// 											style={{
	// 												height: "100%",
	// 												width: "100%",
	// 												display: "flex",
	// 												alignItems: "center",
	// 												justifyContent: "flex-end",
	// 											}}
	// 										>
	// 											{groupActionState && groupActionState[value] && (
	// 												<Text>
	// 													{groupActionState &&
	// 													groupActionState[value] &&
	// 													groupActionState[value].name
	// 														? groupActionState[value].name
	// 														: ""}
	// 												</Text>
	// 											)}
	// 										</View>
	// 									</View>
	// 									<View
	// 										style={{
	// 											position: "absolute",
	// 											width: "100%",
	// 											height: "100%",
	// 											zIndex: 5,
	// 										}}
	// 									>
	// 										<View
	// 											style={{
	// 												height: "100%",
	// 												width: "100%",
	// 												display: "flex",
	// 												justifyContent: "center",
	// 												alignItems: "center",
	// 											}}
	// 										>
	// 											{groupActionState &&
	// 												groupActionState[value] &&
	// 												groupActionState[value].emoji &&
	// 												emojiTimer && (
	// 													<Image
	// 														source={{
	// 															uri:
	// 																"http://media1.giphy.com/media/" +
	// 																groupActionState[value].emoji +
	// 																"/giphy.gif",
	// 														}}
	// 														style={{ height: 60, width: 60 }}
	// 													/>
	// 												)}
	// 										</View>
	// 									</View>

	// 									<View
	// 										style={{
	// 											position: "absolute",
	// 											width: "100%",
	// 											height: "15%",
	// 											zIndex: 1,
	// 											top: 5,
	// 											paddingHorizontal: 3,
	// 										}}
	// 									>
	// 										<View
	// 											style={{
	// 												width: "100%",
	// 												display: "flex",
	// 												flexDirection: "row",
	// 												justifyContent: "space-between",
	// 											}}
	// 										>
	// 											<View>
	// 												{remoteAudio?.filter((ele) => ele === value)?.length > 0 ? (
	// 													<MaterialCommunityIcons
	// 														size={22}
	// 														color={color?.black}
	// 														name="microphone-off"
	// 													/>
	// 												) : (
	// 													<MaterialCommunityIcons
	// 														size={22}
	// 														color={color?.black}
	// 														name="microphone"
	// 													/>
	// 												)}
	// 											</View>
	// 											<View>
	// 												{raiseHand?.filter((ele) => ele?.uid === value)?.length > 0 && (
	// 													<Image
	// 														source={{
	// 															uri: "https://gateway.banjee.org//services/media-service/iwantcdn/resources/61e7d352374f282c5b4caba9?actionCode=ACTION_DOWNLOAD_RESOURCE",
	// 														}}
	// 														style={{
	// 															height: 20,
	// 															width: 20,
	// 														}}
	// 													/>
	// 												)}
	// 											</View>
	// 										</View>
	// 									</View>

	// 									{remoteVideo?.filter((ele) => ele === value)?.length > 0 ? (
	// 										<View
	// 											style={{
	// 												display: "flex",
	// 												flexDirection: "column",
	// 												height: "80%",
	// 												width: "100%",
	// 												alignItems: "center",
	// 												marginTop: "20%",
	// 											}}
	// 										>
	// 											<Image
	// 												source={{
	// 													uri: listProfileUrl(
	// 														members?.filter((ele) => ele?.uid === value)?.[0]?.id
	// 													),
	// 												}}
	// 												style={{
	// 													height: "82%",
	// 													width: "82%",
	// 													borderRadius: 50,
	// 												}}
	// 											/>
	// 											<Text color={color?.black}>
	// 												{members?.filter((ele) => ele?.uid === value)?.[0]?.firstName +
	// 													" " +
	// 													members?.filter((ele) => ele?.uid === value)?.[0]?.lastName}
	// 											</Text>
	// 										</View>
	// 									) : (
	// 										<View style={{ position: "relative" }}>
	// 											{emoji?.filter((ele) => ele?.uid === value)?.length > 0 && (
	// 												<View
	// 													style={{
	// 														position: "absolute",
	// 														top: 0,
	// 														left: 0,
	// 														flexDirection: "column",
	// 														justifyContent: "center",
	// 														alignItems: "center",
	// 														width: "100%",
	// 														height: "100%",
	// 														zIndex: 500,
	// 													}}
	// 												>
	// 													<Image
	// 														source={{
	// 															uri: `http://media1.giphy.com/media/${
	// 																emoji?.filter((ele) => ele?.uid === value)?.[0]?.src
	// 															}/giphy.gif`,
	// 														}}
	// 														style={{
	// 															height: 50,
	// 															width: 50,
	// 														}}
	// 													/>
	// 												</View>
	// 											)}
	// 											<RtcRemoteView.SurfaceView
	// 												style={{ height: "100%", width: "100%" }}
	// 												uid={value}
	// 												zOrderMediaOverlay={true}
	// 											/>
	// 										</View>
	// 									)}
	// 								</View>
	// 							</View>
	// 						</View>
	// 					);
	// 				})}
	// 		</View>
	// 	);
	// } else {
	// 	return null;
	// }
}

export default VideoCallScreen;
