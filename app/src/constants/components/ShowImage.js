import { HeaderBackButton } from "@react-navigation/elements";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import color from "../env/color";
import AppFabButton from "./ui-component/AppFabButton";

function ShowImage({ image, hideModal, showBtn, closeModal }) {
	return (
		<View
			style={{
				flex: 1,
				height: "100%",
				width: "100%",
				backgroundColor: color.gradientWhite,
			}}
		>
			<SafeAreaView>
				<HeaderBackButton
					labelVisible={Platform.OS === "ios"}
					onPress={closeModal}
					style={{ marginLeft: 10 }}
					tintColor={color.black}
				/>
			</SafeAreaView>
			<View style={{ flex: 1, backgroundColor: color.gradientWhite }}>
				{image && image.length > 0 && (
					<FastImage
						source={{
							uri: image,
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.contain}
						style={{ width: "100%", height: "80%", marginTop: "10%" }}
					/>
				)}

				{showBtn && (
					<View
						style={{
							height: 70,
							width: "100%",
							backgroundColor: "purple",
							position: "absolute",
							bottom: 0,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								width: "40%",
								justifyContent: "space-evenly",
								flexDirection: "row",
							}}
						>
							<AppFabButton
								onPress={hideModal}
								size={20}
								icon={
									<FastImage
										source={require("../../../assets/EditDrawerIcon/ic_send_message_round.png")}
										style={{ height: 35, width: 35 }}
									/>
								}
							/>
							<AppFabButton
								size={20}
								icon={
									<FastImage
										source={require("../../../assets/EditDrawerIcon/ic_distructive.png")}
										style={{ height: 35, width: 35 }}
									/>
								}
							/>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ShowImage;
