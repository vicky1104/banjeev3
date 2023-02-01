import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React from "react";
import { useContext } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { MainContext } from "../../../../../../context/MainContext";
import color from "../../../../../constants/env/color";
import { MarkAsReadNotification } from "../../../../../helper/services/BanjeeNotification";
import {
	BanjeeProfileId,
	profileUrl,
} from "../../../../../utils/util-func/constantExport";

function Replied({ item }) {
	const { navigate } = useNavigation();
	const {
		contents: {
			payload: {
				feedId,
				createdByUser: { avtarUrl, username, firstName, lastName, id: userId },
			},
		},
	} = item;
	const { setModalData, setOpenPostModal } = useContext(MainContext);

	function onClickNavigate() {
		setOpenPostModal(true);
		setModalData({ feedID: feedId });
		// navigate("SinglePost", { feedId: feedId });
		MarkAsReadNotification(item.id);
	}

	return (
		<TouchableWithoutFeedback onPress={onClickNavigate}>
			<View
				style={[
					styles.container,
					{
						backgroundColor: item.markAsRead ? color?.gradientWhite : "#dadaef",
						borderColor: color?.border,
					},
				]}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						// dispatch(getProfile({ profileId: userId }));
						BanjeeProfileId === userId
							? undefined
							: navigate("BanjeeProfile", { profileId: userId });
					}}
				>
					{/* <FastImage
						source={{ uri: profileUrl(avtarUrl) }}
						style={{ height: 40, width: 40, borderRadius: 20 }}
					/> */}
					<Avatar
						borderColor={color?.border}
						borderWidth={1}
						bgColor={color.gradientWhite}
						style={{ height: 40, width: 40, borderRadius: 20 }}
						source={{ uri: profileUrl(avtarUrl) }}
					>
						{firstName?.charAt(0).toUpperCase() || ""}
					</Avatar>
				</TouchableWithoutFeedback>

				<Text
					style={{ marginLeft: 20 }}
					color={item.markAsRead ? color?.black : color?.white}
				>
					<Text
						style={{ fontWeight: "bold" }}
						onPress={onClickNavigate}
					>
						{`${firstName} ${lastName} `}
					</Text>
					replied your comment.
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
		width: "95%",
		alignSelf: "center",
		borderRadius: 8,
		elevation: 4,
		height: "100%",
		borderWidth: 0.5,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
		paddingVertical: 5,
	},
});

export default Replied;
