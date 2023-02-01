import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MarkAsReadNotification } from "../../../../../helper/services/BanjeeNotification";
import { profileUrl } from "../../../../../utils/util-func/constantExport";
import color from "../../../../../constants/env/color";
import { Avatar, Text } from "native-base";
import { getProfile } from "../../../../../redux/store/action/Profile/userPendingConnection";
import { useDispatch } from "react-redux";
function AcceptRequest({ item }) {
	const {
		contents: {
			toUser: { firstName, lastName, id: userId },
		},
	} = item;
	const { navigate } = useNavigation();
	const dispatch = useDispatch();
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				navigate("BanjeeProfile", { item: { id: userId } });
				MarkAsReadNotification(item.id);
			}}
		>
			<View
				style={[
					styles.container,
					{ backgroundColor: item.markAsRead ? color.white : "#dadaef" },
				]}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						dispatch(getProfile({ profileId: userId }));
						navigate("BanjeeProfile");
					}}
				>
					<Avatar
						borderColor={color?.border}
						borderWidth={1}
						bgColor={color.gradientWhite}
						style={{ height: 40, width: 40, borderRadius: 20 }}
						source={{ uri: profileUrl(userId) }}
					>
						{firstName?.charAt(0).toUpperCase() || ""}
					</Avatar>
				</TouchableWithoutFeedback>

				<Text
					style={{ marginLeft: 20 }}
					color={item.markAsRead ? color?.black : color?.white}
					onPress={() => {
						dispatch(getProfile({ profileId: userId }));
						navigate("BanjeeProfile");
					}}
				>
					<Text
						style={{ fontWeight: "bold" }}
						onPress={() => {
							dispatch(getProfile({ profileId: userId }));
							navigate("BanjeeProfile");
						}}
					>
						{`${firstName} ${lastName} `}
					</Text>
					has accepted your friend request.
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 10,
		width: "100%",
		height: "100%",
		borderBottomWidth: 0.5,
	},
});

export default AcceptRequest;
