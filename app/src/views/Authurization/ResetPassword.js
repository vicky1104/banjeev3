import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Formik } from "formik";
import { showToast } from "../../constants/components/ShowToast";
import BackGroundImg from "../../constants/components/BackGroundImg";
import Card from "../../constants/components/Card";
import { Text } from "native-base";
import AppButton from "../../constants/components/ui-component/AppButton";
import AppInput from "../../constants/components/ui-component/AppInput";
import { changePassword } from "../../helper/services/Auth";
import KeyboardView from "../../constants/components/KeyboardView";
import color from "../../constants/env/color";

function ResetPassword({ navigation, route }) {
	const [passEye, setPassEye] = React.useState("eye");
	const [secureText, setSecureText] = React.useState(true);
	const [pass, checkPass] = React.useState(true);
	const { transactionCode, isMobile, username, otp, transactionId } =
		route.params;

	const buttonPress = ({ password, confirmPassword }) => {
		let payload = {
			domain: 208991,
			otp: otp,
			newPassword: password,
			transactionCode: transactionCode,
			transactionId: transactionId,
			userType: 0,
		};
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
		if (password === confirmPassword) {
			changePassword(payload)
				.then(() => {
					alert("Password Successfully Changed");
					checkPass(true && "Your password has been updated successfully!");
					navigation.navigate("Profile"); //moves back to setting page
				})
				.catch((err) => console.log(err));
		} else {
			checkPass(false && "Your password dosen't match");
		}
	};
	console.warn(pass);

	const passIcon = () => {
		if (secureText && passEye === "eye") {
			setPassEye("eye-off");
			setSecureText(!secureText);
		} else {
			setPassEye("eye");
			setSecureText(!secureText);
		}
	};
	return (
		<KeyboardView>
			<BackGroundImg>
				<Formik
					initialValues={{ password: "", confirmPassword: "" }}
					onSubmit={buttonPress}
					validate={(values) => {
						let errors = {};
						if (values?.password.length === 0) {
							errors.password = "Enter your new password*";
						}
						if (values.confirmPassword.length === 0) {
							errors.confirmPassword = "Enter confirm password*";
						}
						return errors;
					}}
				>
					{({ handleSubmit, setFieldValue, setTouched, touched, errors }) => {
						return (
							<Card>
								{/* `````````````````````` LOGO */}

								<Image
									source={require("../../../assets/logo.png")}
									style={[
										{
											height: 100,
											width: 100,
											marginBottom: 18,
											marginTop: 10,
											alignSelf: "center",
										},
										styles.shadow,
									]}
								/>
								<Text
									fontSize={14}
									style={{ alignSelf: "center" }}
									color={color?.black}
								>
									Please reset your password
								</Text>

								<View
									style={{
										position: "relative",
										width: "100%",
										marginTop: 22,
										marginBottom: 10,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text
										fontSize={14}
										color={color?.black}
									>
										New Password
									</Text>

									<Text
										ml={2}
										opacity={70}
										fontSize={12}
										color={color?.black}
										fontStyle="italic"
									>
										{errors.password}
									</Text>
								</View>

								<AppInput
									style={{
										height: 40,
										width: "100%",
										borderRadius: 8,
										padding: 10,
										color: color?.black,
										backgroundColor: color?.lightWhite,
									}}
									placeholderTextColor="grey"
									autoComplete="off"
									autoCorrect={false}
									secureTextEntry={true}
									onChangeText={(pass) => setFieldValue("password", pass)}
									autoCapitalize={"none"}
									placeholder="New Password"
								/>

								<View
									style={{
										position: "relative",
										width: "100%",
										marginTop: 20,
										marginBottom: 10,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text
										fontSize={14}
										color={color?.black}
									>
										Confirm Password
									</Text>
									<Text
										ml={2}
										fontSize={12}
										color={color?.black}
										fontStyle="italic"
										opacity={70}
									>
										{errors.password}
									</Text>
								</View>

								<AppInput
									style={{
										height: 40,
										width: "100%",
										borderRadius: 8,
										padding: 10,
										color: color?.black,
										backgroundColor: color?.lightWhite,
									}}
									placeholderTextColor="grey"
									autoComplete="off"
									autoCorrect={false}
									onPressIcon={passIcon}
									iconName={passEye}
									secureTextEntry={false}
									onChangeText={(pass) => setFieldValue("confirmPassword", pass)}
									autoCapitalize={"none"}
									placeholder="Confirm Password"
								/>

								{!pass && (
									<View style={{ width: "75%", marginTop: 19.2, alignSelf: "center" }}>
										<Text
											fontSize={14}
											style={{ textAlign: "center" }}
											color={color.black}
										>
											{pass === undefined ? "" : pass ? pass : "Password doesn't match"}
										</Text>
									</View>
								)}

								<View style={{ marginTop: 20, width: "100%" }}>
									<AppButton
										onPress={handleSubmit}
										title="Change Password"
									/>
								</View>
							</Card>
						);
					}}
				</Formik>
			</BackGroundImg>
		</KeyboardView>
	);
}

const styles = StyleSheet.create({});

export default ResetPassword;
