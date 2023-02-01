import { Text } from "native-base";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { Menu, MenuItem } from "react-native-material-menu";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import color from "../../env/color";
import AppFabButton from "./AppFabButton";

export default function AppMenu({ menuContent, menuColor, iconSize = 20 }) {
	const [visible, setVisible] = useState(false);

	const hideMenu = () => setVisible(false);

	const showMenu = () => setVisible(true);

	return (
		<View
			style={{
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Menu
				visible={visible}
				style={{
					left: "60%",
				}}
				animationDuration={0}
				anchor={
					<AppFabButton
						onPress={showMenu}
						size={iconSize}
						icon={
							<MaterialCommunityIcons
								name="dots-vertical"
								size={iconSize}
								color={menuColor}
							/>
						}
					/>
				}
				onRequestClose={hideMenu}
			>
				{menuContent.map((ele) => (
					<MenuItem
						style={{
							backgroundColor: color?.gradientWhite,
							paddingLeft: Platform.OS === "ios" ? 10 : 0,
						}}
						key={Math.random()}
						onPress={() => {
							ele.onPress();
							hideMenu();
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<MaterialCommunityIcons
								name={ele.icon}
								size={16}
								color={color?.gradientBlack}
							/>
							<Text
								color={color?.black}
								style={{ marginLeft: 10 }}
							>
								{ele.label}{" "}
							</Text>
						</View>
					</MenuItem>
				))}
			</Menu>
		</View>
	);
}
// import { Box, Text } from "native-base";
// import React from "react";
// import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
// import { MaterialCommunityIcons } from "react-native-vector-icons";
// import { View } from "react-native";

// export default function AppMenu({ menuContent, menuColor }) {
// 	const [visible, setVisible] = React.useState(false);

// 	return (
// 		<Box h="80%" w="90%" alignItems="flex-start">
// 			<Menu
// 				visible={visible}
// 				anchor={
// 					<MaterialCommunityIcons
// 						style={{
// 							marginRight: 10,
// 							paddingHorizontal: 5,
// 						}}
// 						onPress={() => setVisible(true)}
// 						name="dots-vertical"
// 						size={20}
// 						color={menuColor}
// 					/>
// 				}
// 			>
// 				{menuContent?.map((ele, i) => (
// 					<MenuItem
// 						onPress={() => {
// 							ele.onPress, setVisible(false);
// 						}}
// 						key={i}
// 					>
// 						<View style={{ flexDirection: "row", alignItems: "center" }}>
// 							<MaterialCommunityIcons name={ele.icon} size={16} />
// 							<Text style={{ marginLeft: 10 }}>{ele.label} </Text>
// 						</View>
// 					</MenuItem>
// 				))}
// 			</Menu>
// 		</Box>
// 	);
// }
