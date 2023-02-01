import { useNavigation, useRoute } from "@react-navigation/native";
import { Avatar } from "native-base";
import React, { Fragment, useContext } from "react";
import { TouchableWithoutFeedback } from "react-native";
import color from "../../../../constants/env/color";
import {
	BanjeeProfileId,
	listProfileUrl,
} from "../../../../utils/util-func/constantExport";
import { AppContext } from "../../../../Context/AppContext";
export default function FeedProfile({
	item,
	name,
	clearModalData,
	handleClosePostModal,
}) {
	const { profile } = useContext(AppContext);
	const { navigate } = useNavigation();

	const navigateToPage = () => {
		handleClosePostModal(false);
		clearModalData();
		switch (true) {
			case profile?.systemUserId === item.authorId:
				navigate("Profile");
				break;

			case BanjeeProfileId === item.authorId:
				return null;

			default:
				if (name === "BanjeeProfile") {
					break;
				} else {
					navigate("BanjeeProfile", { profileId: item.authorId });
					break;
				}
		}
	};

	return (
		<Fragment>
			<TouchableWithoutFeedback onPress={navigateToPage}>
				<Avatar
					borderColor={color?.border}
					borderWidth={1}
					bgColor={color.gradientWhite}
					style={{ height: 40, width: 40, borderRadius: 20 }}
					source={{ uri: listProfileUrl(item?.authorId) }}
				>
					{item?.author?.username?.charAt(0).toUpperCase() || ""}
				</Avatar>
			</TouchableWithoutFeedback>
		</Fragment>
	);
}
