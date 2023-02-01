import {
	useFocusEffect,
	useIsFocused,
	useNavigation,
} from "@react-navigation/native";
import { IconButton, Text } from "native-base";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	Linking,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	VirtualizedList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import { AppContext } from "../../../Context/AppContext";
import SocketContext from "../../../Context/Socket";
import {
	CreateRoomService,
	GetAllRooms,
} from "../../../helper/services/RoomServices";
import BanjeeContacts from "./BanjeeContacts";
import { Ionicons, Entypo } from "@expo/vector-icons";
import color from "../../../constants/env/color";
import { findBanjeeContacts } from "../../../helper/services/FindContacts";
import DetailMembers from "../Neighbourhood/DetailNeighbourhood/Members/DetailMembers";
import { NeighbourhoodMemberListService } from "../../../helper/services/ListNeighbourhoodMember";
import ListProfileCard from "./ListProfileCard";
import usePermission from "../../../utils/hooks/usePermission";
import ContactSkeleton from "../../../constants/components/ui-component/Skeleton/ContactSkeleton";
import { useInfiniteQuery } from "react-query";
import { useRefreshOnFocus } from "../../../utils/hooks/useRefreshOnFocus";

export default function Contacts(props) {
	const { setOptions, navigate } = useNavigation();
	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const ourProfile = React.useContext(AppContext)?.profile || "";
	const cloudId = React.useContext(AppContext)?.neighbourhood?.cloudId || "";
	const { profile, setUnreadMessage, setUserUnreadMsg } = useContext(AppContext);
	const [text, setText] = useState("");
	const { socket } = React.useContext(SocketContext);
	const isFocused = useIsFocused();
	const [searchedBanjeeData, setSearchedBanjeeData] = useState([]);
	const {
		isLoading,
		refetch,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(
		"contacts",
		async ({ pageParam = 0 }) => {
			let x = await GetAllRooms({
				page: pageParam,
				pageSize: 10,
			});
			return x;
		},
		{
			getNextPageParam: (_lastPage, pages) => {
				if (pages?.[pages?.length - 1]?.last === false) {
					return pages?.[pages?.length - 1]?.number + 1;
				} else {
					return undefined;
				}
			},
		}
	);
	useRefreshOnFocus(refetch);
	useEffect(() => {
		setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 50,
						marginRight: 15,
					}}
					onPress={() => navigate("SearchBanjee")}
				>
					<MaterialIcons
						name="add"
						size={24}
						color="#FFF"
					/>
				</TouchableOpacity>
			),
		});

		return () => {};
	}, []);

	useEffect(() => {
		socket &&
			socket?.addEventListener("message", (mData) => {
				const { action, data: messageData } = JSON.parse(mData.data);
				switch (action) {
					case "CHAT_MESSAGE":
					case "GROUP_CHAT_MESSAGE":
						if (isFocused) {
							// setData((pre) => [
							// 	...pre.filter((ele) => ele?.roomId === messageData.roomId),
							// 	...pre.filter((ele) => ele?.roomId !== messageData.roomId),
							// ]);
							refetch();
						}
						break;
					default:
						break;
				}
			});
		return () => {};
	}, [socket, profile, isFocused]);

	const gotoChat = (profile) => {
		CreateRoomService({
			userA: {
				avtarImageUrl: ourProfile?.avtarUrl,
				domain: ourProfile?.domain,
				email: ourProfile?.email,
				externalReferenceId: ourProfile?.systemUserId,
				firstName: ourProfile?.firstName,
				id: ourProfile?.systemUserId,
				lastName: ourProfile?.lastName,
				mcc: ourProfile?.mcc,
				mobile: ourProfile?.mobile,
				profileImageUrl: ourProfile?.avtarUrl,
				userName: ourProfile?.username,
				userType: 0,
			},
			userB: profile,
		}).then((res) => {
			navigate("BanjeeUserChatScreen", {
				item: {
					...profile,
					avtarImageUrl: profile?.avtarUrl,
					cloudId: cloudId,
					userId: profile?.id || "",
					roomId: res.id,
					fromBanjeeProfile: true,
				},
			});
		});
	};

	const goToChatScreen = async (profile) => {
		// const cameraPer = await checkPermission("CAMERA");
		// const audioPer = await checkPermission("AUDIO");
		// const mediaPer = await checkPermission("MEDIA");
		// const storagePer = await checkPermission("STORAGE");

		// if (
		// 	cameraPer === "granted" &&
		// 	audioPer === "granted" &&
		// 	mediaPer === "granted" &&
		// 	storagePer === "granted"
		// ) {
		gotoChat(profile);
		// } else {
		// 	Linking.openSettings();
		// }
	};

	function renderItem({ item, index }) {
		let profileA = {
			avtarUrl: item?.avatarUrl || "",
			domain: item?.domain || "",
			email: item?.email || "",
			firstName: item?.firstName || "",
			id: item?.systemUserId || "",
			lastName: item?.lastName || "",
			locale: item?.locale || "",
			mcc: item?.mcc || "",
			mobile: item?.mobile || "",
			realm: item?.realm || "",
			ssid: item?.ssid || "",
			systemUserId: item?.systemUserId || "",
			timeZoneId: item?.timeZoneId || "",
			username: item?.username || item?.userName || "",
		};
		return text ? (
			<ListProfileCard
				onPress={() => goToChatScreen(profileA)}
				firstName={item?.firstName || ""}
				lastName={item?.lastName || ""}
				avatarImageUrl={item?.systemUserId || ""}
			/>
		) : (
			<BanjeeContacts
				item={item}
				index={index}
			/>
		);
	}
	const getFormatedData = (res) =>
		res
			?.map((item) => {
				if (item?.group) {
					return {
						...item,
						name: item?.name,
						group: item?.group,
						roomId: item?.id,
						key: Math.random(),
						userId: item.selfId,
						cloudId: item?.socialCloudId,
						imageUrl: item?.imageUrl,
						members: item?.members,
						unreadMessageCount: item?.unreadMessageCount,
					};
				} else {
					return item?.members
						?.map((ele) =>
							profile?.systemUserId !== ele.selfId
								? {
										...ele.self,
										name: item?.name,
										group: item?.group,
										roomId: item?.id,
										key: Math.random(),
										userId: ele.selfId,
										online: ele?.online,
										lastSeenOn: ele?.lastSeenOn,
										unreadMessageCount: item?.unreadMessageCount,
								  }
								: null
						)
						.filter((ele) => ele);
				}
			})
			.flat();

	const onRefresh = async () => {
		await refetch();
	};
	const onEndReached = () => {
		if (hasNextPage) {
			fetchNextPage();
		}
	};

	const searchBanjeeFunc = (data) => {
		findBanjeeContacts({
			deleted: "false",
			keywords: data,
			page: 0,
			pageSize: 20,
		})
			.then((res) => {
				if (res && res?.content?.length > 0) {
					setSearchedBanjeeData(
						res.content.map((ele) => ({ ...ele, key: Math.random() }))
					);
				} else {
					setSearchedBanjeeData([]);
				}
			})
			.catch((err) => console.warn(err));
	};

	const searchBanjee = (data) => {
		setText(data);
		searchBanjeeFunc(data);
	};

	const emptyComonent = () => (
		<View
			style={{
				display: "flex",
				flex: 1,
				width: "100%",
				height: Dimensions.get("screen").height - 150,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{isLoading ? (
				<View style={{ marginTop: -20 }}>
					<ContactSkeleton showBorder={true} />
				</View>
			) : (
				<>
					<Image
						style={{ height: 300, width: 300 }}
						resizeMode="contain"
						source={require("../../../../assets/chatnotfound.png")}
					/>
					<Text style={{ color: color?.black, fontWeight: "bold" }}>
						Connect with other neighbourhoods.
					</Text>
				</>
			)}
		</View>
	);
	const footerComponent = () => (
		<>
			<AppLoading visible={isLoading || isFetchingNextPage} />
			<View style={{ height: 95 }} />
		</>
	);
	return (
		<View
			style={{
				flex: 1,

				paddingTop: 5,
				// paddingHorizontal: 5,
				backgroundColor: color?.white,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					height: 50,
					width: "100%",
					position: "relative",
				}}
			>
				<Ionicons
					name="ios-search-sharp"
					size={22}
					color={"lightgrey"}
					style={{
						position: "absolute",
						zIndex: 1,
						left: 10,
					}}
				/>

				<TextInput
					value={text}
					style={[
						styles.input,
						{
							borderColor: color?.grey,
							backgroundColor: color?.gradientWhite,
							color: color?.black,
						},
					]}
					placeholderTextColor={color?.grey}
					placeholder="Search keyword"
					onChangeText={searchBanjee}
				/>

				{text?.length > 0 && (
					<Entypo
						size={20}
						name="cross"
						color={color?.black}
						onPress={() => setText("")}
						style={{
							position: "absolute",
							zIndex: 1,
							right: 10,
						}}
					/>
				)}
			</View>

			<VirtualizedList
				getItemCount={(data) => (data?.length > 0 ? data?.length : 0)}
				getItem={(data, index) => data[index]}
				showsVerticalScrollIndicator={false}
				data={
					text.length > 1
						? searchedBanjeeData
						: getFormatedData(data?.pages?.map((ele) => ele.content).flat())
				}
				keyExtractor={(item) => item?.key}
				renderItem={renderItem}
				refreshing={isLoading}
				onRefresh={onRefresh}
				onEndReachedThreshold={0.01}
				initialNumToRender={10}
				removeClippedSubviews={true}
				scrollEventThrottle={150}
				onEndReached={onEndReached}
				ListEmptyComponent={
					text.length > 2
						? () => (
								<View
									style={{
										flex: 1,
										justifyContent: "center",
										alignItems: "center",
										height: Dimensions.get("screen").height - 150,
									}}
								>
									<Text color={color?.black}>No searched banjee found...!</Text>
								</View>
						  )
						: emptyComonent()
				}
				ListFooterComponent={text.length > 2 ? () => null : footerComponent}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: { flex: 1 },
	seperate: {
		height: 1,
		width: "82%",
		backgroundColor: "lightgrey",
		justifyContent: "flex-start",
		position: "absolute",
		right: 0,
		bottom: 0,
	},
	input: {
		height: 40,
		width: "100%",
		borderRadius: 8,
		paddingLeft: 40,
		backgroundColor: "white",
		// borderWidth: 1,
		borderColor: color.grey,
		marginBottom: 5,
	},
});
