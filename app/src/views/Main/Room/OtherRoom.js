import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useContext } from "react";
import {
	View,
	StyleSheet,
	VirtualizedList,
	Animated,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import AppButton from "../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { categoryService } from "../../../helper/services/CategoryService";
import { listOtherRoom } from "../../../helper/services/CreateRoomService";

import RoomElement from "./RoomComponents/RoomElement";

function OtherRoom(props) {
	const { navigate } = useNavigation();

	const { profile } = useContext(AppContext);
	const [myRoom, setMyRoom] = React.useState([]);
	const [refresh, setRefresh] = React.useState(false);
	const [page, setPage] = React.useState(0);

	const scrollY = new Animated.Value(0);
	const diffClamp = Animated.diffClamp(scrollY, 0, 110);
	const [category, setCategory] = React.useState([]);
	const [roomType, setRoomType] = React.useState(null);
	const [index, setIndex] = React.useState(0);
	const [visible, setVisible] = React.useState(true);
	const translateY = diffClamp.interpolate({
		inputRange: [0, 110],
		outputRange: [0, 110],
	});

	const diffClamp2 = Animated.diffClamp(scrollY, -70, 0);

	const translateYHeader = diffClamp2.interpolate({
		inputRange: [-70, 0],
		outputRange: [-70, 0],
	});

	const opacity = diffClamp2.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0],
	});

	const getAllRoom = React.useCallback(() => {
		if (page === 0) {
			setRefresh(true);
		}
		let data = {
			allCanAddBanjees: false,
			allCanReact: false,
			allCanSpeak: false,
			allCanSwitchVideo: false,
			allUseVoiceFilters: false,
			category: null,
			categoryId: roomType,
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
			page: roomType ? 0 : page,
			pageSize: 15,
		};

		listOtherRoom(data)
			.then((res) => {
				setVisible(false);
				setRefresh(false);
				if (roomType) {
					//id of main categoryprofile?.
					setMyRoom([]);
					setMyRoom(res.content);
				} else {
					setMyRoom((prev) => [...prev, ...res.content]);
				}
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [roomType, profile, page]);

	const listAllCategory = useCallback(() => {
		categoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
		})
			.then((res) => {
				getAllRoom();
				let x = res.content.map((ele) => {
					return { name: ele.name, id: ele.id };
				});
				setCategory([{ name: "All", id: null }, ...x]);
			})
			.catch((err) => console.warn(err));
	}, [getAllRoom]);

	React.useEffect(() => {
		listAllCategory();
	}, [listAllCategory]);

	function renderItem({ item }) {
		return <RoomElement item={item} />;
	}

	return (
		<View style={styles.container}>
			{visible && <AppLoading visible={visible} />}
			{myRoom === null ? (
				<View
					style={{
						alignItems: "center",
						width: "100%",
						height: "87.5%",
						justifyContent: "center",
						paddingBottom: 55, //``````````````````````
					}}
				>
					<Text fontSize={24}>Hey There!!</Text>
					<FastImage
						source={require("../../../../assets/EditDrawerIcon/dummy_delete_user.png")}
						style={{ height: 120, width: 120, marginTop: 20, marginBottom: 10 }}
					/>

					<Text>There are no any Rooms Yet!!</Text>
					<Text style={{ textAlign: "center", width: "80%", marginTop: 10 }}>
						Be the first on to Create Rooms
					</Text>
				</View>
			) : (
				<View style={{ position: "relative", marginBottom: 40 }}>
					<View style={[styles.category]}>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						>
							{category.length > 0 &&
								category.map((ele, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => {
											setIndex(i);
											setRoomType(ele?.id);
										}}
									>
										<View
											style={{
												height: 40,
												padding: 10,
												borderRadius: 20,
												borderWidth: 1,
												marginRight: 8,
												borderColor: index === i ? color.black : color.primary,
												backgroundColor: index === i ? color.line : "transparent",
											}}
										>
											<Text
												color={index === i ? color.black : color.primary}
												onPress={() => {
													setIndex(i);
													setRoomType(ele?.id);
												}}
											>
												{ele.name}
											</Text>
										</View>
									</TouchableOpacity>
								))}
						</ScrollView>
					</View>

					<VirtualizedList
						getItemCount={(myRoom) => myRoom.length}
						getItem={(data, index) => data[index]}
						showsVerticalScrollIndicator={false}
						refreshing={refresh}
						onRefresh={() => getAllRoom()}
						style={{ paddingTop: 2 }}
						data={myRoom}
						keyExtractor={(item) => item.id}
						renderItem={renderItem}
						onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
						onEndReachedThreshold={1}
						onEndReached={() => setPage((prev) => prev + 1)}
						removeClippedSubviews={true}
						initialNumToRender={5}
					/>
				</View>
			)}
			<View
				style={{
					width: 150,
					alignSelf: "center",
					position: "absolute",
					bottom: 70,
					height: 40,
				}}
			>
				<Animated.View
					style={{ transform: [{ translateY: translateY }], opacity: opacity }}
				>
					<AppButton
						onPress={() => {
							navigate("CreateRoom");
						}}
						title={"Create My Room"}
					/>
				</Animated.View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		height: "100%",
		width: "100%",
		paddingBottom: 60,
		backgroundColor: color.white,
	},
	category: {
		paddingLeft: "3%",
		flexDirection: "row",
		justifyContent: "flex-start",
		width: "100%",
		alignItems: "center",
		height: 50,
		flexWrap: "nowrap",
		backgroundColor: color.white,
		// position: "absolute",
		zIndex: 1,
	},
	cardView: {
		height: 150,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		borderColor: color.black,
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: color.white,
	},
});

export default OtherRoom;
