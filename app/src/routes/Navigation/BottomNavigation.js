import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	Image,
	Keyboard,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { AppContext } from "../../Context/AppContext";
import NewProfile from "../../views/Main/Profile/NewProfile/NewProfile";
import { Text } from "native-base";
import RBSheet from "react-native-raw-bottom-sheet";
import { MainContext } from "../../../context/MainContext";
import Contacts from "../../views/Main/Contacts/Contacts";
import Main from "../../views/Main/Feed/NewFeedFlow/Main";
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import {
	getLocalStorage,
	setLocalStorage,
} from "../../utils/Cache/TempStorage";
import SplashScreen from "react-native-splash-screen";
import NewNotifications from "../../views/Main/Feed/NewFeedFlow/NewNotifications";
import color from "../../constants/env/color";
import { emergencyContactListService } from "../../helper/services/AddEmergencyContactService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import copilotConfig from "../../constants/components/copilotConfig";

const CopilotView = walkthroughable(View);

const RenderMoreBottomSheet = () => {
	const { items } = useContext(MainContext);
	const refRBSheet = useRef(null);
	const [keyboardOpen, setKeyboardOpen] = useState(false);

	let d = {
		iconType: MaterialIcons,
		iconName: "add",
		iconSize: 30,
		style: {
			width: 50,
			height: 50,
			backgroundColor: "#fff",
			position: "absolute",
			// bottom: 45,
			left: Dimensions.get("screen").width / 2 - 22,
			bottom: Dimensions.get("screen").height / 18,
			borderRadius: 25,
			zIndex: 9999,
			elevation: 3,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			zIndex: 1,
		},
	};

	useEffect(() => {
		Keyboard.addListener("keyboardDidShow", () => {
			setKeyboardOpen(true);
		});
		Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardOpen(false);
		});

		return () => {
			Keyboard.removeAllListeners();
		};
	}, []);

	return (
		<>
			{!keyboardOpen && (
				<>
					<TouchableWithoutFeedback onPress={() => refRBSheet.current.open()}>
						<CopilotStep
							text="Click to create Posts, Blogs or Alerts"
							order={11}
							name="more action"
						>
							<CopilotView
								style={[
									d.style,
									{
										shadowColor: color?.black,
										shadowOpacity: 0.5,
										shadowRadius: 2,
										shadowOffset: {
											height: 1,
											width: 1,
										},
										zIndex: 2,
									},
								]}
							>
								<d.iconType
									onPress={() => refRBSheet.current.open()}
									name={d.iconName}
									size={d.iconSize}
									color={"black"}
									style={{ zIndex: 2 }}
								/>
							</CopilotView>
						</CopilotStep>
					</TouchableWithoutFeedback>
					<RBSheet
						customStyles={{
							container: {
								borderRadius: 10,
								display: "flex",
								flexDirection: "row",
								flexWrap: "wrap",
								justifyContent: "space-around",
								backgroundColor: color?.gradientWhite,
							},
						}}
						// height={420}
						height={200}
						ref={refRBSheet}
						dragFromTopOnly={true}
						closeOnDragDown={true}
						closeOnPressMask={true}
						draggableIcon
						onClose={() => {}}
					>
						<View style={{ flexDirection: "column", alignItems: "center" }}>
							<Text
								color={color.black}
								alignSelf="center"
								fontSize={20}
							>
								Create
							</Text>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									width: "90%",
									alignSelf: "center",
								}}
							>
								{items.map((ele, i) => {
									// let x = ele.title.split(" ");
									// console.warn(x);
									return (
										<TouchableWithoutFeedback
											onPress={() => {
												refRBSheet.current.close();
												ele.onPress();
											}}
											key={Math.random()}
										>
											<View
												style={{
													display: "flex",
													flexDirection: "column",
													flexWrap: "wrap",
													justifyContent: "center",
													alignItems: "center",
													marginTop: 20,
												}}
											>
												<View
													style={[
														{
															width: 60,
															height: 60,
															backgroundColor: "#fff",

															borderRadius: 16,
															zIndex: 9999,
															elevation: 3,
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
														},
													]}
												>
													<ele.iconType
														name={ele.iconName}
														size={ele.iconSize}
														color={"black"}
													/>
												</View>

												<Text
													textAlign={"center"}
													mt={2}
													color={color?.black}
												>
													{ele.title}
												</Text>
											</View>
										</TouchableWithoutFeedback>
									);
								})}
							</View>
						</View>
					</RBSheet>
				</>
			)}
		</>
	);
};

