import { Avatar, Text } from "native-base";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { deleteEmergencyContact } from "../../../../helper/services/AddEmergencyContactService";
import { profileUrl } from "../../../../utils/util-func/constantExport";

function EmergencyContactListItem({ item, apicall }) {
	const [deleteContact, setDeleteContact] = useState(false);

	function removeEmergencyContact() {
		Alert.alert(
			"Delete Contact",
			"Are you sure, you want to remove emergency contact",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "default",
				},
				{
					text: "Remove",
					style: "destructive",
					onPress: () => {
						setDeleteContact(true);
						deleteEmergencyContact(item.id)
							.then((res) => {
								console.warn(res, "response");
								setDeleteContact(false);
								apicall();
							})
							.catch((err) => console.warn(err));
					},
				},
			]
		);
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
				width: "95%",
				alignSelf: "center",
			}}
		>
			<View style={styles.imgView}>
				<Avatar
					borderColor={color?.border}
					borderWidth={1}
					bgColor={color.gradientWhite}
					style={styles.img}
					source={{
						uri: profileUrl(item?.avtarUrl),
					}}
				>
					{item?.userObject?.firstName?.charAt(0).toUpperCase() || ""}
				</Avatar>
			</View>
			<View
				style={{
					justifyContent: "center",
					marginHorizontal: 5,
					width: "68%",
				}}
			>
				<Text
					fontSize={16}
					numberOfLines={1}
					color={color?.black}
				>
					{item?.userObject?.firstName} {item?.userObject?.lastName}
				</Text>
				<Text color={color.greyText}>
					{item?.userObject?.username ? `@${item?.userObject?.username}` : ""}
				</Text>
			</View>

			<View style={{ width: "14%", alignItems: "center" }}>
				{deleteContact ? (
					<View style={{ height: 60, marginRight: 25 }}>
						<AppLoading
							color={color?.black}
							size={10}
							visible={deleteContact}
						/>
					</View>
				) : (
					<Text
						fontSize={16}
						color={color?.black}
						onPress={removeEmergencyContact}
					>
						Delete
					</Text>
				)}
			</View>
		</View>
	);
}

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

export default EmergencyContactListItem;
