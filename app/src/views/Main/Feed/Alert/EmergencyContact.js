import { Entypo } from "@expo/vector-icons";
import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
	BackHandler,
	FlatList,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import color from "../../../../constants/env/color";
import { emergencyContactListService } from "../../../../helper/services/AddEmergencyContactService";
import { findBanjeeContacts } from "../../../../helper/services/FindContacts";
import EmergencyContactListItem from "./EmergencyContactListItem";
import SearchEmergencySearchContactItem from "./SearchEmergencySearchContactItem";
import {
	useNavigation,
	CommonActions,
	useFocusEffect,
} from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { setLocalStorage } from "../../../../utils/Cache/TempStorage";
import AppButton from "../../../../constants/components/ui-component/AppButton";

function EmergencyContact(props) {
	const [banjeeContacts, setBanjeeContacts] = useState([]);
	const [keyWord, setKeyWord] = useState("");
	const [preDefinedContact, setPreDefinedContact] = useState([]);
	const { goBack, setOptions, dispatch, navigate } = useNavigation();
	const [hasEmgContact, setHasEmgContact] = useState(false);

	React.useEffect(() => {
		function callBackFunc() {
			handleBack();
			return true;
		}
		BackHandler.addEventListener("hardwareBackPress", callBackFunc);
		return () => {
			BackHandler.removeEventListener("hardwareBackPress", callBackFunc);
		};
	}, [hasEmgContact, handleBack]);

	function handleBack() {
		if (hasEmgContact) {
			console.warn("Back handler will work");
			dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "Bottom" }],
				})
			);
		} else {
			console.warn("gobackkkk");

			goBack();
		}
	}

	const apicall = useCallback(() => {
		emergencyContactListService()
			.then((res) => {
				// console.warn("api called......");
				setPreDefinedContact(res.content);
				if (res.empty) {
					setHasEmgContact(false);
					setLocalStorage("EmptyEmergencyContact", true);
				} else {
					setHasEmgContact(true);
					setLocalStorage("EmptyEmergencyContact", false);
				}
			})
			.catch((err) => console.warn(err));

		if (keyWord.length > 0) {
			findBanjeeContacts({
				deleted: "false",
				keywords: keyWord,
				page: 0,
				pageSize: 20,
			})
				.then((res) => {
					setBanjeeContacts(res.content);
				})
				.catch((err) => console.warn(err));
		}
	}, [keyWord]);

	useFocusEffect(
		useCallback(() => {
			setOptions({
				headerLeft: () => (
					<HeaderBackButton
						labelVisible={false}
						tintColor="#FFF"
						style={{
							marginLeft: Platform.OS === "ios" ? 10 : 5,
						}}
						onPress={handleBack}
					/>
				),
			});
			apicall();
		}, [apicall, hasEmgContact])
	);

	return (
		<View style={{ flex: 1, backgroundColor: color?.gradientWhite }}>
			<View style={styles.inputView}>
				{keyWord.length > 0 && (
					<View style={styles.crossIcon}>
						<Entypo
							name="cross"
							size={20}
							color={color.black}
							onPress={() => {
								setKeyWord("");
								setBanjeeContacts([]);
							}}
						/>
					</View>
				)}

				<AppInput
					value={keyWord}
					onChangeText={(e) => {
						setKeyWord(e);
					}}
					shouldDismiss={true}
					style={styles.input}
					placeholderTextColor="grey"
					placeholder={"Search Banjee"}
				/>
			</View>

			{/* ``````````````````````````````````````````````````````` EMERGENCY CONTACT LIST */}

			{keyWord.length === 0 && (
				<FlatList
					data={preDefinedContact}
					keyExtractor={(data) => data.id}
					renderItem={({ item }) => {
						return (
							<EmergencyContactListItem
								item={item}
								apicall={apicall}
							/>
						);
					}}
					ListEmptyComponent={() => (
						<View style={styles.emptyView}>
							<Text
								textAlign={"center"}
								color={color?.black}
							>
								Search user by username or mobile number.
							</Text>
						</View>
					)}
				/>
			)}

			{!keyWord && (
				<View style={{ marginBottom: 80, width: 120, alignSelf: "center" }}>
					<AppButton
						title={"Phonebook"}
						onPress={() => navigate("PhoneBook")}
					/>
				</View>
			)}

			<View style={styles.txtView}>
				<Text
					fontSize={16}
					style={styles.txt}
				>
					In case of emergency system will notify your emergency contact for help.
				</Text>
			</View>

			{keyWord.length > 0 && (
				<FlatList
					data={banjeeContacts}
					keyExtractor={(data) => data.id}
					renderItem={({ item }) => {
						return (
							<SearchEmergencySearchContactItem
								item={item}
								apicall={apicall}
							/>
						);
					}}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	inputView: {
		position: "relative",
		width: "100%",
		paddingHorizontal: "2.5%",
		alignSelf: "center",
		marginTop: 10,
		alignItems: "center",
		marginBottom: 10,
	},
	emptyView: {
		height: 180,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		color: color.black,
		height: 40,
		width: "100%",
		borderRadius: 8,
		padding: 10,
		// borderWidth: 1,
		backgroundColor: color?.lightWhite,
	},
	crossIcon: {
		borderColor: color?.lightWhite,
		borderRadius: 50,
		height: 25,
		width: 25,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		right: 20,
		zIndex: 99,
		top: 7,
	},
	txtView: {
		position: "absolute",
		bottom: 20,
		width: "100%",
	},
	txt: {
		textAlign: "center",
		width: "95%",
		alignSelf: "center",
		color: color?.black,
	},
});

export default EmergencyContact;
