import { useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	Linking,
	Platform,
	Alert,
	TouchableWithoutFeedback,
} from "react-native";

import color from "../../../../../constants/env/color";
import * as Share from "react-native-share";
import {
	addEmergencyContactService,
	deleteEmergencyContact,
	emergencyContactListService,
} from "../../../../../helper/services/AddEmergencyContactService";
import { showToast } from "../../../../../constants/components/ShowToast";
import { AppContext } from "../../../../../Context/AppContext";
import AppLoading from "../../../../../constants/components/ui-component/AppLoading";
import { shareNeighbourhood } from "../../../../Other/ShareApp";

function PhoneBookItem({ item, preDefineContact }) {
	const { params } = useRoute();
	const [add, setAdd] = useState("Add");
	const [visible, setVisible] = useState(false);
	const { userData } = useContext(AppContext);
	const [tempData, setTempData] = useState([]);
	const onSendSMSMessage = useCallback(async (phoneNumber, message) => {
		const separator = Platform.OS === "ios" ? "&" : "?";
		const url = `sms:${phoneNumber}${separator}body=${message}`;
		await Linking.openURL(url);
	}, []);

	let inviteMsg =
		"Let's chat on Banjee It's a fast, simple, and secure app we can use to message and call each other for free. Get it at https://banjee";
	let shareNeighbourhood = `Hi There! Come Join my Neighborhood ${
		params?.neighbourhood?.name
	} on Banjee.${"\n"}https://www.banjee.org/neighborhood/${
		params?.neighbourhood?.id
	}`;

	const decodeNumber = () => {
		let ph = "";

		let number =
			Platform.OS === "ios"
				? item?.phoneNumbers?.[0]?.digits
				: item?.phoneNumbers?.[0]?.number;

		if (number?.includes("+91")) {
			return (ph = number.substring(3, number.length));
		} else if (number?.includes("+267")) {
			return (ph = number.substring(4, number.length));
		} else {
			return (ph = number);
		}
	};

	useEffect(() => {
		preDefineContact?.filter((ele) => {
			if (
				!ele?.userObject?.systemUserId &&
				ele?.userObject?.mobile === decodeNumber()
			) {
				setAdd("Remove");
			}
		});
	}, [preDefineContact]);

	function addEmergencyContact() {
		setVisible(true);

		const { firstName, lastName, mobile, username } = item;

		addEmergencyContactService({
			firstName,
			lastName,
			mcc: userData?.mcc,
			mobile: decodeNumber(),
			username,
			domain: "208991",
		})
			.then((res) => {
				setVisible(false);
				if (res) {
					console.warn(res);
					setTempData((pre) => [...pre, res]);
					setAdd("Remove");
					showToast(
						`${res.userObject.firstName ? res.userObject.firstName : ""} ${
							res.userObject.lastName ? res.userObject.lastName : ""
						} successfuly added to your emergency contact list.`
					);
				} else {
					showToast("You can add only 3 emergency contact.");
				}
			})
			.catch((err) => console.warn(err));
	}

	function removeContact(id) {
		let allContact = preDefineContact.concat(tempData);

		let x = allContact?.filter((ele) => {
			if (
				!ele?.userObject?.systemUserId &&
				ele?.userObject?.mobile === decodeNumber()
			) {
				return ele.id;
			}
		});

		Alert.alert("Delete Contact", "Are you sure, you want to remove contact", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "default",
			},
			{
				text: "Remove",
				style: "destructive",
				onPress: () => {
					setVisible(true);

					deleteEmergencyContact(x[0]?.id)
						.then((res) => {
							setVisible(false);
							setAdd("Add");
						})
						.catch((err) => console.warn(err));
				},
			},
		]);
	}

	const sendMsg = (msg) => {
		const shareOptions = {
			message: msg,
			social: Share.Social.Sms,
			recipient: item?.phoneNumbers?.[0]?.number, // country code + phone number
		};
		Share.default
			.shareSingle(shareOptions)
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
	};

	return (
		<View style={styles.contactCon}>
			<View style={styles.imgCon}>
				<View style={styles.placeholder}>
					<Text style={styles.txt}>{item?.name?.[0]}</Text>
				</View>
			</View>

			<View style={styles.contactView}>
				<View style={styles.contactDat}>
					<Text style={styles.name}>{item?.name}</Text>
					<Text style={styles.phoneNumber}>{item?.phoneNumbers?.[0]?.number}</Text>
				</View>

				{params?.neighbourhood ? (
					<Text
						style={styles.invite}
						onPress={() => {
							Platform.OS === "android"
								? sendMsg(shareNeighbourhood)
								: onSendSMSMessage(item?.phoneNumbers?.[0]?.number, shareNeighbourhood);
						}}
					>
						+ Invite
					</Text>
				) : params?.invite ? (
					<Text
						onPress={() => {
							Platform.OS === "android"
								? sendMsg(inviteMsg)
								: onSendSMSMessage(item?.phoneNumbers?.[0]?.number, inviteMsg);
						}}
						style={styles.invite}
					>
						+ Invite
					</Text>
				) : (
					<>
						{visible ? (
							<View style={{ height: 60, marginRight: 50 }}>
								<AppLoading
									color={color?.black}
									size={10}
									visible={visible}
								/>
							</View>
						) : (
							<TouchableWithoutFeedback
								onPress={() =>
									add === "Add" ? addEmergencyContact() : removeContact()
								}
							>
								<View
									style={{
										width: "27%",
										paddingHorizontal: 20,
										alignItems: "center",
									}}
								>
									<Text
										onPress={() =>
											add === "Add" ? addEmergencyContact() : removeContact()
										}
										style={{
											color: color.black,
											paddingVertical: 10,
										}}
									>
										{add}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						)}
					</>

					// <Checkbox
					// 	value={{
					// 		id: item.id,
					// 		name: item?.name,
					// 		lastName: item?.lastName,
					// 		firstName: item?.firstName,
					// 		mobile: item?.phoneNumbers[0]?.number,
					// 	}}
					// 	accessibilityLabel="contact"
					// 	onChange={(isChecked) => {
					// 		isChecked
					// 			? setSelectedContacts((prev) => [
					// 					...prev,
					// 					{
					// 						id: item.id,
					// 						name: item?.name,
					// 						lastName: item?.lastName,
					// 						firstName: item?.firstName,
					// 						mobile: item?.phoneNumbers[0]?.number,
					// 					},
					// 			  ])
					// 			: setSelectedContacts((prev) =>
					// 					prev.filter((ele) => ele.id !== item.id)
					// 			  );
					// 		// console.warn(isChecked);
					// 		// / console.warn(emgContact);
					// 	}}
					// />
				)}

				{/* <Radio.Group
					name="myRadioGroup"
					value={emgContact}
					onChange={(nextValue) => {
						console.warn(nextValue);
						let setContact = emgContact.map(
							(ele) => ele.phoneNumber === nextValue.phoneNumber
						);
						console.warn(map);

						setEmgContact(nextValue);
					}}
				>
					<Radio
						accessibilityLabel={item?.givenName}
						value={JSON.stringify({
							givenName: item?.givenName,
							middleName: item?.middleName,
							familyName: item?.familyName,
							phoneNumber: item?.phoneNumbers[0]?.number,
						})}
					/>
				</Radio.Group> */}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	contactView: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
		alignItems: "center",
	},
	contactCon: {
		flex: 1,
		flexDirection: "row",
		padding: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: "#d9d9d9",
	},
	invite: {
		color: color.black,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: color.border,
	},

	imgCon: {},
	placeholder: {
		width: 50,
		height: 50,
		borderRadius: 25,
		overflow: "hidden",
		backgroundColor: color.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	contactDat: {
		justifyContent: "center",
		paddingLeft: 5,
	},
	txt: {
		fontSize: 18,
	},
	name: { color: color.black, fontSize: 16 },
	phoneNumber: {
		color: "#888",
	},
});

export default PhoneBookItem;
