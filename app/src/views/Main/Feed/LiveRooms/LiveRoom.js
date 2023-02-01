import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	Image,
	ScrollView,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, Text } from "native-base";
import { listOtherRoom } from "../../../../helper/services/CreateRoomService";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import usePlayPauseAudio from "../../../../utils/hooks/usePlayPauseAudio";
import color from "../../../../constants/env/color";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import { AppContext } from "../../../../Context/AppContext";
function LiveRoom(props) {
	const [data, setData] = React.useState([]);
	const { icons, playAudio, stopPlayer } = usePlayPauseAudio();
	const { profile } = useContext(AppContext);

	React.useEffect(() => {
		let data = {
			allCanAddBanjees: false,
			allCanReact: false,
			allCanSpeak: false,
			allCanSwitchVideo: false,
			allUseVoiceFilters: false,
			category: null,
			categoryId: null,
			categoryName: null,
			chatroomId: null,
			communityType: null,
			connectedUserIds: null,
			connectedUsers: null,
			connectionReq: null,
			content: null,
			createdOn: null,
			domain: null,
			group: false,
			groupName: null,
			id: null,
			imageCommunityUrl: null,
			imageContent: null,
			lastUpdatedBy: null,
			lastUpdatedOn: null,
			likes: 0,
			live: true,
			onlyAudioRoom: false,
			playing: false,
			recordSession: false,
			seekPermission: false,
			subCategoryId: null,
			subCategoryName: null,
			unreadMessages: 0,
			user: null,
			userId: profile?.systemUserId,
			userIds: null,
		};

		listOtherRoom(data)
			.then((res) => {
				setData(res.content);
				console.log(res.content);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, []);

	return (
		<View style={{ flex: 1, marginBottom: data.length > 0 ? 20 : 0 }}>
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				{data.map((ele, i) => {
					return (
						<Box
							shadow="1"
							key={i}
							style={[styles.imgBg, { marginRight: 8 }]}
						>
							<ImageBackground
								source={require("../../../../../assets/EditDrawerIcon/FeedRoomBg.png")}
								style={styles.imgBg}
							>
								<View style={styles.subview}>
									<View style={{ position: "relative" }}>
										<Image
											source={
												ele?.imageContent?.src
													? { uri: profileUrl(ele.imageContent.src) }
													: require("../../../../../assets/EditDrawerIcon/sample.png")
											}
											style={{ height: "100%", width: 111 }}
										/>
										<Text
											style={{
												position: "absolute",
												zIndex: 99,
												color: color.white,
												backgroundColor: "#eb0033",
												height: 19,
												width: 40,
												textAlign: "center",
												right: 0,
												top: 10,
											}}
										>
											Live
										</Text>
									</View>
									<View style={styles.menuView}>
										<AppMenu
											menuColor={color.black}
											menuContent={[
												{
													icon: "delete",
													onPress: () => console.warn("hello"),
													label: "Join room",
												},
											]}
										/>
									</View>

									<View style={styles.txtView}>
										<Text
											numberOfLines={1}
											style={styles.title}
										>
											{ele.groupName}
										</Text>

										<View style={styles.row}>
											<Image
												source={require("../../../../../assets/EditDrawerIcon/category.png")}
												style={styles.icon}
											/>

											<Text
												style={{ color: "#656565", fontWeight: "bold" }}
												numberOfLines={1}
											>
												{ele.categoryName}
											</Text>
										</View>

										<View style={{ flexDirection: "row" }}>
											<View style={styles.row}>
												<View style={[styles.audioIcon, { borderWidth: 1 }]}>
													<MaterialCommunityIcons
														name={icons}
														color={"#656565"}
														size={20}
														onPress={() => playAudio()}
													/>
												</View>
												<Text style={styles.intro}>Intro</Text>
											</View>

											<View style={styles.row}>
												<View style={styles.audioIcon}>
													{/* <MaterialCommunityIcons
                            name={icons}
                            color={"#656565"}
                            size={20}
                          /> */}

													<Image
														source={require("../../../../../assets/EditDrawerIcon/ic_community_group.png")}
														style={{ height: 24, width: 24 }}
													/>
												</View>
												<Text style={[styles.intro]}>
													{ele.connectedUsers.length} Members
												</Text>
											</View>
										</View>

										<AppButton
											title={"join Live"}
											style={{ width: 93 }}
										/>
									</View>
								</View>
							</ImageBackground>
						</Box>
					);
				})}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	imgBg: {
		height: 190,
		width: Dimensions.get("screen").width - 20,
		zIndex: 2,
	},
	subview: {
		height: "100%",
		flexDirection: "row",
		width: "100%",
	},
	menuView: {
		position: "absolute",
		right: 20,
		transform: [{ rotate: "90deg" }],
		marginTop: 15,
	},
	txtView: {
		paddingLeft: 16,
		paddingTop: 24,
		paddingRight: 11,
		paddingBottom: 12,
		height: "100%",
		width: "60%",
		justifyContent: "space-between",
		// borderWidth: 1,
	},
	title: {
		textAlign: "left",
		color: "#656565",
		fontWeight: "bold",
	},
	icon: {
		width: 24,
		height: 24,
		marginRight: 5,
		tintColor: "#656565",
	},
	audioIcon: {
		height: 23,
		width: 23,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		borderColor: "#656565",
	},
	intro: {
		color: "#656565",
		marginLeft: 5,
		marginRight: 15,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
});

export default LiveRoom;
