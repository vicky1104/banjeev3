import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Formik } from "formik";
import jwtDecode from "jwt-decode";
import { Text } from "native-base";
import React, { useContext } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { MainContext } from "../../../context/MainContext";
import BackGroundImg from "../../constants/components/BackGroundImg";
import Card from "../../constants/components/Card";
import KeyboardView from "../../constants/components/KeyboardView";
import { showToast } from "../../constants/components/ShowToast";
import AppButton from "../../constants/components/ui-component/AppButton";
import AppDatePicker from "../../constants/components/ui-component/AppDatePicker";
import AppLoading from "../../constants/components/ui-component/AppLoading";
import color from "../../constants/env/color";
import { AppContext } from "../../Context/AppContext";
import { signup } from "../../helper/services/Auth";
import { setLocalStorage } from "../../utils/Cache/TempStorage";
import { getFormatedDate } from "../../utils/util-func/convertTime";
import Gender from "../Main/Profile/UpdateInfo/Gender";
import UserDetailForm from "../Main/Profile/UpdateInfo/UserDetailForm";

export default function Details() {
	const { setUserData, setProfile, setToken, setIsLoaded } =
		useContext(AppContext);
	const { navigate } = useNavigation();

	const [visible, setVisible] = React.useState(false);

	const {
		params: { isMobile, username, countryCode, transactionCode },
	} = useRoute();

	const updateMe = (user) => {
		setVisible(true);
		let payload = {
			birthDate: getFormatedDate(user.age).fDate,
			city: null,
			course: null,
			domain: "banjee",
			emailVerified: false,
			external: null,
			externalSystemCode: null,
			externalUserId: null,
			firstName: user.firstName,
			gender: user.gender,
			id: null,
			institute: null,
			lastName: user.lastName,
			email: user.email,
			mobile: user.mobile,
			mcc: countryCode,
			osName: Platform.OS,
			password: user.password,
			source: Platform.constants.interfaceIdiom,
			systemUserId: null,
			transactionCode: transactionCode,
			userType: 0,
			username: user.username,
		};
		console.warn("SignUp Payload", payload);
		signup(payload)
			.then((res) => {
				if (res) {
					setProfile(res);
					setIsLoaded("inSigin");
					handleLogin(res.id, user);
				}
			})
			.catch((err) => {
				setVisible(false);
				console.log(err);
				if (err.statusCode === -101) {
					showToast(err.message);
				}
			});
	};

	const handleLogin = (id, user) => {
		axios
			.post(
				"https://gateway.banjee.org/services/system-service/oauth/token",
				`username=${username}&password=${user?.password}&domain=208991&accountType=0&grant_type=password&passwordType=password+`,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
					},
				}
			)
			.then(async (res) => {
				await setLocalStorage("token", res.data.access_token);
				setToken(res.data.access_token);
				const jwtToken = jwtDecode(res.data.access_token);
				setUserData(jwtToken);
				setVisible(false);
				navigate("UpdateAvatar", {
					newScreen: "MyCloud",
					password: user?.password,
				});
			})
			.catch((err) => {
				setVisible(false);
				console.warn("Login Error", JSON.stringify(err));
			});
	};

	return (
		<KeyboardView>
			<BackGroundImg>
				{visible && <AppLoading visible={visible} />}
				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardDismissMode="on-drag"
					// automaticallyAdjustKeyboardInsets={true}
				>
					<Formik
						initialValues={{
							firstName: "",
							lastName: "",
							username: "",
							email: isMobile ? "" : username?.toString(),
							mobile: isMobile ? username?.toString() : "",
							gender: "",
							password: "",
							age: new Date(new Date().getFullYear() - 13, 1, 1),
						}}
						onSubmit={(values) => {
							updateMe(values);
						}}
					>
						{({ submitForm, values }) => {
							return (
								<View style={{ paddingBottom: 120 }}>
									<Card style={{ marginTop: 30 }}>
										{/*``````````````````````` PROFILE PIC */}
										<View style={{ position: "relative", alignItems: "center" }}></View>
										<UserDetailForm
											passwordFeild={true}
											emailEditable={isMobile}
											mobileEditable={!isMobile}
										/>
										{/*``````````````````````` GENDER */}
										<Gender />
										<React.Fragment>
											<Text
												style={{
													marginTop: 20,
													marginBottom: -10,
													fontWeight: "500",
													fontSize: 14,
													color: color.black,
												}}
											>
												Date Of Birth
											</Text>
											<AppDatePicker />
										</React.Fragment>

										{/*``````````````````````` DATE OF BIRTH */}

										<View style={styles.btnView}>
											<AppButton
												onPress={submitForm}
												disabled={
													!values?.firstName ||
													!values?.lastName ||
													!values?.username ||
													!values?.mobile ||
													!values?.email ||
													!values?.gender ||
													!values.password ||
													!values?.age
												}
												style={[styles.btn, { paddingHorizontal: 40 }]}
												title={"Register"}
											/>
										</View>

										{/*``````````````````````` NAME EMAIL PASSWORD CONTACTNO */}
									</Card>
								</View>
							);
						}}
					</Formik>
				</ScrollView>
			</BackGroundImg>
		</KeyboardView>
	);
}

const styles = StyleSheet.create({
	img: {
		alignSelf: "center",
		height: 100,
		width: 100,
		marginTop: 5,
		borderRadius: 50,
		borderColor: color.white,
		borderWidth: 0.5,
	},
	appText: { fontSize: 14, marginTop: 20, fontWeight: "500" },
	inputView: {
		marginTop: -10,
		flexDirection: "row",
		alignItems: "center",
	},
	imgView: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
		marginLeft: 15,
	},
	btn: {
		width: 150,
	},
	btnView: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-evenly",
		marginTop: 20,
	},
	details: {
		marginTop: -40,
		marginLeft: 90,
		borderWidth: 0.5,
		borderColor: color.drawerGrey,
		borderRadius: 50,
		height: 40,
		position: "absolute",
		bottom: 0,
		left: "20%",
		width: 40,
		backgroundColor: color.white,
		alignItems: "center",
		justifyContent: "center",
	},
});
