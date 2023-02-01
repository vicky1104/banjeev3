import { Avatar, Checkbox, Text } from "native-base";
import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import color from "../../../../constants/env/color";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";

function SearchBanjeeForNeighbourhoodItem({
	item,
	setGroupValues,
	selectedMembers,
}) {
	return (
		<Fragment>
			<View
				style={{
					height: 60,
					backgroundColor: color?.gradientWhite,
					flexDirection: "row",
					alignItems: "center",
					width: "85%",
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
						source={{ uri: listProfileUrl(item?.systemUserId) }}
					>
						{item?.firstName?.charAt(0).toUpperCase() || ""}
					</Avatar>
				</View>

				<View
					style={{
						justifyContent: "center",
						marginHorizontal: 5,
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
			</View>
			<View style={{ width: "15%", alignItems: "center" }}>
				<Checkbox
					defaultIsChecked={selectedMembers}
					onChange={(e) =>
						e
							? setGroupValues((prev) => [
									...prev,
									{
										avtarUrl: item.avtarUrl,
										email: item.email,
										firstName: item.firstName,
										id: item.systemUserId,
										lastName: item.lastName,
										mcc: item.mcc,
										mobile: item.mobile,
										systemUserId: item.systemUserId,
										username: item.username,
									},
							  ])
							: setGroupValues((prev) =>
									prev.filter((ele) => ele.systemUserId !== item.systemUserId)
							  )
					}
					accessibilityLabel={item?.username}
					value={{
						avtarUrl: item.avtarUrl,
						email: item.email,
						firstName: item.firstName,
						id: item.systemUserId,
						lastName: item.lastName,
						mcc: item.mcc,
						mobile: item.mobile,
						systemUserId: item.systemUserId,
						username: item.username,
					}}
					my={2}
				></Checkbox>
			</View>
		</Fragment>
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
		shadowColor: color.black,
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

export default SearchBanjeeForNeighbourhoodItem;
