import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import color from "../../../constants/env/color";
import { listProfileUrl } from "../../../utils/util-func/constantExport";
import { Avatar, Text } from "native-base";

export default function ListProfileCard({
	onPress,
	firstName,
	lastName,
	avatarImageUrl,
}) {
	return (
		<>
			<View
				style={{
					width: "100%",
					paddingVertical: 10,
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					borderBottomWidth: 1,
					backgroundColor: color.gradientWhite,
				}}
			>
				<View
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<TouchableOpacity
						onPress={onPress}
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							width: "100%",
							height: "100%",
							paddingHorizontal: 10,
						}}
					>
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color?.primary}
							style={{
								height: 30,
								width: 30,
								borderRadius: 50,
							}}
							source={{
								uri: listProfileUrl(avatarImageUrl),
							}}
						>
							{firstName?.charAt(0)?.toUpperCase() || ""}
						</Avatar>
						<View style={{ marginHorizontal: 10 }}>
							<Text
								color={color?.black}
								fontSize={15}
							>
								{firstName || ""} {lastName || ""}
							</Text>
							{/* <Text
                color={color?.black}
                fontSize={10}
            >
                {convertTime(ele.joinedOn)}
            </Text> */}
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({});
