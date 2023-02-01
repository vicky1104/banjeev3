import { StyleSheet, View, ScrollView, Platform } from "react-native";
import React, { useContext } from "react";
import { updateProfile } from "../../../../helper/services/SettingService";
import BackGroundImg from "../../../../constants/components/BackGroundImg";
import UserDetailForm from "./UserDetailForm";
import Gender from "./Gender";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import Card from "../../../../constants/components/Card";
import color from "../../../../constants/env/color";
import { Formik } from "formik";
import AppDatePicker from "../../../../constants/components/ui-component/AppDatePicker";
import { getFormatedDate } from "../../../../utils/util-func/convertTime";
import { AppContext } from "../../../../Context/AppContext";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";

import KeyboardView from "../../../../constants/components/KeyboardView";
import { useNavigation } from "@react-navigation/native";
import { setLocalStorage } from "../../../../utils/Cache/TempStorage";

export default function UpdateDetail({}) {
	const { profile, userData, setProfile } = useContext(AppContext);
	const [btnDisable, setBtnDisable] = React.useState(false);

	const { navigate, goBack } = useNavigation();

	//console.warn(userData);
	const getUserProfileData = async (data) => {
		setBtnDisable(true);
		const payload = {
			birthDate: getFormatedDate(data.age).fDate,
			city: null,
			course: null,
			domain: "banjee",
			email: profile.email,
			emailVerified: false,
			external: null,
			externalSystemCode: null,
			externalUserId: null,
			firstName: data.firstName,
			gender: data.gender,
			id: userData?.externalReferenceId,
			institute: null,
			lastName: data.lastName,
			mcc: profile.mcc,
			mobile: profile.mobile,
			osName: Platform.OS,
			password: null,
			source: Platform.constants.interfaceIdiom,
			systemUserId: profile?.systemUserId,
			transactionCode: null,
			username: data.username,
			userType: 0,
		};
		updateProfile(payload)
			.then(async (res) => {
				setProfile(res);
				await setLocalStorage("profile", res);
				navigate("Bottom");
			})
			.catch((err) => {
				setBtnDisable(false);
				console.warn(err);
			});

		delete data.password;
	};

	return (
		<KeyboardView>
			<BackGroundImg>
				{btnDisable && <AppLoading visible={btnDisable} />}
				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardDismissMode="on-drag"
					// automaticallyAdjustKeyboardInsets={true}
				>
					<Formik
						initialValues={{
							firstName: profile?.firstName,
							lastName: profile?.lastName,
							username: profile?.username,
							email: profile?.email,
							mobile: profile?.mobile,
							gender: profile?.gender,
							age: new Date(
								profile?.birthDate?.split("-")?.[0],
								profile?.birthDate?.split("-")?.[1] - 1,
								profile?.birthDate?.split("-")?.[2]
							),
							password: "",
						}}
						enableReinitialize={true}
						onSubmit={(values) => getUserProfileData(values)}
					>
						{({ submitForm, resetForm }) => {
							return (
								<Card style={{ marginVertical: 100 }}>
									{/*``````````````````````` PROFILE PIC */}
									<UserDetailForm
										passwordFeild={false}
										emailEditable={false}
										mobileEditable={false}
									/>
									{/*``````````````````````` GENDER */}
									<Gender />
									<AppDatePicker />
									{/*``````````````````````` DATE OF BIRTH */}
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-around",
										}}
									>
										<View style={styles.btnView}>
											<AppButton
												disabled={btnDisable}
												onPress={() => goBack()}
												style={[styles.btn]}
												title={"Cancel"}
											/>
										</View>
										<View style={styles.btnView}>
											<AppButton
												disabled={btnDisable}
												onPress={submitForm}
												style={[styles.btn]}
												title={"Update"}
											/>
										</View>
									</View>
									{/*``````````````````````` NAME EMAIL PASSWORD CONTACTNO */}
								</Card>
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
		width: 120,
	},
	btnView: {
		flexDirection: "row",
		width: "30%",
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
