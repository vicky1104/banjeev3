import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View, Dimensions } from "react-native";
import AppBorderButton from "../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import color from "../../../constants/env/color";
import {
	deleteBusinessService,
	listBusinessService,
} from "../../../helper/services/BusinessCategory";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
import ConfirmModal from "../../Others/ConfirmModal";

function ListBusiness(props) {
	const { navigate } = useNavigation();
	const [data, setData] = useState();
	const [deleteModal, setDeleteModal] = useState(false);
	const [visible, setVisible] = useState(true);
	const [refresh, setRefresh] = useState(false);

	const apiCall = useCallback(() => {
		listBusinessService()
			.then((res) => {
				setRefresh(false);
				setData(res.content);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		apiCall();
	}, [apiCall]);

	function deleteBusiness(id) {
		deleteBusinessService(id)
			.then(() => {
				setVisible(true);
				setDeleteModal(false);
			})
			.catch((err) => console.warn(err));
	}
	return (
		<View style={styles.container}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<FlatList
					showsVerticalScrollIndicator={false}
					data={data}
					onRefresh={() => {
						setRefresh(true), apiCall();
					}}
					refreshing={refresh}
					keyExtractor={() => Math.random()}
					ListEmptyComponent={() => (
						<View style={styles.emptyComp}>
							<Text
								color={color?.black}
								fontSize={16}
							>
								You haven't created any business...!
							</Text>
						</View>
					)}
					renderItem={({ item }) => {
						return (
							<View style={styles.subContainer}>
								<View style={styles.row}>
									<Image
										source={{
											uri: cloudinaryFeedUrl(item.logoURL, "image"),
										}}
										style={styles.img}
									/>

									<View style={{ width: "65%" }}>
										<Text
											style={styles.name}
											numberOfLines={1}
										>
											{item.name}
										</Text>
										<Text
											numberOfLines={1}
											color={color?.subTitle}
										>
											{item.categoryName}
										</Text>
										<Text
											color={color?.black}
											textAlign={"left"}
											numberOfLines={2}
										>
											{item.address}
										</Text>
									</View>
								</View>

								<View style={styles.btnView}>
									{item.approved ? (
										<View
											style={[
												styles.row,
												{ width: "100%", justifyContent: "space-between" },
											]}
										>
											<AppButton
												title={"Manage"}
												style={{ width: 80 }}
												titleFontSize={14}
												onPress={() =>
													navigate("UpdateBusiness", {
														businessId: item.id,
													})
												}
											/>
											<AppBorderButton
												width={80}
												titleFontSize={14}
												title={"Delete"}
												onPress={() => setDeleteModal(item.id)}
											/>
										</View>
									) : (
										<View
											style={[
												styles.row,
												{ width: "100%", justifyContent: "space-between" },
											]}
										>
											<AppBorderButton
												titleFontSize={14}
												width={80}
												title={"In review"}
											/>
											<AppBorderButton
												onPress={() => setDeleteModal(item.id)}
												titleFontSize={14}
												width={80}
												title={"Delete"}
											/>
										</View>
									)}
								</View>
							</View>
						);
					}}
				/>
			)}

			<View style={styles.create}>
				<AppButton
					title={"Create Business"}
					onPress={() => navigate("CreateBusiness")}
				/>
			</View>

			{deleteModal && (
				<ConfirmModal
					btnLabel={"Delete"}
					title="Are you sure, you want to delete your Business?"
					onPress={() => deleteBusiness(deleteModal)}
					setModalVisible={setDeleteModal}
					message={"Delete business"}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: "2.5%" },
	subContainer: {
		// height: 170,
		borderWidth: 1,
		borderRadius: 8,
		marginTop: "2.5%",
		borderColor: color.border,
		backgroundColor: color?.gradientWhite,
		paddingTop: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	img: {
		height: 70,
		width: 70,
		borderRadius: 50,
		marginHorizontal: 10,
		marginTop: 10,
		borderWidth: 1,
		borderColor: color?.border,
	},
	name: {
		color: color.black,
		fontSize: 16,
		fontWeight: "bold",
	},
	btnView: {
		width: "50%",
		alignSelf: "center",
		marginVertical: 10,
	},
	create: {
		position: "absolute",
		width: 180,
		bottom: 20,
		alignSelf: "center",
		marginVertical: 10,
	},
	emptyComp: {
		justifyContent: "center",
		alignItems: "center",
		height: Dimensions.get("screen").height - 100,
		width: "100%",
	},
});

export default ListBusiness;
