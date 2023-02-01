import { useNavigation } from "@react-navigation/native";
import { Avatar } from "native-base";
import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import color from "../../../constants/env/color";
import {
	BanjeeProfileId,
	cloudinaryFeedUrl,
	listProfileUrl,
} from "../../../utils/util-func/constantExport";

function BanjeeContactProfile(props) {
	const { item } = props;
	const { navigate } = useNavigation();
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if (item?.group) {
					navigate("DetailGroup", { cloudId: item?.cloudId, name: item?.name });
				} else {
					BanjeeProfileId === item?.id
						? undefined
						: navigate("BanjeeProfile", { profileId: item?.id });
				}
			}}
		>
			<View style={styles.imgView}>
				<Avatar
					borderColor={color?.border}
					borderWidth={1}
					bgColor={color.gradientWhite}
					style={styles.img}
					source={{
						uri: item?.group
							? cloudinaryFeedUrl(item?.imageUrl, "image")
							: listProfileUrl(item?.id),
					}}
				>
					{item?.firstName?.charAt(0).toUpperCase() || item?.name?.[0] || ""}

					{props?.showStatus === true ||
						(item?.online && (
							<Avatar.Badge
								borderColor={color?.border}
								borderWidth={1}
								// style={{ borderColor: color?.gradientWhite }}
								bg="green.500"
							/>
						))}
				</Avatar>
			</View>

			{/* ------------- ACTIVE STATUS OF USER -------------- */}
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	imgView: {
		position: "relative",
		elevation: 10,
		marginHorizontal: 10,
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
	status: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: color.activeGreen,
		position: "absolute",
		bottom: 0,
		left: "10%",
		zIndex: 1,
	},
});

export default BanjeeContactProfile;

// import {useNavigation} from "@react-navigation/native";
// import {Avatar} from "native-base";
// import React from "react";
// import {View, StyleSheet, TouchableWithoutFeedback} from "react-native";
// import color from "../../../constants/env/color";
// import {listProfileUrl} from "../../../utils/util-func/constantExport";

// function BanjeeContactProfile(props) {
// 	const {profile} = props;
// 	const {firstName, username, id: userId} = profile;

// 	const {navigate} = useNavigation();
// 	return (
// 		<View style={{width: "18%"}}>
// 			<TouchableWithoutFeedback
// 				style={{zIndex: 999999}}
// 				onPress={() => {
// 					navigate("BanjeeProfile");
// 				}}
// 			>
// 				<View style={styles.imgView}>
// 					<Avatar borderColor={color?.border}
// borderWidth={1}
// 						bgColor={color.gradientWhite}
// 						style={styles.img}
// 						source={{uri: listProfileUrl(userId)}}
// 					>
// 						{firstName
// 							? firstName?.charAt(0).toUpperCase()
// 							: username
// 							? username?.charAt(0).toUpperCase()
// 							: "B"}
// 					</Avatar>

// 					{/* ------------- ACTIVE STATUS OF USER -------------- */}

// 					{/* {props?.showStatus === false ? null : (
// 						<View>{<View style={styles.status} />}</View>
// 					)} */}
// 				</View>
// 			</TouchableWithoutFeedback>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	imgView: {
// 		position: "relative",
// 		elevation: 10,
// 		height: 40,
// 		width: 40,
// 		borderRadius: 20,
// 		marginLeft: 16,
// 		shadowColor: color.black,
// 		shadowOffset: {width: 2, height: 6},
// 		shadowOpacity: 0.2,
// 		shadowRadius: 3,
// 		zIndex: 99,
// 	},
// 	img: {
// 		// borderColor: color.primary,
// 		// borderWidth: 1,
// 		height: "100%",
// 		width: "100%",
// 		borderRadius: 20,
// 	},
// 	status: {
// 		height: 8,
// 		width: 8,
// 		borderRadius: 4,
// 		backgroundColor: color.activeGreen,
// 		position: "absolute",
// 		bottom: 0,
// 		left: "10%",
// 		zIndex: 1,
// 	},
// });

// export default BanjeeContactProfile;
