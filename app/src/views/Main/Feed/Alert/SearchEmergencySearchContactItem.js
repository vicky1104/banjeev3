import { Avatar, Text } from "native-base";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import {
	addEmergencyContactService,
	deleteEmergencyContact,
} from "../../../../helper/services/AddEmergencyContactService";
import { profileUrl } from "../../../../utils/util-func/constantExport";

function SearchEmergencySearchContactItem({ item }) {
	const [add, setAdd] = useState("Add");
	const [visible, setVisible] = useState(false);
	function addEmergencyContact() {
		setVisible(true);

		const {
			avtarUrl,
			domain,
			firstName,
			lastName,
			locale,
			mcc,
			mobile,
			realm,
			ssid,
			systemUserId,
			username,
		} = item;
		// console.warn("noremal mcc", mcc);

		// console.warn(mcc.includes("+") ? mcc : `+${mcc}`, "mccccc");
		addEmergencyContactService({
			avtarUrl,
			domain,
			firstName,
			lastName,
			locale,
			mcc: mcc.includes("+") ? mcc : `+${mcc}`,
			mobile,
			realm,
			ssid,
			systemUserId,
			username,
		})
			.then((res) => {
				setVisible(false);
				if (res) {
					setAdd("Remove");
				} else {
					showToast("You can add only 3 emergency contact.");
				}
			})
			.catch((err) => console.warn(err));
	}

	function removeContact(id) {
		Alert.alert("Delete Contact", "Are you sure, you want to delete contact", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "default",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					setVisible(true);
					deleteEmergencyContact(item.systemUserId)
						.then((res) => {
							console.warn(res, "response");
							setVisible(false);
							setAdd("Add");
						})
						.catch((err) => console.warn(err));
				},
			},
		]);
	}

	return (
		<View
			style={{
				height: 60,
				backgroundColor: color?.gradientWhite,
				flexDirection: "row",
				alignItems: "center",
				borderBottomWidth: 1,
				borderColor: color?.gradientBlack,
				width: "100%",
				paddingHorizontal: "2.5%",
				alignSelf: "center",
			}}
		>
			<View style={styles.imgView}>
				<Avatar
					borderColor={color?.border}
					borderWidth={1}
					bgColor={color.gradientWhite}
					style={styles.img}
					source={{ uri: profileUrl(item?.avtarUrl) }}
				>
					{item?.firstName?.charAt(0).toUpperCase() || ""}
				</Avatar>
			</View>
			<View
				style={{
					justifyContent: "center",
					marginHorizontal: 5,
					width: "70%",
				}}
			>
				<Text
					fontSize={16}
					numberOfLines={1}
					color={color?.black}
				>
					{item?.firstName} {item?.lastName}
				</Text>
				<Text color={color.greyText}>
					{item?.username ? `@${item?.username}` : ""}
				</Text>
			</View>
			<View
				style={{
					width: "17%",
					justifyContent: "flex-end",
					alignItems: "center",
				}}
			>
				{visible ? (
					<View style={{ height: 60, marginRight: 25 }}>
						<AppLoading
							color={color?.black}
							size={10}
							visible={visible}
						/>
					</View>
				) : (
					<Text
						fontSize={16}
						onPress={() => {
							add === "Add" ? addEmergencyContact() : removeContact(item);
						}}
						color={color?.black}
					>
						{add}
					</Text>
				)}
			</View>
		</View>
	);
}

//  		                    633e5fe9a1ad463e7135b6bd

const styles = StyleSheet.create({
	container: {},
	imgView: {
		position: "relative",
		elevation: 10,
		height: 40,
		width: 40,
		borderRadius: 20,
		shadowColor: color.white,
		shadowOffset: { width: 2, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		zIndex: 99,
	},
	img: {
		// borderColor: color.primary,
		// borderWidth: 1,
		height: "100%",
		width: "100%",
		borderRadius: 20,
	},
});

export default SearchEmergencySearchContactItem;
