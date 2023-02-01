import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Formik } from "formik";
import jwtDecode from "jwt-decode";
import { Icon, Text } from "native-base";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import BackGroundImg from "../../constants/components/BackGroundImg";
import Card from "../../constants/components/Card";
import KeyboardView from "../../constants/components/KeyboardView";
import AppButton from "../../constants/components/ui-component/AppButton";
import AppInput from "../../constants/components/ui-component/AppInput";
import AppLoading from "../../constants/components/ui-component/AppLoading";
import color from "../../constants/env/color";
import { AppContext } from "../../Context/AppContext";
import SocketContext from "../../Context/Socket";
import { setLocalStorage } from "../../utils/Cache/TempStorage";

function Login({ route, navigation }) {
	const [show, setShow] = React.useState(false);
	const [visible, setVisible] = useState(false);
	const [passMsg, setPassMsg] = useState(false);
	const { setToken, setUserData } = useContext(AppContext);
	const { username, mcc, isMobile } = route.params;

	const { socket } = React.useContext(SocketContext);

	const buttonPress = ({ password }, resetForm) => {
		if (password) {
			setVisible(true);
			setPassMsg(false);

			axios
				.post(
					"https://gateway.banjee.org/services/system-service/oauth/token",
					`username=${username}&password=${password}&domain=208991&accountType=0&grant_type=password&passwordType=password+`,
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
						},
					}
				)
				.then(async (res) => {
					resetForm();
					await setLocalStorage("token", res.data.access_token);
					socket.send(
						JSON.stringify({
							action: "auth",
							data: res.data.access_token,
						})
					);
					setToken(res.data.access_token);
					const tokenData = jwtDecode(res.data.access_token);
					setUserData(tokenData);
				})
				.catch((err) => {
					setVisible(false);
					setPassMsg(true && "Incorrect Password*");
					console.warn("Login Error", err);
				});
		} else {
			setPassMsg(true && "Please enter password*");
		}
	};

	const handleShow = () => setShow(!show);

	const handleNavigateLogin = () =>
		navigation.navigate("Otp", {
			mcc,
			username,
			isMobile,
			directLogin: "directLogin",
			type: "LOGIN",
		});

	return (
		<KeyboardView>
			{visible && <AppLoading visible={visible} />}
			<BackGroundImg style={{ display: "flex", alignItems: "center" }}>
				<Formik
					initialValues={{ password: "" }}
					onSubmit={(values, { resetForm }) => buttonPress(values, resetForm)}
				>
					{({ handleSubmit, setFieldValue, values }) => (
						<Card style={{ marginTop: 100 }}>
							{/* `````````````````````` LOGO */}
							<View style={{ alignItems: "center" }}>
								<FastImage
									source={require("../../../assets/logo.png")}
									style={styles.img}
								/>

								<Text color={color?.black}>Please enter your password</Text>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginTop: 10,
								}}
							>
								<AppInput
									secureTextEntry={!show ? true : false}
									keyboardType="default"
									autoCapitalize="none"
									onChangeText={(num) => setFieldValue("password", num)}
									value={values.password}
									placeholder="Password"
									placeholderTextColor={color.black}
									style={{
										color: color?.black,
										height: 40,
										width: "100%",
										borderRadius: 8,
										padding: 10,
										borderWidth: 1,
										backgroundColor: color.lightWhite,
										// color: color.black,
									}}
								/>
								<Icon
									as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
									size={5}
									style={{ position: "absolute", right: 10 }}
									color={color.black}
									onPress={handleShow}
								/>
							</View>

							{passMsg && <Text style={styles.err}>{passMsg}</Text>}

							<View style={{ marginTop: 20, width: "100%" }}>
								<AppButton
									disabled={visible}
									onPress={handleSubmit}
									title={"Proceed"}
								/>
							</View>
							<FastImage
								source={require("../../../assets/OR.png")}
								style={{ height: 16, width: "100%", marginTop: 10 }}
							/>

							<View style={{ marginTop: 10, width: "100%" }}>
								<AppButton
									onPress={handleNavigateLogin}
									title={"Send an OTP"}
								/>
							</View>
						</Card>
					)}
				</Formik>
			</BackGroundImg>
		</KeyboardView>
	);
}

const styles = StyleSheet.create({
	err: { color: "red", fontStyle: "italic", marginTop: 10, fontSize: 14 },
	img: { height: 80, width: 80, marginBottom: 18 },
});

export default Login;
