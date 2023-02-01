import { Button, Text } from "native-base";
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ViewMoreText from "react-native-view-more-text";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import {
	MaterialCommunityIcons,
	AntDesign,
	Entypo,
	Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DetailNeighbourhoodContext } from "./DetailNeighbourhoodContext";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import axios from "axios";
import { showToast } from "../../../../constants/components/ShowToast";

function NeighbourhoodBusinessCard({ data }) {
	const { setConfirmLeave, setJoinNH } = useContext(DetailNeighbourhoodContext);
	const { navigate } = useNavigation();

	const systemUserId = useContext(AppContext)?.profile?.systemUserId || "";
	const firstName = useContext(AppContext)?.profile?.firstName || "";
	const lastName = useContext(AppContext)?.profile?.lastName || "";
	const mobile = useContext(AppContext)?.profile?.mobile || "";
	const email = useContext(AppContext)?.profile?.email || "";

	function renderViewMore(onPress) {
		return (
			<Text
				onPress={onPress}
				style={{ color: color?.white }}
			>
				Show more
			</Text>
		);
	}

	function renderViewLess(onPress) {
		return (
			<Text
				onPress={onPress}
				style={{ color: color?.white }}
			>
				Show less
			</Text>
		);
	}

	const handleBroadcast = () => {
		axios
			.get(
				`https://imydp54x0j.execute-api.eu-central-1.amazonaws.com/broadcast/status/${data?.id}`
			)
			.then((res) => {
				console.warn(res);

				if (res.data.data) {
					navigate("Broadcast", {
						cloudId: data?.id || "",
						name: data?.name || "",
						imageUri: data?.imageUrl || "",
						memberId: systemUserId || "",
						memberObj: {
							firstName,
							lastName,
							mobile,
							email,
						},
						isHost: false,
					});
				} else {
					if (systemUserId === "63a97673e6d4f71ef6e4cca5" || data?.admin) {
						navigate("Broadcast", {
							cloudId: data?.id || "",
							name: data?.name || "",
							imageUri: data?.imageUrl || "",
							memberId: systemUserId || "",
							memberObj: {
								firstName,
								lastName,
								mobile,
								email,
							},
							isHost: true,
						});
					} else {
						showToast(
							"Neighbourhood group call is not live. You can join after admin make it live."
						);
					}
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<View style={{ paddingBottom: 3, marginVertical: 10 }}>
			<View
				style={{
					borderRadius: 16,
					elevation: 3,
					backgroundColor: color?.gradientWhite,
					paddingVertical: 10,
					paddingHorizontal: 10,
					alignItems: "center",
				}}
			>
				<Text
					color={color?.black}
					numberOfLines={1}
				>
					{data?.name}
				</Text>

				<ViewMoreText
					numberOfLines={2}
					renderViewMore={renderViewMore}
					renderViewLess={renderViewLess}
					textStyle={{
						textAlign: "center",
						color: color?.black,
						fontSize: 14,
						opacity: 70,
						// width: "80%",
					}}
				>
					{data?.description.trim()}
				</ViewMoreText>

				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						alignItems: "center",
						width: "70%",
						alignSelf: "center",
						justifyContent: "space-between",
					}}
				>
					<View style={{ alignItems: "center" }}>
						<AppFabButton
							size={20}
							onPress={() =>
								navigate("NeighbourhoodMember", {
									cloudId: data?.id,
									cloudName: data?.name,
									member: data?.memberStatus,
								})
							}
							style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 }}
							icon={
								<Ionicons
									name={"people-outline"}
									size={20}
									color={color?.black}
								/>
							}
						/>
						<Text
							color={color?.black}
							fontSize={12}
							mt={1}
						>
							{data?.totalMembers}
						</Text>
					</View>
					<View style={{ alignItems: "center" }}>
						<AppFabButton
							size={20}
							style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 }}
							icon={
								<MaterialCommunityIcons
									name={"post-outline"}
									size={20}
									color={color?.black}
								/>
							}
						/>
						<Text
							color={color?.black}
							fontSize={12}
							mt={1}
						>
							{data?.totalPosts}
						</Text>
					</View>

					<View style={{ alignItems: "center" }}>
						<AppFabButton
							onPress={() =>
								navigate("FilterNeighbourhood", {
									cloudId: data?.id,
									cloudName: data?.name,
								})
							}
							size={20}
							style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 }}
							icon={
								<AntDesign
									name={"eyeo"}
									size={20}
									color={color?.black}
								/>
							}
						/>
						<Text
							color={color?.black}
							fontSize={12}
							mt={1}
						>
							Watch
						</Text>
					</View>

					{/* <View style={{ alignItems: "center" }}>
						<AppFabButton
							onPress={handleBroadcast}
							size={20}
							style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 }}
							icon={
								<MaterialCommunityIcons
									name="video-wireless"
									size={24}
									color={color.black}
								/>
							}
						/>
						<Text
							color={color?.black}
							fontSize={12}
							mt={1}
						>
							Call
						</Text>
					</View> */}

					<View style={{ alignItems: "center" }}>
						{data?.memberStatus === 1 ? (
							<>
								<AppFabButton
									onPress={() => setConfirmLeave(true)}
									size={20}
									style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 }}
									icon={
										<Ionicons
											name={"ios-exit-outline"}
											size={20}
											color={color?.black}
										/>
									}
								/>
								<Text
									color={color?.black}
									fontSize={12}
									mt={1}
								>
									Leave
								</Text>
							</>
						) : (
							<>
								<AppFabButton
									size={20}
									style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 }}
									icon={
										<Entypo
											name={"plus"}
											size={20}
											color={color?.black}
										/>
									}
									onPress={() => {
										setJoinNH(true);
									}}
								/>
								<Text
									color={color?.black}
									fontSize={12}
									mt={1}
								>
									Join
								</Text>
							</>
						)}
					</View>
				</View>
				<View
					style={{
						marginTop: 15,
						flexDirection: "row",
						justifyContent:
							data?.live || systemUserId === "63a97673e6d4f71ef6e4cca5"
								? "space-evenly"
								: "center",
						width: "85%",
					}}
				>
					{(data?.admin ||
						systemUserId === "63a97673e6d4f71ef6e4cca5" ||
						(data?.memberStatus === 1 && data?.live)) && (
						<Button
							style={{
								backgroundColor: color.gradientWhite,
								color: color.black,
								borderWidth: 1,
								paddingHorizontal: 15,
								paddingVertical: 10,
								borderColor: color.border,
								borderRadius: 8,
							}}
							onPress={handleBroadcast}
						>
							{(data?.admin || systemUserId === "63a97673e6d4f71ef6e4cca5") &&
							!data.live
								? "Go Live"
								: "Join Live"}
						</Button>
						// <Text
						// 	style={{
						// 		color: color.black,
						// 		borderWidth: 1,
						// 		paddingHorizontal: 15,
						// 		paddingVertical: 10,
						// 		borderColor: color.border,
						// 		borderRadius: 8,
						// 	}}
						// 	onPress={handleBroadcast}
						// >
						// 	{data?.admin || systemUserId === "63a97673e6d4f71ef6e4cca5"
						// 		? "Go Live"
						// 		: "Join Live"}
						// </Text>
					)}
					{data?.memberStatus === 1 && (
						<Text
							style={{
								color: color.black,
								borderWidth: 1,
								paddingLeft: 10,
								paddingRight: 7,
								paddingVertical: 10,
								borderColor: color.border,
								borderRadius: 8,
							}}
							onPress={() => navigate("PhoneBook", { neighbourhood: data })}
						>
							+ {"  "}Invite neighbours
						</Text>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default NeighbourhoodBusinessCard;
