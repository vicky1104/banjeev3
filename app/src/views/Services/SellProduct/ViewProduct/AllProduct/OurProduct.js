import { useFocusEffect } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import ProductListingSkeleton from "../../../../../constants/components/ui-component/Skeleton/ProductListingSkeleton";
import color from "../../../../../constants/env/color";
import { AppContext } from "../../../../../Context/AppContext";
import {
	deleteProductService,
	filterClassifiedService,
} from "../../../../../helper/services/Classifieds";
import { getMyDefaultNeighbourhood } from "../../../../../utils/Cache/TempStorage";
import ConfirmModal from "../../../../Others/ConfirmModal";
import OurProductItem from "./OurProductItem";
const CARD_WIDTH = Dimensions.get("screen").width / 2 - 15;

function OurProduct(props) {
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(true);
	const [deleteModal, setDeleteModal] = useState(false);

	const { profile } = useContext(AppContext);
	const { systemUserId } = profile;

	const deleteProduct = (id) => {
		setVisible(true);
		deleteProductService(id)
			.then(() => {
				setDeleteModal(false);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	};

	useFocusEffect(
		useCallback(async () => {
			await getMyDefaultNeighbourhood("neighbourhood")
				.then((defaultNH) =>
					filterClassifiedService({
						categoryId: "",
						cloudId: defaultNH?.cloudId,
						deleted: "",
						domain: "",
						fields: "",
						inactive: "",
						page: 0,
						pageSize: 0,
						sortBy: "",
						userId: systemUserId,
					})
						.then((res) => {
							setData(res.content);
							setVisible(false);
						})
						.catch((err) => console.warn(err))
				)
				.catch((err) => console.warn(err));
			return () => {
				setDeleteModal();
			};
		}, [systemUserId, visible])
	);

	return (
		<Fragment>
			{visible ? (
				<ProductListingSkeleton />
			) : data.length > 0 ? (
				<View style={{ paddingHorizontal: "2.5%", height: "100%", width: "100%" }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								justifyContent: "space-between",
								// paddingVertical: 10,
								width: "100%",
								alignSelf: "center",
								paddingBottom: 70,
							}}
						>
							{data.map((item, i) => {
								return (
									<OurProductItem
										item={item}
										key={i}
										setDeleteModal={setDeleteModal}
									/>
								);
							})}
						</View>
					</ScrollView>
				</View>
			) : (
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text
						fontSize={16}
						color={color.greyText}
					>
						You haven't upload any product to sold...!
					</Text>
				</View>
			)}
			{deleteModal && (
				<ConfirmModal
					btnLabel={"Delete"}
					title="Are you sure, you want to delete your product?"
					onPress={() => deleteProduct(deleteModal)}
					setModalVisible={setDeleteModal}
					message={"Delete product"}
				/>
			)}
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default OurProduct;
