import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useRef } from "react";
import {
	View,
	Image,
	StyleSheet,
	ImageBackground,
	VirtualizedList,
	Animated,
} from "react-native";
import FastImage from "react-native-fast-image";
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import color from "../../../constants/env/color";
import { deletePost } from "../../../helper/services/DeletePost";
import { MyPostFeed } from "../../../helper/services/MyPostService";
import {
	checkGender,
	profileUrl,
} from "../../../utils/util-func/constantExport";
import ConfirmModal from "../../Others/ConfirmModal";
import SettingBottomSheet from "./SettingBottomSheet";
import FeedProfile from "../../Main/Feed/FeedSkeleton/FeedProfile";
import FeedContent from "../../Main/Feed/FeedSkeleton/FeedContent";
import FeedFooter from "../../Main/Feed/FeedSkeleton/FeedFooter";
import FeedHeader from "../../Main/Feed/FeedSkeleton/FeedHeader";
import { AppContext } from "../../../Context/AppContext";
import { MainContext } from "../../../../context/MainContext";
function Profile(props) {
	const { avtarUrl, systemUserId, gender, name } =
		useContext(AppContext)?.profile;

	const { navigate, setOptions } = useNavigation();
	const [open, setOpen] = React.useState(false); //for setting bottom sheet
	const [refresh, setRefresh] = React.useState(false);
	const [data, setData] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [deleteAccountModal, setDeleteAccountModal] = React.useState(false);
	const [deletePostModal, setDeletePostModal] = React.useState(false);
	const [imageError, setImageError] = React.useState();
	const { setOpenPostModal, setModalData } = React.useContext(MainContext);

	// const scrollY = new Animated.Value(0);
	// const diffClamp = Animated.diffClamp(scrollY, 0, 505);
	// const translateY = diffClamp.interpolate({
	// 	inputRange: [0, 505],
	// 	outputRange: [0, 505],
	// });

	const sheetRef = React.useRef(null);
	const [postId, setPostId] = React.useState();

	const arr = [
		// {
		//   label: "Edit Status",
		//   icon: require("../../../assets/EditDrawerIcon/ic_contact.png"),
		// },
		{
			label: "Edit Info",
			icon: require("../../../../assets/EditDrawerIcon/ic_contact.png"),
			onPress: () => navigate("UpdateDetail"),
		},
		{
			label: "Edit Intro",
			icon: require("../../../../assets/EditDrawerIcon/ic_mic.png"),
			onPress: () => navigate("UpdateVoice"),
		},
		{
			label: "Settings",
			icon: require("../../../../assets/EditDrawerIcon/ic_setting_style.png"),
			onPress: () => {
				setOpen(true), sheetRef?.current?.open();
			},
		},
	];

	const myFeed = React.useCallback(() => {
		const payload = {
			author: null,
			authorId: null,
			createdOn: null,
			deleted: null,
			geoLocation: null,
			id: null,
			locationId: null,
			mediaContent: null,
			mediaRootDirectoryId: null,
			otherUserId: null,
			page: page,
			pageId: null,
			pageName: null,
			pageSize: 15,
			percentage: 0,
			reactions: null,
			reactionsCount: null,
			recentComments: null,
			text: null,
			totalComments: null,
			totalReactions: null,
			visibility: null,
		};
		MyPostFeed(payload)
			.then((res) => {
				setRefresh(false);
				// console.warn("page", page);

				if (res && res.content.length > 0) {
					setData((prev) => [...prev, ...res.content]);
				} else {
					// console.warn("End of list");
				}
			})
			.catch((err) => console.log("errorrr", err));
	}, [page]);

	React.useEffect(() => {
		setOptions({
			headerRight: () => (
				<AppFabButton
					size={22}
					onPress={() => navigate("UpdateAvatar")}
					icon={
						<FastImage
							source={require("../../../../assets/EditDrawerIcon/ic_edit_profile.png")}
							style={{ tintColor: color.white, height: 20, width: 22 }}
						/>
					}
				/>
			),
			headerLeft: () => (
				<Text
					fontSize={20}
					style={{ marginLeft: 10, color: color.white, fontWeight: "500" }}
				>
					My Profile
				</Text>
			),
		});

		myFeed();
	}, [myFeed]);

	async function deletePostFx() {
		await deletePost(postId);
		setDeletePostModal(false);
		myFeed();
	}

	function renderItem({ item }) {
		return (
			<View
				style={styles.mainView}
				key={item.id}
			>
				<View style={styles.grid}>
					<FeedProfile
						item={item}
						clearModalData={() => setModalData()}
						handleClosePostModal={() => setOpenPostModal(false)}
					/>
					<View style={styles.profileHeader}>
						<FeedHeader
							item={item}
							setDeletePostModal={setDeletePostModal}
							setPostId={setPostId}
						/>
					</View>
				</View>
				<FeedContent item={item} />
				<FeedFooter item={item} />
			</View>
		);
	}

	const header = (
		<View style={styles.header}>
			<Text style={{ marginLeft: 10, color: color.white, fontWeight: "500" }}>
				{name}
			</Text>

			{/* `````````````````````````` EDIT PROFILE IMAGE */}

			<AppFabButton
				size={22}
				onPress={() => navigate("UpdateAvatar")}
				icon={
					<FastImage
						source={require("../../../../assets/EditDrawerIcon/ic_edit_profile.png")}
						style={{ tintColor: color.white, height: 20, width: 22 }}
					/>
				}
			/>
		</View>
	);

	const profile = (
		<Animated.View>
			{/* <Animated.View style={{ transform: [translateY] }}> */}
			<Image
				loadingIndicatorSource={require("../../../../assets/EditDrawerIcon/neutral_placeholder.png")}
				onError={({ nativeEvent: { error } }) => {
					setImageError(error);
				}}
				source={imageError ? checkGender(gender) : { uri: profileUrl(avtarUrl) }}
				style={{ width: "100%", height: 360, marginBottom: 65 }}
			/>

			{/* ```````````````````````````````````` BLACK BOX */}

			<ImageBackground
				source={require("../../../../assets/EditDrawerIcon/rectangle.png")}
				style={{
					height: 145,
					// height: 191-46,
					width: "100%",
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					marginTop: -68,
					justifyContent: "space-evenly",
				}}
			>
				<Text
					style={{
						fontSize: 20,
						color: color.white,
						alignSelf: "center",
						// marginTop: 25,
					}}
				>
					{name}
				</Text>

				{/* ``````````````````````` ICONS  */}

				<View style={styles.iconView}>
					{arr.map((ele, i) => (
						<View
							key={i}
							style={{ alignItems: "center" }}
						>
							<AppFabButton
								onPress={() => ele.onPress()}
								size={22}
								icon={
									<View style={styles.icon}>
										<FastImage
											source={ele.icon}
											style={{ height: 24, width: 24 }}
										/>
									</View>
								}
							/>
							<Text style={styles.iconLabel}>{ele.label}</Text>
						</View>
					))}
				</View>
			</ImageBackground>

			{/* ````````````BOTTOM SHEET  */}

			{open && (
				<SettingBottomSheet
					refRBSheet={sheetRef}
					setOpen={setOpen}
					setDeleteAccountModal={setDeleteAccountModal}
				/>
			)}
		</Animated.View>
	);

	const ListEmptyComponent = (
		<Text style={{ alignSelf: "center", marginTop: 120 }}>
			You have not posted any post yet...!
		</Text>
	);
	return (
		<React.Fragment>
			<View style={styles.container}>
				{/* {header} */}
				<VirtualizedList
					ListHeaderComponent={() => profile}
					data={data.map((ele) => ({ ...ele, key: Math.random() }))}
					renderItem={renderItem}
					keyExtractor={(data) => data.key}
					getItemCount={(data) => data.length}
					getItem={(data, index) => data[index]}
					showsVerticalScrollIndicator={false}
					onRefresh={() => {
						setPage(0), setRefresh(true), myFeed();
					}}
					ListEmptyComponent={ListEmptyComponent}
					refreshing={refresh}
					// onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
					onEndReachedThreshold={0.1}
					onEndReached={() => setPage((prev) => prev + 1)}
					removeClippedSubviews={true}
					initialNumToRender={5}
				/>
			</View>

			{deletePostModal && (
				<ConfirmModal
					btnLabel={"Delete"}
					title="Are you sure, you want to delete your post?"
					onPress={deletePostFx}
					setModalVisible={setDeletePostModal}
					message={"Delete Post"}
				/>
			)}

			{deleteAccountModal && (
				<ConfirmModal
					btnLabel={"Delete"}
					title="Are you sure, you want to delete your account?"
					onPress={() => console.warn("delete account")}
					setModalVisible={setDeleteAccountModal}
					message={"Delete Account"}
				/>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	header: {
		height: 56,
		width: "100%",
		position: "absolute",
		top: 0,
		zIndex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	container: { flex: 1, position: "relative" },
	iconView: {
		flexDirection: "row",
		justifyContent: "space-between",
		// marginTop: 20,
		width: "70%",
		alignSelf: "center",
	},
	icon: {
		backgroundColor: "#33000000",
		height: 40,
		width: 40,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 0.5,
		borderColor: color.white,
	},
	iconLabel: { color: color.white, fontSize: 14, marginTop: 8 },
	tabView: {
		height: 46,

		// width: "96%",
		alignSelf: "center",
		flexDirection: "row",
		// backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "space-between",
	},
	textView: {
		zIndex: 9999999,
		justifyContent: "center",
		height: "100%",
		width: "48%",
		// borderTopLeftRadius: 10,
		// borderTopRightRadius: 10,
		borderLeftWidth: 0.5,
		borderRightWidth: 0.5,
		borderTopWidth: 0.5,
	},
	tab: {
		textAlign: "center",
		height: "100%",
		fontSize: 14,
		paddingTop: 15,
	},
	grid: {
		paddingLeft: "5%",
		width: "100%",
		flexDirection: "row",
		height: 56,
		alignItems: "center",
	},
	profileHeader: {
		flexDirection: "row",
		height: "100%",
		width: "87%",
		borderBottomColor: color.greyText,
		justifyContent: "space-between",
		marginLeft: 20,
	},
	mainView: {
		width: "100%",
		alignSelf: "flex-end",
		marginBottom: 17,
		backgroundColor: "white",
		paddingBottom: 15,
	},
});

export default Profile;
