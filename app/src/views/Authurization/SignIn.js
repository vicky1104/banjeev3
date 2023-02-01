import { Formik } from "formik";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import BackGroundImg from "../../constants/components/BackGroundImg";
import Card from "../../constants/components/Card";
import { validateUser } from "../../helper/services/Auth";
import { Text, Box } from "native-base";
import FastImage from "react-native-fast-image";
import SplashScreen from "react-native-splash-screen";
import KeyboardView from "../../constants/components/KeyboardView";
import AppButton from "../../constants/components/ui-component/AppButton";
import AppInput from "../../constants/components/ui-component/AppInput";
import color from "../../constants/env/color";
import "@react-native-firebase/messaging";
import { getLocalStorage } from "../../utils/Cache/TempStorage";
import AppIntro from "../../utils/AppIntro/AppIntro";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { countries } from "../../utils/contries";

function SignIn({ navigation }) {
	const [showRealApp, setShowRealApp] = useState("loading");
	const [mccData, setMccData] = React.useState("+267");
	const { token, userData } = useContext(AppContext);
	const scheme = useColorScheme();

	const buttonPress = ({ username }, resetForm) => {
		const isMobile = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(username);
		if (mccData) {
			let payload = { domain: "banjee", mcc: mccData, userType: 0 };
			if (isMobile) {
				payload = {
					...payload,
					mobile: username,
				};
			} else {
				payload = {
					...payload,
					email: username,
				};
			}
			validateUser(payload)
				.then((res) => {
					resetForm();
					let navParams = {
						mcc: mccData,
						type: "OTP",
						username,
						isMobile,
					};
					if (!res) {
						navigation.navigate("Otp", navParams);
					} else {
						navigation.navigate("Login", navParams);
					}
				})
				.catch((err) => {
					console.warn(err);
				});
		} else {
			axios
				.get("https://ipapi.co/json/")
				.then((res) => {
					console.warn(res, "resss");
					setMccData(res?.data?.country_calling_code);
				})
				.catch((err) => console.error("ipError", err));
		}
	};

	useLayoutEffect(() => {
		if (token === null && !userData?.id && showRealApp !== "loading") {
			SplashScreen.hide();
		}
	}, [token, userData, showRealApp]);

	useEffect(() => {
		getLocalStorage("appIntro")
			.then((res) => {
				if (JSON.parse(res)) {
					setShowRealApp(true);
				} else {
					setShowRealApp(false);
				}
			})
			.catch((err) => {
				setShowRealApp("loading");
			});
	}, []);

	// const premissionHandler = useCallback(async () => {
	// 	let result = await checkPermission("LOCATION");
	// 	await messaging().requestPermission();
	// 	if (["unavailable", "blocked", "denied"].includes(result)) {
	// 		Alert.alert(
	// 			"Exit App",
	// 			"Do you want to exit?",
	// 			[
	// 				{
	// 					text: "Open Settings",
	// 					onPress: () => {
	// 						if (Platform.OS === "ios") {
	// 							Linking.openURL("app-settings:").then((res) => {
	// 								RNExitApp.exitApp();
	// 							});
	// 						} else {
	// 							Linking.openSettings().then((res) => {
	// 								RNExitApp.exitApp();
	// 							});
	// 						}
	// 					},
	// 					style: "cancel",
	// 				},
	// 				{
	// 					text: "Yes",
	// 					onPress: () => RNExitApp.exitApp(),
	// 				},
	// 			],
	// 			{ cancelable: false }
	// 		);
	// 	}
	// }, []);

	const getGeoInfoApiCall = React.useCallback(() => {
		axios
			.get("https://ipapi.co/json/")
			.then((res) => {
				setMccData(res?.data?.country_calling_code);
			})
			.catch((err) => {});
	}, []);

	useFocusEffect(getGeoInfoApiCall);

	const navigateToTearmsAndConditions = () =>
		navigation.navigate("termsAndConditions", {
			url: "https://www.banjee.org/tnc",
			label: "Tearms & Conditions",
		});

	const navigateToPrivacyPolicy = () =>
		navigation.navigate("termsAndConditions", {
			url: "https://www.banjee.org/privacypolicy",
			label: "Privacy Policy",
		});
	if (showRealApp === false) {
		return (
			<AppIntro
				cb={() => {
					setShowRealApp(true);
				}}
			/>
		);
	} else {
		return (
			<KeyboardView>
				<StatusBar
					translucent={true}
					backgroundColor="transparent"
					barStyle={scheme === "dark" ? "light-content" : "dark-content"}
				/>
				<BackGroundImg style={{ display: "flex", alignItems: "center" }}>
					<Formik
						initialValues={{ username: "" }}
						validate={(values) => {
							const errors = {};
							const { username } = values;
							if (!username) {
								errors.username = "Mobile or Email is required";
							} else {
								console.warn(username);
								if (username[0] === "0" || username.length < 6) {
									errors.username = "Invalid Mobile or Email";
								} else {
									if (
										!/^\d+$/.test(username) &&
										!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(username)
									) {
										errors.username = "Invalid Mobile or Email";
									}
								}
							}
							return errors;
						}}
						onSubmit={(values, { resetForm }) => {
							buttonPress(values, resetForm);
						}}
					>
						{({ submitForm, setFieldValue, setTouched, touched, errors, values }) => {
							return (
								<Card>
									{/* `````````````````````` LOGO */}
									<View style={{ alignItems: "center" }}>
										<Text
											style={{
												fontSize: 24,
												marginBottom: 30,
												paddingTop: 25,
												color: color?.black,
											}}
										>
											Get Started
										</Text>
										<FastImage
											source={require("../../../assets/logo.png")}
											style={[{ height: 80, width: 80, marginBottom: 30 }, styles.shadow]}
										/>

										<Text
											color={color?.black}
											textAlign="left"
											width="100%"
										>
											Enter your mobile number or Email
										</Text>

										{/* `````````````````````````` COUNTRY CODE ````````````````````` */}

										<View style={{ alignItems: "center", marginTop: 0 }}>
											<Box
												position={"relative"}
												display="flex"
												flexDirection="row"
												flexWrap={"wrap"}
												w="100%"
											>
												{/* <DropDownPicker
													textStyle={{ color: color.white }}
													listItemLabelStyle={{ color: color.white }}
													open={open}
													value={values.mcc}
													items={mccData.map((ele) => {
														return {
															label: `${ele.emoji}  ${ele.mcc}`,
															value: ele.mcc,
														};
													})}
													setOpen={setOpen}
													containerStyle={{
														height: 40,
														width: 80,
														padding: 0,
														margin: 0,
														zIndex: 99,
													}}
													dropDownContainerStyle={{
														position: "absolute",
														backgroundColor: color?.lightWhite,
														right: -8,
														top: 4,
														color: color.white,
													}}
													placeholderStyle={{ color: "grey" }}
													showTickIcon={false}
													showArrowIcon={false}
													setValue={(data) => {
														let val = data();
														setFieldValue("mcc", val);
													}}
													style={{
														color: color.white,

														padding: 0,
														marginTop: 4,
														backgroundColor: color?.lightWhite,
														margin: 0,
														width: 80,
														height: 40,
														position: "absolute",
														right: -8,
														borderLeftWidth: 1,
														borderRightWidth: 0,
														borderTopWidth: 1,
														borderBottomWidth: 1,
														borderRadius: 6,
														borderTopRightRadius: 0,

														borderBottomRightRadius: 0,
													}}
													placeholder="MCC"
												/> */}
												<AppInput
													style={{
														height: 45,
														width: "100%",
														backgroundColor: color?.lightWhite,
														marginTop: 4.3,
														paddingLeft: 15,
														borderRadius: 8,
														color: color.black,
													}}
													onBlur={setTouched}
													onChangeText={(num) => setFieldValue("username", num)}
													value={values.username}
													placeholder="Mobile or Email"
													placeholderTextColor={color.grey}
													autoCapitalize={"none"}
													onSubmitEditing={submitForm}
												/>
											</Box>
										</View>

										{errors?.username && touched?.username && (
											<Text
												style={{
													color: "salmon",
													fontSize: 14,
													marginTop: 5,
													paddingLeft: 5,
													textAlign: "left",
													width: "100%",
												}}
											>
												{errors?.username}
											</Text>
										)}
									</View>

									<View style={{ marginTop: 15 }}>
										<AppButton
											onPress={submitForm}
											title={"Next"}
										/>
									</View>
									<Text
										style={{
											marginTop: 20,
											zIndex: -1,
											fontSize: 14,
											textAlign: "center",
											color: color?.black,
										}}
									>
										By clicking next you agree with our
									</Text>
									<Text
										color={color?.black}
										textAlign="center"
									>
										<Text
											onPress={navigateToTearmsAndConditions}
											style={{
												color: color.link,
											}}
										>
											{" "}
											Terms & Conditions{" "}
										</Text>
										and
										<Text
											onPress={navigateToPrivacyPolicy}
											style={{
												color: color.link,
											}}
										>
											{" "}
											Privacy Policy
										</Text>
									</Text>
								</Card>
							);
						}}
					</Formik>
				</BackGroundImg>
			</KeyboardView>
		);
	}
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "grey",
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
	sign: {
		display: "flex",
		flexDirection: "row",
		height: 40,
		width: "100%",
		alignItems: "center",
		backgroundColor: color.white,
		justifyContent: "space-evenly",
	},
	phoneContainer: {
		width: "100%",
		height: 40,
		borderRadius: 3,
		marginTop: 20,
	},
	textInput: {
		paddingVertical: 0,
	},
});

export default SignIn;