function BottomNavigation(props) {
	const Tab = createBottomTabNavigator();
	const { unreadMessage, token, userData } = useContext(AppContext);

	const { navigate } = useNavigation();
	const gStyle = {
		display: "flex",
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: Dimensions.get("screen").scale / 0.2,
		height: 57,
		width: 57,
	};
	const tabArr = [
		{
			name: "Feed",
			component: Main,
			headerTitle: "",
			style: gStyle,
			iconType: FontAwesome,
			iconName: "home",
			iconSize: 24,
			headerShown: true,
			tooltip: "Click to explore your Neighborhood and Global feeds",
		},
		{
			name: "Contacts",
			headerTitle: "Chat",
			component: Contacts,
			iconType: Ionicons,
			iconName: "chatbubbles-sharp",
			iconSize: 24,
			style: [gStyle, { marginRight: 30 }],
			headerShown: true,
			tooltip: "Click to view messages sent Privately and in Communities",
		},
		{
			name: "GlobalAlerts",
			component: NewNotifications,
			headerTitle: "Global Alerts",
			iconType: MaterialIcons,
			iconName: "groups",
			iconSize: 28,
			style: [gStyle, { marginLeft: 30 }],
			headerShown: true,
			tooltip: "Click to explore Global Alerts",
		},
		{
			name: "Profile",
			component: NewProfile,
			headerTitle: "Profile",
			iconType: FontAwesome,
			iconName: "user-circle-o",
			iconSize: 20,
			style: gStyle,
			headerShown: true,
			tooltip: "Click to view and update your User Profile",
		},
	];

	const getMyEmergencyContact = useCallback(async () => {
		let y = await Promise.all([
			await emergencyContactListService(),
			await getLocalStorage("EmptyEmergencyContact"),
		]);
		if (y?.[0]?.empty && JSON.parse(y?.[1])) {
			navigate("UpdateName", { updateName: false });
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			getLocalStorage("walkThrough1").then(async (res) => {
				if (!JSON.parse(res)) {
					if (props?.start) {
						props?.start();
					}
				} else {
					await getMyEmergencyContact();
				}
			});
		}, [getMyEmergencyContact])
	);

	useLayoutEffect(() => {
		if (token !== "loading" && userData?.id) {
			setTimeout(() => {
				SplashScreen.hide();
			}, 100);
		}
	}, [token, userData]);
	return (
		<>
			<RenderMoreBottomSheet />
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: {
						alignContent: "center",
						height: 70,
						position: "absolute",
						borderRadius: 24,
						marginHorizontal: 20,
					},

					tabBarLabel: () => {
						return null;
					},

					tabBarVisibilityAnimationConfig: {
						show: {
							animation: "timing",
							config: {
								duration: 0,
								isInteraction: false,
							},
						},
						hide: {
							animation: "timing",
							config: {
								duration: 0,
								isInteraction: false,
							},
						},
					},
					tabBarHideOnKeyboard: true,
					tabBarBackground: () => (
						<View
							style={{
								height: 60,
								position: "absolute",
								top: -1,
								width: "100%",
								borderRadius: 24,
								elevation: 2,
								shadowColor: color?.black,
								shadowOpacity: 0.5,
								shadowRadius: 1,
								shadowOffset: {
									height: 1,
									width: 1,
								},
								backgroundColor: color?.gradientWhite,
							}}
						></View>
					),
				}}
			>
				{tabArr.map((ele, i) => {
					return (
						<Tab.Screen
							key={i}
							options={{
								headerShadowVisible: false,
								tabBarHideOnKeyboard: true,
								tabBarItemStyle: ele.style,
								headerShown: ele.headerShown,
								title: ele.headerTitle,
								tabBarIcon: ({ focused }) => {
									const focusColor = focused ? "#ffffff" : "#f5f5f599";
									// if (ele.name === "Feed" && focused) {
									// 	setFeedActive(true);
									// } else {
									// 	setFeedActive(false);
									// }

									if (unreadMessage && ele.name === "Contacts") {
										return (
											<>
												<ele.iconType
													name={ele.iconName}
													size={ele.iconSize}
													color={focusColor}
												/>
												<View
													style={{
														height: 8,
														width: 8,
														backgroundColor: color.primary,
														borderRadius: 5,
														position: "absolute",
														top: 12,
														right: 5,
													}}
												></View>
											</>
										);
									} else if (ele.name === "GlobalAlerts") {
										return (
											<CopilotStep
												text={ele.tooltip}
												order={7 + i}
												name={ele.iconName}
											>
												<CopilotView>
													<Image
														source={require("../../../assets/EditDrawerIcon/announcement.png")}
														style={{
															tintColor: focused ? "#ffffff" : "#f5f5f599",
															height: 25,
															width: 25,
															marginLeft: 10,
														}}
													/>
												</CopilotView>
											</CopilotStep>
										);
									} else {
										return (
											<CopilotStep
												text={ele.tooltip}
												order={7 + i}
												name={ele.iconName}
											>
												<CopilotView>
													<ele.iconType
														name={ele.iconName}
														color={focused ? "#ffffff" : "#f5f5f599"}
														size={ele.iconSize}
													/>
												</CopilotView>
											</CopilotStep>
										);
									}
								},
							}}
							name={ele.name}
							component={ele.component}
						/>
					);
				})}
			</Tab.Navigator>
		</>
	);
}

export default copilot(copilotConfig)(BottomNavigation);
