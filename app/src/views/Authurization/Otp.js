import { HStack, Input, Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import BackGroundImg from "../../constants/components/BackGroundImg";
import Card from "../../constants/components/Card";
import AppButton from "../../constants/components/ui-component/AppButton";
import color from "../../constants/env/color";
import { sendOtp, validateOtp } from "../../helper/services/Auth";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useContext } from "react";
import FastImage from "react-native-fast-image";
import { AppContext } from "../../Context/AppContext";
import {
	removeLocalStorage,
	removeMyDefaultNeighbourhood,
	setLocalStorage,
} from "../../utils/Cache/TempStorage";
import SocketContext from "../../Context/Socket";
import { StackActions, useNavigation } from "@react-navigation/native";
import AppLoading from "../../constants/components/ui-component/AppLoading";
import OtpAutoFillViewManager from "react-native-otp-auto-fill";
import { deleteAccount } from "../../helper/services/DeletePost";

function Otp({ route, navigation }) {
	const [showView, setShowView] = useState("auto");
	const [seconds, setSeconds] = useState(30);
	const [otp, setOtp] = useState("");
	const [transactionCode, setTransactionCode] = useState(null);
	const [transactionId, setTransactionId] = useState(null);
	const [otpError, setOtpError] = useState("");
	const [visible, setVisible] = useState(false);
	const [autoFillModal, setAutoFillModal] = useState(false);

	const {
		profile,
		setProfile,
		setUserData,
		setLocation,
		setNeighbourhood,
		setToken,
		setIsLoaded,
		isLoaded,
	} = useContext(AppContext);
	const {
		mcc: countryCode,
		username,
		// directLogin,
		isMobile,
		type,
		resetPass,
	} = route.params;
	let str = username?.split("");
	str?.splice(2, 5, "XXXX");
	str = str?.join("");
	const { dispatch: naviDispatch } = useNavigation();
	// const { setToken, setUserData, isLoaded } = useContext(AppContext);
	const { socket } = React.useContext(SocketContext);

	useEffect(() => {
		if (resetPass) {
			console.warn("reset password so no navigation");
		} else if (isLoaded) {
			setVisible(false);

			naviDispatch(StackActions.replace("Bottom"));
		}
		return () => {
			setOtp(null);
		};
	}, [isLoaded]);

	const renderDecision = () => {
		console.warn(type, "typeeee");
		switch (type) {
			case "LOGIN":
				let newOtp = Object.values(otp).join("");
				axios
					.post(
						"https://gateway.banjee.org/services/system-service/oauth/token",
						`password=${newOtp}&grant_type=password&domain=208991&accountType=0&passwordType=otp&transactionId=${transactionCode}&username=${username}`,
						{
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								Authorization: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
							},
						}
					)
					.then(async (res) => {
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

						// if (res.data.access_token.length > 0) {
						// 	console.warn("resssss", res.data.access_token);
						// 	navigation.navigate("Feed");
						// }
					})
					.catch((err) => {
						console.log("-------------", JSON.stringify(err, null, 2));
					});
				break;

			case "OTP":
				// if (directLogin) {
				// 	navigation.navigate("Feed");
				// } else {
				navigation.navigate("Detail", {
					isMobile,
					username,
					countryCode,
					transactionCode,
				});
				// }
				break;

			case "RESET_PASSWORD":
				navigation.navigate("ResetPassword", {
					transactionCode,
					isMobile,
					username,
					otp: Object.values(otp).join(""),
					transactionId,
				});
				break;

			case "DELETE_ACCOUNT":
				Alert.alert("Delete Account", "Are you sure, to delete account", [
					{
						text: "Yes",
						style: "destructive",
						onPress: () =>
							deleteAccount(profile?.systemUserId)
								.then(async (res) => {
									console.warn(res, "res");

									Promise.all([
										await removeLocalStorage("profile"),
										await removeLocalStorage("avtarUrl"),
										await removeMyDefaultNeighbourhood("neighbourhood"),
										await removeLocalStorage("token"),
										await axios.delete(
											`https://gateway.banjee.org/services/message-broker/api/fireBaseRegistry/deleteByUserId/${profile?.systemUserId}`
										),
									])
										.then((storageRes) => {
											console.warn("kljhbgujyhfyufihgg");
											setProfile(null);
											setLocation(null);
											setIsLoaded(false);
											setNeighbourhood("loading");
											setUserData(null);
											setToken(null);
											naviDispatch(StackActions.replace("SignIn"));
										})
										.catch((err) => {
											console.error(err);
										});
								})
								.catch(async (err) =>
									Promise.all([
										await removeLocalStorage("profile"),
										await removeLocalStorage("avtarUrl"),
										await removeMyDefaultNeighbourhood("neighbourhood"),
										await removeLocalStorage("token"),
										await axios.delete(
											`https://gateway.banjee.org/services/message-broker/api/fireBaseRegistry/deleteByUserId/${profile?.systemUserId}`
										),
									])
										.then((storageRes) => {
											setProfile(null);
											setLocation(null);
											setIsLoaded(false);
											setNeighbourhood("loading");
											setUserData(null);
											setToken(null);
											naviDispatch(StackActions.replace("SignIn"));
										})
										.catch((err) => {
											console.error(err);
										})
								),
					},
					{
						text: "Cancel",
						style: "cancel",
						onPress: () => {
							console.warn("No cancel");
						},
					},
				]);
				console.warn("otp is valid what next");
				break;

			default:
				break;
		}
	};

	const getOTP = () => {
		let payload = {
			domain: "banjee",
			osName: Platform.OS,
			otp: Object.values(otp).join(""),
			source: "mobile",
			transactionCode: transactionCode,
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
		if (otp) {
			console.warn("vlidate otp");
			validateOtp(payload)
				.then((res) => {
					if (res.valid) {
						console.warn(res, "ewwwewewewe");
						setVisible(true);
						renderDecision();
						// setOtp("");
						setSeconds(0);
						setOtpError("");
						setVisible(false);
					} else {
						setOtpError(res.validationRespose);
					}
				})
				.catch((err) => {
					console.warn(err);
					setOtpError("Something Went Wrong !");
				});
		}
	};

	const sendOtpToUser = useCallback(() => {
		let payload = {
			mcc: countryCode,
			domain: "banjee",
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
		sendOtp(payload)
			.then((res) => {
				console.warn(res, "ss");
				setTransactionCode(res.transactionCode);
				setTransactionId(res?.transactionId);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [countryCode, username, isMobile, resetPass]);

	const callTimer = React.useCallback(() => {
		if (seconds > 0) {
			setShowView("none");
			setTimeout(() => setSeconds(seconds - 1), 1000);
		} else {
			setShowView("auto");
		}
	}, [seconds]);

	useEffect(() => {
		sendOtpToUser();
	}, [sendOtpToUser]);

	useEffect(() => {
		callTimer();
	}, [callTimer]);

	const inputs = new Array(4).fill(1).map((ele, index) => {
		return {
			refs: React.useRef(),
		};
	});

	const handleNavigateSignIn = () => navigation.navigate("SignIn");
	const handleManageThings = () => {
		sendOtpToUser();
		setSeconds(30);
		setOtp({});
	};

	const handleComplete = ({ nativeEvent: { code } }) => {
		if (code?.length === 4) {
			const a = code?.split("");
			a?.map((ele, index) => {
				setOtp((prev) => ({ ...prev, [index]: ele }));
			});
		}
	};

	const handleOnAndroidSignature = ({ nativeEvent: { code } }) => {
		// console.log("Android Signature Key for SMS body:", code);
	};

	return (
		<BackGroundImg>
			{visible && <AppLoading visible={visible} />}
			<Card style={{ marginTop: 100 }}>
				<FastImage
					source={require("../../../assets/logo.png")}
					style={[
						{ height: 80, width: 80, marginBottom: 26, alignSelf: "center" },
						styles.shadow,
					]}
				/>

				<View style={styles.txtBox}>
					<Text style={[styles.txt1, { color: color?.black }]}>
						Please enter the 4 digit OTP, which is sent to the{" "}
						{isMobile ? "mobile number" : "email address"} &nbsp;
						{str}
					</Text>
					<Text style={styles.err}>{otpError}</Text>
				</View>

				<View
					style={{
						height: 50,
						width: "70%",
						position: "relative",
						backgroundColor: "rgba(255,255,255, 0.10)",
						borderRadius: 8,
						paddingVertical: 10,
						flexDirection: "row",
						justifyContent: "center",
						alignSelf: "center",
					}}
				>
					<OtpAutoFillViewManager
						onComplete={handleComplete}
						onAndroidSignature={handleOnAndroidSignature}
						style={{
							height: "100%",
							width: "100%",
							position: "relative",
						}}
						length={4}
						color="white"
					/>
				</View>

				<View style={{ marginTop: 20 }}>
					{seconds > 0 && (
						<Text
							textAlign={"center"}
							color={color?.black}
							style={{ paddingVertical: 10 }}
						>
							{seconds + " Seconds remaining"}
						</Text>
					)}
				</View>

				{!resetPass && (
					<Text
						style={styles.link}
						onPress={handleNavigateSignIn}
					>
						Change {isMobile ? "phone number" : "email"}
					</Text>
				)}

				<View style={{ marginTop: 20, width: "100%" }}>
					<AppButton
						onPress={getOTP}
						title={"Proceed"}
					/>
				</View>

				{showView !== "none" ? (
					<View
						style={{ width: "100%", marginTop: 10 }}
						pointerEvents={showView}
					>
						<AppButton
							onPress={handleManageThings}
							title={"Resend"}
						/>
					</View>
				) : (
					<View
						style={{ width: "100%", marginTop: 10 }}
						pointerEvents={showView}
					>
						<AppButton
							disabled={true}
							onPress={(e) => {
								setOtp(null);
							}}
							title={"Resend"}
						/>
					</View>
				)}
			</Card>
		</BackGroundImg>
	);
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: color.card,
		zIndex: 0,
		width: 300,
		padding: 22,
		paddingBottom: 45,
		alignItems: "center",
	},
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
	txtBox: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	err: {
		alignSelf: "center",
		marginTop: 10,
		fontStyle: "italic",
		color: "red",
	},
	txt1: { textAlign: "center", alignSelf: "center" },

	underlineStyleBase: {
		width: 40,
		fontSize: 16,
		height: 40,
		color: color.black,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: color.black,
		backgroundColor: color.white,
	},

	underlineStyleHighLighted: {
		borderColor: color.black,
	},
	link: {
		alignSelf: "center",
		textDecorationLine: "underline",
		color: color.link,
	},
});

export default Otp;
