import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import AppBorderButton from "../../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import color from "../../../../constants/env/color";
import Constants from "expo-constants";
import { AppContext } from "../../../../Context/AppContext";

function PostType(props) {
	const [anyone, setAnyone] = useState(false);
	const [nh, setNh] = useState(true);
	const { goBack, navigate } = useNavigation();
	const [selectedNeighbourhood, setSelectedNeighbourhood] = useState();
	const [data, setData] = useState();

	const { neighbourhood } = useContext(AppContext);

	useEffect(() => {
		if (neighbourhood) {
			setData(neighbourhood);
		}
	}, [neighbourhood]);

	const icon = (
		<Entypo
			name="check"
			size={24}
			color={color.activeGreen}
			style={{ marginRight: 15 }}
		/>
	);
	function select() {
		if (neighbourhood && !selectedNeighbourhood) {
			navigate("CreateFeed", {
				selectedNeighbourhood: {
					name: neighbourhood?.payload?.name,
					cloudId: neighbourhood?.cloudId,
				},
			});
		} else {
			navigate("CreateFeed", { selectedNeighbourhood });
		}
	}

	return (
		<View style={[styles.container, color?.gradientWhite]}>
			<Entypo
				onPress={() => goBack()}
				name="cross"
				size={30}
				color={color?.black}
				style={{
					// borderWidth: 1,
					marginRight: 5,
					alignSelf: "flex-end",
					marginVertical: 10,
				}}
			/>

			<ScrollView>
				<Text
					fontSize={18}
					fontWeight="medium"
					color={color?.black}
				>
					Choose who your post is visible to
				</Text>

				{/* `````````````````````````````` Joined Neighbourhood */}

				{data?.cloudId && (
					<TouchableWithoutFeedback
						onPress={() => {
							setNh(true);
							setAnyone(false);
							setSelectedNeighbourhood({
								name: data?.payload?.name,
								cloudId: data?.cloudId,
							});
						}}
					>
						<View
							style={{
								height: 50,
								borderRadius: 8,
								backgroundColor: nh ? color.lightWhite : color.white,
								marginTop: 20,
								justifyContent: "center",
								width: "100%",
								alignSelf: "flex-end",
								borderWidth: 1,
								borderColor: color?.border,
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
										color={nh ? color.black : color.border}
										style={{ marginLeft: 20, marginRight: 10 }}
									/>
									<Text
										fontSize={16}
										color={nh ? color.black : color.border}
									>
										{data?.payload?.name}
									</Text>
								</View>

								{nh && icon}
							</View>
						</View>
					</TouchableWithoutFeedback>
				)}

				<TouchableWithoutFeedback
					onPress={() => {
						setNh(false);
						setAnyone(true);

						setSelectedNeighbourhood({
							name: "Global-Feeds",
							cloudId: "62401d53e3a009309544d3e8",
						});
					}}
				>
					<View
						style={{
							marginTop: 10,
							height: 50,
							borderWidth: 1,
							borderColor: color?.border,
							borderRadius: 8,
							justifyContent: "center",
							backgroundColor: anyone ? color?.lightWhite : color?.white,
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
								<Feather
									name="globe"
									size={18}
									color={anyone ? color.black : color.border}
									style={{ marginLeft: 20, marginRight: 10 }}
								/>
								<Text
									color={anyone ? color.black : color.border}
									fontSize={16}
								>
									Anyone
								</Text>
							</View>

							{anyone && icon}
						</View>
					</View>
				</TouchableWithoutFeedback>

				<View
					style={{
						alignSelf: "center",
						width: 256,
						justifyContent: "space-between",
						marginVertical: 20,
						flexDirection: "row",
					}}
				>
					<AppBorderButton
						title={"Cancel"}
						width={120}
						onPress={() => goBack()}
					/>
					<AppButton
						title={"Select"}
						style={{ width: 120 }}
						onPress={select}
					/>
				</View>
			</ScrollView>
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: "2.5%",
		marginTop: Constants.statusBarHeight,
		flex: 1,
		// paddingTop: 50,
	},
});

export default PostType;
