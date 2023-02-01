import { useNavigation, StackActions } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useContext, useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import { showToast } from "../../../constants/components/ShowToast";
import AppButton from "../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import OverlayDrawer from "../../../constants/components/ui-component/OverlayDrawer";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { switchNeighbourhoodService } from "../../../helper/services/ListOurNeighbourhood";
import { setMyDefaultNeighbourhood } from "../../../utils/Cache/TempStorage";

function SwitchNeighbourhood({
	openModal,
	setJoinNH,
	setOpenModal,
	toBeJoinNH,
}) {
	const { neighbourhood, setNeighbourhood } = useContext(AppContext);
	const { dispatch } = useNavigation();
	const [loader, setLoader] = useState(false);

	function switchNH() {
		setLoader(true);

		switchNeighbourhoodService({
			newCloud: toBeJoinNH?.id,
			oldCloud: neighbourhood.cloudId,
		})
			.then(async (res) => {
				setLoader(false);
				setOpenModal(false);
				if (setJoinNH) {
					setJoinNH(false);
				}
				await setMyDefaultNeighbourhood("neighbourhood", res);
				setNeighbourhood(res);
				showToast(`Welcome to ${res?.payload?.name}`);
				dispatch(
					StackActions.replace("Bottom", {
						neighbourhood: res,
					})
				);
			})
			.catch((err) => console.warn(err));
	}
	return (
		<React.Fragment>
			<OverlayDrawer
				transparent
				visible={openModal}
				onClose={() => {
					setOpenModal(false);
					if (setJoinNH) {
						setJoinNH(false);
					}
				}}
				closeOnTouchOutside
				animationType="fadeIn"
				containerStyle={{
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					padding: 0,
					height: "100%",
					width: "100%",
				}}
				childrenWrapperStyle={{
					width: "80%",
					alignSelf: "center",
					borderRadius: 4,
					height: 250,
					padding: 0,
					margin: 0,
				}}
				animationDuration={100}
			>
				{(hideModal) => (
					<View
						style={{
							backgroundColor: color?.gradientWhite,
							width: "100%",
							height: "100%",
							alignItems: "center",
							paddingVertical: 20,
							paddingHorizontal: 5,
						}}
					>
						<Text
							color={color.black}
							fontSize={18}
							fontWeight="medium"
						>
							Switch Neighbourhood
						</Text>

						<Text
							mt={5}
							color={color.black}
							fontSize={15}
							textAlign="center"
							opacity={80}
						>
							You are alerady member of{" "}
							<Text fontWeight={"bold"}>{neighbourhood?.payload?.name}</Text>{" "}
							neighbourhood
						</Text>

						<Text
							mt={1}
							color={color.black}
							fontSize={15}
							opacity={80}
							textAlign="center"
						>
							Switch below to join <Text fontWeight={"bold"}>{toBeJoinNH?.name}</Text>{" "}
							instead.
						</Text>

						<View
							style={{
								flexDirection: "row",
								// alignItems: "center",
								marginTop: 20,
								width: "70%",
								marginHorizontal: 5,
								alignSelf: "flex-start",
							}}
						>
							{loader ? (
								<View
									style={{
										marginLeft: 50,
										height: "100%",
										width: "100%",
										marginTop: 10,
									}}
								>
									<AppLoading
										visible={true}
										size={"small"}
									/>
								</View>
							) : (
								<AppButton
									title="Switch"
									onPress={switchNH}
								/>
							)}
						</View>
					</View>
				)}
			</OverlayDrawer>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({});

export default SwitchNeighbourhood;
