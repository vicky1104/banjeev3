import { Text } from "native-base";
import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ImageBackground,
	Image,
	ScrollView,
	Dimensions,
} from "react-native";
import AppBorderButton from "./ui-component/AppBorderButton";
import AppButton from "./ui-component/AppButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { listMyNeighbourhood } from "../../helper/services/ListOurNeighbourhood";
import { useNavigation } from "@react-navigation/native";
import color from "../env/color";
import { createAlertService } from "../../helper/services/CreateAlertService";
import RBSheet from "react-native-raw-bottom-sheet";
import { showToast } from "./ShowToast";

function NeighbourhoodModal({
	setModalVisible,
	selectedNH,
	setSelectedNH,
	refRBSheet,
	data,
	setNHname,
}) {
	const [active, setActive] = useState(false);

	return (
		<View style={styles.bottomsheet}>
			<RBSheet
				customStyles={{
					container: {
						borderRadius: 10,
						backgroundColor: color.drawerGrey,
					},
				}}
				height={470}
				ref={refRBSheet}
				dragFromTopOnly={true}
				closeOnDragDown={true}
				closeOnPressMask={true}
				draggableIcon
			>
				<View style={styles.container}>
					<Text
						onPress={() => {
							if (selectedNH?.cloudId) {
								refRBSheet.current.close();
							} else {
								showToast("Please select Neighbourhood");
							}
						}}
						style={{ position: "absolute", right: 20, top: -15 }}
						color={color.white}
					>
						Select
					</Text>

					<ScrollView>
						{data?.map((ele, i) => (
							<TouchableWithoutFeedback
								onPress={() => {
									setActive(i);
									setSelectedNH({
										name: ele.payload.name,
										cloudId: ele.cloudId,
									});
									refRBSheet.current.close();
								}}
								key={i}
							>
								<View
									style={{
										height: 50,
										borderRadius: 8,
										backgroundColor: active === i ? color.primary : color.lightGrey,
										marginTop: 10,
										justifyContent: "center",
										width: "95%",
										alignSelf: "center",
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<MaterialCommunityIcons
												name="home-group"
												size={18}
												color={active === i ? color.white : color.black}
												style={{ marginLeft: 20, marginRight: 10 }}
											/>
											<Text
												fontSize={16}
												color={active === i ? color.white : color.black}
											>
												{ele.payload.name}
											</Text>
										</View>
									</View>
								</View>
							</TouchableWithoutFeedback>
						))}
					</ScrollView>
				</View>
			</RBSheet>
		</View>

		// <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
		// 	<View
		// 		style={{
		// 			position: 'absolute',
		// 			height: '100%',
		// 			width: Dimensions.get('screen').width,
		// 			zIndex: 1,
		// 			backgroundColor: 'rgba(0,0,0,0.7)',
		// 			alignItems: 'center',
		// 			justifyContent: 'center',
		// 		}}
		// 	>
		// 		<View
		// 			style={{
		// 				display: 'flex',
		// 				justifyContent: 'center',
		// 				height: '50%',
		// 				width: '100%',
		// 				alignSelf: 'center',
		// 				backgroundColor: 'white',
		// 				borderRadius: 10,
		// 			}}
		// 		>
		// <View style={styles.container}>
		// 	<ScrollView>
		// 		{data?.map((ele, i) => (
		// 			<TouchableWithoutFeedback
		// 				onPress={() => {
		// 					setActive(i);
		// 					setSelectedNH((prev) => [
		// 						...prev,
		// 						{
		// 							name: ele.payload.name,
		// 							cloudId: ele.cloudId,
		// 						},
		// 					]);
		// 				}}
		// 				key={i}
		// 			>
		// 				<View
		// 					style={{
		// 						height: 50,
		// 						borderRadius: 8,
		// 						backgroundColor: active === i ? color.primary : color.lightGrey,
		// 						marginTop: 10,
		// 						justifyContent: 'center',
		// 						width: '95%',
		// 						alignSelf: 'center',
		// 					}}
		// 				>
		// 					<View
		// 						style={{
		// 							flexDirection: 'row',
		// 							alignItems: 'center',
		// 							justifyContent: 'space-between',
		// 						}}
		// 					>
		// 						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
		// 							<MaterialCommunityIcons
		// 								name='home-group'
		// 								size={18}
		// 								color={active === i ? color.white : color.black}
		// 								style={{ marginLeft: 20, marginRight: 10 }}
		// 							/>
		// 							<Text
		// 								fontSize={16}
		// 								color={active === i ? color.white : color.black}
		// 							>
		// 								{ele.payload.name}
		// 							</Text>
		// 						</View>
		// 					</View>
		// 				</View>
		// 			</TouchableWithoutFeedback>
		// 		))}
		// 	</ScrollView>

		// <View
		// 	style={{
		// 		alignSelf: 'center',
		// 		width: 120,
		// 		marginBottom: 20,
		// 		marginTop: 20,
		// 	}}
		// >
		// 	<AppButton
		// 		title={'Select'}
		// 		onPress={() => {
		// 			setModalVisible(false);
		// 		}}
		// 	/>
		// </View>
		// 			</View>
		// 		</View>
		// 	</View>
		// </TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: { height: "100%", paddingTop: 10 },
	bottomsheet: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	// container: {
	// 	height: 48,
	// 	alignItems: "center",
	// 	flexDirection: "row",
	// },
	img: {
		height: 20,
		width: 20,
	},
	label: { color: color.white, marginLeft: 20 },
});

export default NeighbourhoodModal;
