import { Avatar, Text } from "native-base";
import React from "react";
import {
	Alert,
	BackHandler,
	Dimensions,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { listProfileUrl } from "../../../utils/util-func/constantExport";
import { AppContext } from "../../../Context/AppContext";
import { MainContext } from "../../../../context/MainContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import usePermission from "../../../utils/hooks/usePermission";
import { CreateRoomService } from "../../../helper/services/RoomServices";
import color from "../../../constants/env/color";
import { findBanjeeContacts } from "../../../helper/services/FindContacts";
import { NeighbourhoodMemberListService } from "../../../helper/services/ListNeighbourhoodMember";
import ListProfileCard from "./ListProfileCard";
import AppButton from "../../../constants/components/ui-component/AppButton";

export default function SearchBanjee() {
	const { navigate, setOptions, replace } = useNavigation();

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const ourProfile = React.useContext(AppContext)?.profile || "";
	const cloudId = React.useContext(AppContext)?.neighbourhood?.cloudId || "";

	const [text, setText] = React.useState("");
	const [members, setMembers] = React.useState([]);
	const [notFound, setNotFound] = React.useState(false);

	const getNeighbourhoodMembersApiCall = React.useCallback(() => {
		setNotFound(false);
		NeighbourhoodMemberListService({
			cloudId: cloudId,
		})
			.then((res) => {
				setMembers(res?.content);
				// console.warn(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [cloudId]);

	const searchBanjeeFunc = React.useCallback(() => {
		// setMembers([]);
		if (text && text?.length > 0) {
			findBanjeeContacts({
				deleted: "false",
				keywords: text,
				page: 0,
				pageSize: 20,
			})
				.then((res) => {
					if (res && res?.content?.length > 0 && text?.length > 0) {
						// console.warn("res.content", res.content);
						setMembers(res.content);
						setNotFound(false);
					} else {
						setNotFound(true);
						setMembers([]);
					}
				})
				.catch((err) => {
					console.warn(err);
					setNotFound(false);
				});
		} else {
			getNeighbourhoodMembersApiCall();
		}
	}, [text, getNeighbourhoodMembersApiCall]);

	useFocusEffect(
		React.useCallback(() => {
			searchBanjeeFunc();
		}, [searchBanjeeFunc])
	);

	const searchBanjee = (data) => {
		setText(data);
	};

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
			userB: {
				avtarImageUrl: profile?.avtarUrl,
				domain: profile?.domain,
				email: profile?.email,
				firstName: profile?.firstName,
				id: profile?.id,
				lastName: profile?.lastName,
				mcc: profile?.mcc,
				mobile: profile?.mobile,
				profileImageUrl: profile?.avtarUrl,
				userName: profile?.username,
				userType: 0,
			},
		}).then((res) => {
			replace("BanjeeUserChatScreen", {
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
		// const writeStoragePer = await checkPermission("WRITE_STORAGE");
		// const storagePer = await checkPermission("STORAGE");

		// if (
		// 	cameraPer === "granted" &&
		// 	audioPer === "granted" &&
		// 	mediaPer === "granted" &&
		// 	// writeStoragePer === "granted" &&
		// 	storagePer === "granted"
		// ) {
		if (text && text?.length > 0) {
			gotoChat({
				...profile,
				id: profile?.systemUserId,
			});
		} else {
			gotoChat(profile);
		}
		// } else {
		// 	Linking.openSettings();
		// }
	};

	const renderComp = () => {
		if (notFound) {
			return (
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
			);
		} else {
			return (
				<ScrollView
					style={{
						width: "100%",
					}}
				>
					{members &&
						members?.length > 0 &&
						members.map((ele, index) => {
							if (ele?.profile?.id !== systemUserId) {
								return (
									<ListProfileCard
										onPress={() => goToChatScreen(ele?.profile || ele)}
										firstName={ele?.profile?.firstName || ele?.firstName || ""}
										lastName={ele?.profile?.lastName || ele?.lastName || ""}
										avatarImageUrl={
											ele.systemUserId ? ele?.systemUserId : ele?.profile?.id
										}
									/>
								);
							} else return null;
						})}
				</ScrollView>
			);
		}
	};

	return (
		<React.Fragment>
			<View style={styles.container}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						height: 50,
						width: "100%",
						position: "relative",
						marginVertical: 2,
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
								backgroundColor: color.gradientWhite,
								color: color?.black,
							},
						]}
						placeholderTextColor={color?.grey}
						placeholder="Search people"
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
				{renderComp()}
				<View
					style={{
						paddingBottom: Platform.OS === "ios" ? 10 : 0,
						backgroundColor: "grey",
					}}
				>
					<AppButton
						title={"Invite"}
						style={{ borderBottomWidth: 0 }}
						onPress={() => navigate("PhoneBook", { invite: true })}
					/>
				</View>
			</View>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: color.white },
	input: {
		height: 40,
		width: "100%",
		borderRadius: 8,
		paddingLeft: 40,
		backgroundColor: "white",
		// borderWidth: 1,
		borderColor: color.grey,
	},
});
