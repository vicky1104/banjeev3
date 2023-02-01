import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	VirtualizedList,
	Linking,
	Dimensions,
} from "react-native";

import AppButton from "../../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import color from "../../../../../constants/env/color";
import usePermission from "../../../../../utils/hooks/usePermission";
import AppInput from "../../../../../constants/components/ui-component/AppInput";

import PhoneBookItem from "./PhoneBookItem";
import * as Contacts from "expo-contacts";
import { emergencyContactListService } from "../../../../../helper/services/AddEmergencyContactService";
import { openAppSetting } from "../../../../../utils/util-func/constantExport";
import { Platform } from "react-native";

function PhoneBook(props) {
	const [contacts, setContacts] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [visible, setVisible] = useState(false);
	const { setOptions } = useNavigation();
	const { params } = useRoute();
	const [searchContact, setSearchContact] = useState([]);
	const [text, setText] = useState("");
	const [storeContact, setStoreContact] = useState([]);
	const [preDefineContact, setPreDefineContact] = useState([]);
	const { checkPermission } = usePermission();
	const [givePermission, setGivePermission] = useState(false);

	const apicall = useCallback(() => {
		emergencyContactListService()
			.then((res) => {
				setPreDefineContact(res.content);
			})
			.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		apicall();
		setOptions({
			headerTitle: params?.neighbourhood
				? "Invite contacts"
				: params?.invite
				? "Contacts"
				: "Emergency Contact",
		});
	}, [params, apicall]);

	useEffect(() => {
		Contacts.getPermissionsAsync()
			.then((res) => {
				if (res.granted) {
					getAllContact();
				} else {
					checkPermission("CONTACT")
						.then((res) => {
							if (res === "granted") {
								setGivePermission(false);
								getAllContact();
							} else {
								setGivePermission(true);
								setVisible(false);
							}
						})
						.catch((err) => console.error(err));
				}
			})
			.catch((err) => console.warn(err));
	}, [getAllContact]);

	const getAllContact = useCallback(() => {
		setVisible(true);

		Contacts.getContactsAsync({})
			.then((res) => {
				setStoreContact(res.data);
				setContacts((prev) => [...prev, ...res.data]);
				setVisible(false);
			})
			.catch((errr) => console.warn(errr));
	}, []);

	useEffect(() => {
		if (text.length > 0) {
			setContacts([]);
			let x = storeContact.filter((ele) => ele?.firstName?.includes(text));
			setSearchContact(x);
		} else {
			setSearchContact([]);
			getAllContact();
		}
	}, [text, getAllContact]);

	return (
		<View style={styles.container}>
			{visible && <AppLoading visible={true} />}
			{givePermission ? (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Text style={{ color: color.black, marginBottom: 20 }}>
						Please give permission to access contact.
					</Text>
					<View style={{ width: 120, alignSelf: "center" }}>
						<AppButton
							title={"Open Settings"}
							onPress={() => {
								if (Platform.OS === "android") {
									Linking.openSettings();
								} else {
									openAppSetting(
										"Banjee need access of your contacts for communication"
									);
								}
							}}
						/>
					</View>
				</View>
			) : (
				<>
					<AppInput
						placeholder={`Search contacts`}
						onChangeText={(e) => setText(e)}
						shouldDismiss={true}
					/>
					{text?.length > 0 ? (
						<VirtualizedList
							data={searchContact}
							keyExtractor={(data) => data?.id}
							getItem={(data, index) => data[index]}
							ListEmptyComponent={() => (
								<View
									style={{
										height: Dimensions.get("screen").height - 150,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text color={color?.black}>Searched contact not found.</Text>
								</View>
							)}
							getItemCount={(data) => data.length}
							renderItem={({ item }) => {
								return (
									<PhoneBookItem
										preDefineContact={preDefineContact}
										item={item}
										setSelectedContacts={setSelectedContacts}
										selectedContacts={selectedContacts}
									/>
								);
							}}
						/>
					) : (
						<>
							<VirtualizedList
								data={contacts}
								keyExtractor={(data) => data?.id}
								getItem={(data, index) => data[index]}
								getItemCount={(data) => data.length}
								renderItem={({ item }) => {
									return (
										<PhoneBookItem
											item={item}
											preDefineContact={preDefineContact}
										/>
									);
								}}
							/>
							{/* <View
								style={{
									width: 120,
									alignSelf: "center",
									position: "absolute",
									bottom: 20,
								}}
							>
								<AppButton
									title={"Add "}
									onPress={() => {
										addEmergencyContact();
									}}
								/>
							</View> */}
						</>
					)}
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default PhoneBook;
