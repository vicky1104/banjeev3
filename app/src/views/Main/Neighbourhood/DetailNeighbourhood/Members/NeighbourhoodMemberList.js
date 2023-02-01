import { useNavigation, useRoute } from "@react-navigation/native";

import { Text } from "native-base";

import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";

import { Dimensions, Platform, TextInput, VirtualizedList } from "react-native";
import { StyleSheet, View } from "react-native";
import { showToast } from "../../../../../constants/components/ShowToast";
import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import {
	assignAdminService,
	NeighbourhoodMemberListService,
} from "../../../../../helper/services/ListNeighbourhoodMember";
import DetailMembers from "./DetailMembers";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../../../../../Context/AppContext";
import ConfirmModal from "../../../../Others/ConfirmModal";
import { quitNHService } from "../../../../../helper/services/ListOurNeighbourhood";
import color from "../../../../../constants/env/color";
import ContactSkeleton from "../../../../../constants/components/ui-component/Skeleton/ContactSkeleton";

function NeighbourhoodMemberList(props) {
	const { params } = useRoute();

	const { setOptions, navigate } = useNavigation();

	const { profile } = useContext(AppContext);

	const [members, setMembers] = useState([]);
	const [mPage, setmPage] = useState(0);
	const [loader, setLoader] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [hasData, setHasData] = useState(true);
	const [visible, setVisible] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [noDataMsg, setNoDataMsg] = useState(
		"No members in this neighbourhood..!"
	);
	const [removeMember, setRemoveMember] = useState();
	// const [newAdminData, setNewAdminData] = useState();

	const makeAdminFunc = (userId, cloudId) => {
		console.warn(".............................assign");
		assignAdminService({
			userId: userId,
			cloudId: cloudId,
		})
			.then((res) => {
				setMembers([]);
				setmPage(0);
				setMembersApi();
				console.warn(res, "admin response");
			})
			.catch((err) => {
				showToast("Only 3 admins are allowed.");
				console.warn(err);
			});
	};

	const setMembersApi = useCallback(async () => {
		setLoader(true);
		// params?.groupMembers is searchmembers from DetailGroup page
		// It searches members of group/community

		const res = await NeighbourhoodMemberListService({
			cloudId: params?.cloudId,
			keywords: searchText,
			page: searchText.length > 0 ? 0 : mPage,
			pageSize: 15,
		});
		setRefresh(false);
		setVisible(false);

		if (res?.content?.length > 0) {
			let adminIds = res.content.filter((ele) => ele?.role === "ADMIN");

			console.warn(
				res.content.filter((ele) => ele.userId === profile.systemUserId)
			);

			const a = res.content.map((ele) => ({
				...ele,
				adminIds: adminIds.map((ele) => ele.userId),
			}));

			setMembers((pre) => [...pre, ...a]);
			setHasData(true);
			setLoader(false);
		} else {
			setHasData(false);
			setLoader(false);
			setNoDataMsg("Searched member not found in this neighbourhood.");
		}
	}, [mPage, params, searchText, profile]);
	useEffect(() => {
		setMembersApi();
	}, [setMembersApi]);

	useLayoutEffect(() => {
		setOptions({
			headerTitle: `${params?.cloudName}'s Members`,
			headerTintColor: color?.black,
		});
	}, [color, params]);

	const renderItem = useCallback(
		({ item, index }) => (
			<DetailMembers
				item={item}
				setRemoveMember={setRemoveMember}
				makeAdminFunc={makeAdminFunc}
			/>
		),
		[makeAdminFunc]
	);
	// useEffect(() => {
	// 	if (mPage > 0) {
	// 		setMembersApi();
	// 	}
	// }, [mPage, setMembersApi]);

	// ============================================================

	const handleSearch = (text) => {
		setMembers([]);
		setmPage(0);
		setSearchText(text);
	};

	const handleCancelSearch = () => {
		setMembers([]);
		setmPage(0);
		setSearchText("");
	};

	const header = (
		<View style={styles.inputView}>
			<TextInput
				value={searchText}
				style={[
					styles.input,
					{
						borderColor: color?.border,
						backgroundColor: color?.lightWhite,
						color: color?.black,
						// borderWidth: 0.3,
					},
				]}
				placeholder="Search Members..."
				onChangeText={handleSearch}
				placeholderTextColor={color?.grey}
			/>

			{searchText?.length > 0 && (
				<AppFabButton
					size={12}
					style={styles.cancelBtn}
					icon={
						<MaterialIcons
							name="close"
							size={12}
							color="#FFF"
						/>
					}
					onPress={handleCancelSearch}
				/>
			)}
		</View>
	);

	function removeMemberFunc() {
		quitNHService({
			cloudId: removeMember.cloudId,
			userId: removeMember.userId,
		})
			.then((res) => {
				console.warn(res);
				setMembers(members.filter((ele) => ele.userId !== removeMember.userId));
				showToast("Member removed from group.");
				setRemoveMember(false);
			})
			.catch((err) => console.warn(err));
	}

	return (
		<View style={{ height: "100%", width: "100%" }}>
			{visible ? (
				<ContactSkeleton />
			) : (
				<Fragment>
					{header}
					<VirtualizedList
						style={{ zIndex: 999 }}
						data={members}
						alwaysBounceVertical={true}
						bounces={true}
						bouncesZoom={true}
						renderItem={renderItem}
						keyExtractor={(data) => Math.random()}
						getItemCount={(data) => data?.length}
						getItem={(data, index) => data[index]}
						showsVerticalScrollIndicator={false}
						removeClippedSubviews={true}
						// initialNumToRender={15}
						onEndReached={() => {
							if (searchText?.length === 0) {
								if (hasData) {
									setmPage((prev) => prev + 1);
								} else {
									showToast("You have reached to the end of the list");
								}
							}
						}}
						onEndReachedThreshold={0.1}
						scrollEventThrottle={150}
						refreshing={refresh}
						onRefresh={() => {
							if (mPage === 0) {
								setRefresh(true);
								setMembers([]);
								setMembersApi();
							} else {
								setRefresh(true);
								setMembers([]);
								setmPage(0);
							}
						}}
						ListFooterComponent={() => (
							<>
								<AppLoading visible={loader} />
								<View style={{ height: 50 }} />
							</>
						)}
						ListEmptyComponent={() => {
							return (
								!refresh && (
									<View style={styles.empty}>
										<Text
											fontSize={16}
											color={color?.black}
										>
											{noDataMsg}
										</Text>
									</View>
								)
							);
						}}
					/>

					{/* {params?.member === 1 && ( */}
					<Text
						style={{
							marginTop: 10,
							marginBottom: Platform.OS === "ios" ? 20 : 0,
							color: color.black,
							borderWidth: 1,
							paddingHorizontal: 20,
							paddingVertical: 10,
							borderColor: color.border,
							borderRadius: 8,
							// width: "50%",
							alignSelf: "center",
						}}
						onPress={() =>
							navigate("PhoneBook", {
								neighbourhood: { name: params?.cloudName, id: params?.cloudId },
							})
						}
					>
						+ {"  "}Invite neighbours
					</Text>
					{/* )} */}
				</Fragment>
			)}

			{removeMember && (
				<ConfirmModal
					setModalVisible={() => {
						setRemoveMember(false);
					}}
					btnLabel={"Remove"}
					message={"Are you sure,\n you want to remove member"}
					onPress={removeMemberFunc}
				/>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	contentContainerStyle: {
		padding: 16,
		backgroundColor: "#F3F4F9",
	},
	header: {
		alignItems: "center",
		backgroundColor: "#F3F4F9",

		paddingVertical: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHandle: {
		width: 40,
		height: 2,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 4,
	},
	item: {
		padding: 20,
		justifyContent: "center",
		backgroundColor: "white",
		alignItems: "center",
		marginVertical: 10,
	},
	input: {
		height: 40,
		fontSize: 14,
		width: "100%",
		borderRadius: 8,
		padding: 10,
		// borderWidth: 1,
		// borderColor: color.grey,
	},
	inputView: {
		width: "98%",
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		marginVertical: 10,
	},
	cancelBtn: {
		top: 8,
		right: 8,
		backgroundColor: "rgba(0,0,0, 0.5)",
		borderRadius: 50,
		position: "absolute",
		zIndex: 1,
	},
	empty: {
		height: Dimensions.get("screen").height - 300,
		width: Dimensions.get("screen").width,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default NeighbourhoodMemberList;
