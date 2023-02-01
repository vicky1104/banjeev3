import { Alert, StyleSheet } from "react-native";
import color from "../../constants/env/color";

export default function ConfirmModal({
	setModalVisible,
	btnLabel,
	message,
	onPress,
	title,
}) {
	Alert.alert(message, title, [
		{
			text: btnLabel,
			onPress: () => {
				onPress();
				setModalVisible(false);
			},
		},
		{
			text: "Cancel",
			onPress: () => {
				setModalVisible(false);
			},
		},
	]);
	return null;
	// const [visible, setVisible] = useState(false);

	// return (
	// 	<TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
	// 		<View
	// 			style={{
	// 				position: "absolute",
	// 				height: Dimensions.get("screen").height,
	// 				width: "100%",
	// 				zIndex: 9999,
	// 				backgroundColor: "rgba(0,0,0,0.7)",
	// 			}}
	// 		>
	// 			<View
	// 				style={{
	// 					display: "flex",
	// 					justifyContent: "center",
	// 					height: "100%",
	// 					width: "100%",
	// 				}}
	// 			>
	// 				<ImageBackground
	// 					source={require("../../../assets/EditDrawerIcon/modalBg.png")}
	// 					style={styles.container}
	// 				>
	// 					<Image
	// 						source={require("../../../assets/EditDrawerIcon/danger.png")}
	// 						style={{
	// 							width: "60%",
	// 							marginTop: 23,
	// 							height: 90,
	// 							alignSelf: "center",
	// 						}}
	// 					/>

	// 					<Text
	// 						fontSize={18}
	// 						mt={5}
	// 						mb={19}
	// 						style={{
	// 							textAlign: "center",
	// 							color: color.white,
	// 							zIndex: 89894,
	// 						}}
	// 					>
	// 						{message}
	// 					</Text>

	// 					<Text
	// 						// color="black"
	// 						style={{
	// 							zIndex: 8984,
	// 							alignSelf: "center",
	// 							textAlign: "center",
	// 							width: 180,
	// 							marginBottom: 20,
	// 							color: color.white,
	// 						}}
	// 					>
	// 						{title}
	// 					</Text>

	// 					<View style={{ alignSelf: "center", marginBottom: 10, width: "60%" }}>
	// 						<AppButton
	// 							title={"Cancel"}
	// 							onPress={() => setModalVisible(false)}
	// 						/>
	// 					</View>

	// 					<View style={{ alignItems: "center", marginBottom: 45 }}>
	// 						{visible ? (
	// 							<View style={styles.loader}>
	// 								<AppLoading
	// 									size="small"
	// 									visible={visible}
	// 									color={color.primary}
	// 								/>
	// 							</View>
	// 						) : (
	// 							<AppBorderButton
	// 								width="60%"
	// 								title={btnLabel}
	// 								onPress={() => {
	// 									onPress();
	// 									setVisible(true);
	// 								}}
	// 							/>
	// 						)}
	// 					</View>
	// 				</ImageBackground>
	// 			</View>
	// 		</View>
	// 	</TouchableWithoutFeedback>
	// );
}

const styles = StyleSheet.create({
	container: {
		elevation: 50,
		shadowColor: "grey",
		shadowOffset: {
			height: 10,
			width: 10,
		},

		borderRadius: 8,
		shadowRadius: 50,
		shadowOpacity: 0.8,
		alignSelf: "center",
		zIndex: 2,
		// height: 200,
		width: "100%",
		justifyContent: "center",
	},
	loader: {
		height: 40,
		zIndex: 999,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		width: "60%",
		borderWidth: 1,
		borderRadius: 6,
		borderColor: color.primary,
	},
});

// export default ConfirmModal;
