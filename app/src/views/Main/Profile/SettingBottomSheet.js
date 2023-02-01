import { StackActions, useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	Alert,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import color from "../../../constants/env/color";
import {
	removeLocalStorage,
	removeMyDefaultNeighbourhood,
} from "../../../utils/Cache/TempStorage";
import { onShare } from "../../Other/ShareApp";
import { AppContext } from "../../../Context/AppContext";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import axios from "axios";
import SocketContext from "../../../Context/Socket";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SettingBottomSheet({ refRBSheet, setLogout }) {
	const { navigate, dispatch: navigationDispatch } = useNavigation();
	const [logoutLoader, setLogoutLoader] = useState(false);
	const {
		profile,
		setProfile,
		setUserData,
		setLocation,
		setNeighbourhood,
		setToken,
		setIsLoaded,
	} = useContext(AppContext);

	const { socket } = useContext(SocketContext);

	const logout = async () => {
		socket && socket.close();
		Promise.all([
			await removeLocalStorage("profile"),
			await removeLocalStorage("avtarUrl"),
			await removeMyDefaultNeighbourhood("neighbourhood"),
			await removeLocalStorage("token"),
			await axios.delete(
				`https://gateway.banjee.org/services/message-broker/api/fireBaseRegistry/deleteByUserId/${profile?.systemUserId}`
			),
		])
			.then((res) => {
				setProfile(null);
				setLocation(null);
				setIsLoaded(false);
				setNeighbourhood("loading");
				setUserData(null);
				setToken(null);

				// navigationDispatch(StackActions.replace("SignIn"));
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const drawerNavArr = [
		// {
		// 	type: "icon",
		// 	label: "Create Neighbourhood",
		// 	icon: require("../../../../assets/invite.png"),
		// 	nav: () => {
		// 		navigate("CreateNeighbourhood");
		// 		refRBSheet.current.close();
		// 	},
		// },

		{
			type: "icon",
			label: "Invite to Banjee",
			icon: require("../../../../assets/invite.png"),
			nav: () => onShare(),
		},
		{
			type: "icon",
			icon: require("../../../../assets/EditDrawerIcon/ic_edit_profile.png"),
			label: "Change Password",
			nav: () => {
				navigate("Otp", {
					mcc: profile?.mcc,
					username: profile?.mobile,
					isMobile: true,
					type: "RESET_PASSWORD",
					resetPass: true,
				});
				refRBSheet.current.close();
			},
		},
		// {
		// 	type: "material",
		// 	label: "My Neighborhood",
		// 	icon: "home-group",
		// 	nav: () => {
		// 		navigate("MyNeighbourhood");
		// 		refRBSheet.current.close();
		// 	},
		// },
		{
			type: "material",
			label: "My Business(s)",
			icon: "briefcase",
			nav: () => {
				navigate("ListBusiness");
				refRBSheet.current.close();
			},
		},
		{
			type: "fontawesome",
			label: "My Blogs",
			icon: "blog",
			nav: () => {
				navigate("MyBlogs", { userId: profile?.systemUserId });
				refRBSheet.current.close();
			},
		},
		{
			type: "icon",
			label: "Blocked Banjees",
			icon: require("../../../../assets/blocked.png"),
			nav: () => {
				navigate("Blocked_Banjee_Contacts");
				refRBSheet.current.close();
			},
		},
		{
			type: "icon",
			label: "Banjee FAQs",
			icon: require("../../../../assets/faqs.png"),
			nav: () => {
				refRBSheet.current.close();
				navigate("faq", { url: "https://www.banjee.org/faqs", label: "FAQ's" });
			},
		},
		{
			type: "icon",
			label: "Privacy Policy",
			icon: require("../../../../assets/EditDrawerIcon/ic_privacy.png"),
			nav: () => {
				refRBSheet.current.close();

				navigate("faq", {
					url: "https://www.banjee.org/privacypolicy",
					label: "Privacy Policy",
				});
			},
		},

		{
			type: "icon",
			label: "Logout",
			icon: require("../../../../assets/logout.png"),
			nav: () => {
				// logout();

				Alert.alert("You are logging out!", "Are you sure you want to logout?", [
					{
						text: "Cancel",
						onPress: () => console.log("Cancel Pressed"),
						style: "default",
					},
					{
						text: "Logout",
						style: "destructive",
						onPress: () => {
							setLogoutLoader(true);
							refRBSheet.current.close();
							logout();
						},
					},
				]);
			},
		},
		{
			type: "material",
			label: "Delete Account",
			icon: "delete",
			// icon: require("../../../../assets//EditDrawerIcon/chat_delete.png"),
			nav: () => {
				navigate("Otp", {
					mcc: profile?.mcc,
					username: profile?.mobile,
					isMobile: true,
					type: "DELETE_ACCOUNT",
					resetPass: true,
				});
				refRBSheet.current.close();

				// Alert.alert(
				// 	"You are deleting this account!",
				// 	"Are you sure you want to delete the account ?",
				// 	[
				// 		{
				// 			text: "Cancel",
				// 			onPress: () => console.log("Cancel Pressed"),
				// 			style: "default",
				// 		},
				// 		{
				// 			text: "Delete",
				// 			style: "destructive",
				// 			onPress: () => {
				// 				refRBSheet?.current.close();
				// 				console.warn("Delete Account");
				// 			},
				// 		},
				// 	]
				// );
			},
		},
	];

	const renderIcons = (ele) => {
		switch (ele.type) {
			case "material":
				return (
					<MaterialCommunityIcons
						// style={styles.img}
						name={ele.icon}
						size={20}
						color="white"
					/>
				);

			case "fontawesome":
				return (
					<FontAwesome5
						// style={styles.img}
						name={ele.icon}
						size={20}
						color="white"
					/>
				);

			default:
				return (
					<Image
						source={ele.icon}
						height={20}
						width={20}
						style={styles.img}
					/>
				);
		}
	};
	return (
		<React.Fragment>
			<View style={styles.bottomsheet}>
				<AppLoading visible={logoutLoader} />
				<RBSheet
					customStyles={{
						container: { borderRadius: 10, backgroundColor: color.drawerGrey },
					}}
					height={470}
					// height={520}
					ref={refRBSheet}
					dragFromTopOnly={true}
					closeOnDragDown={true}
					closeOnPressMask={true}
					draggableIcon
				>
					<React.Fragment>
						{drawerNavArr.map((ele, index) => (
							<TouchableWithoutFeedback
								onPress={() => ele.nav()}
								key={index}
							>
								<View
									style={{
										flexDirection: "row",
										height: 48,
										marginTop: index === 0 ? 15 : 0,
										paddingLeft: 16,
									}}
								>
									{renderIcons(ele)}
									<Text style={styles.label}>{ele.label}</Text>
								</View>
							</TouchableWithoutFeedback>
						))}
					</React.Fragment>
				</RBSheet>
			</View>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	bottomsheet: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	container: {
		height: 48,
		alignItems: "center",
		flexDirection: "row",
	},
	img: {
		height: 20,
		width: 20,
	},
	label: { color: color.black, marginLeft: 20 },
});

export default SettingBottomSheet;
