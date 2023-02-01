import { useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import ProductListingSkeleton from "../../../../../constants/components/ui-component/Skeleton/ProductListingSkeleton";
import { filterClassifiedService } from "../../../../../helper/services/Classifieds";
import { getMyDefaultNeighbourhood } from "../../../../../utils/Cache/TempStorage";
import AllProductItem from "./AllProductItem";

function AllProduct(props) {
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [page, setPage] = useState(0);
	const [message, setMessage] = useState();
	const { params } = useRoute();

	const allProductApiCall = useCallback(async () => {
		await getMyDefaultNeighbourhood("neighbourhood")
			.then((defaultNH) => {
				if (JSON?.parse(defaultNH)?.cloudId) {
					filterClassifiedService({
						categoryId: params?.categoryID,
						cloudId: JSON?.parse(defaultNH)?.cloudId,
						deleted: "",
						domain: "",
						fields: "",
						inactive: "",
						page: page,
						pageSize: 0,
						sortBy: "",
						userId: "",
					})
						.then((res) => {
							if (res.content.length > 0) {
								setRefresh(false);
								setData((prev) => [...prev, ...res.content]);
								setVisible(false);
							} else {
								setVisible(false);
							}
						})
						.catch((err) => console.warn(err));
				} else {
					setVisible(false);
					setMessage("Join Neighbourhood to explore Products for sell inside.");
				}
			})
			.catch((err) => console.warn(err));
		return () => {};
	}, [params, page]);

	useEffect(() => {
		setData([]);
		allProductApiCall();
	}, [allProductApiCall]);

	const onRefresh = () => {
		setRefresh(true);
		if (page === 0) {
			setData([]);
			allProductApiCall();
		}
	};

	if (!visible) {
		return (
			<View style={{ paddingHorizontal: "2.5%" }}>
				{message && (
					<View
						style={{
							height: Dimensions.get("screen").height - 150,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							fontSize={16}
							color={"white"}
							textAlign="center"
						>
							{message}
						</Text>
					</View>
				)}
				<View
					style={{
						height: "100%",
						width: "100%",
					}}
				>
					<FlatList
						data={data}
						horizontal={false}
						numColumns={2}
						keyExtractor={(item) => item.id}
						refreshing={refresh}
						onRefresh={onRefresh}
						showsVerticalScrollIndicator={false}
						renderItem={({ item, i }) => {
							return <AllProductItem item={item} />;
						}}
						ListEmptyComponent={() => (
							<View
								style={{
									height: Dimensions.get("screen").height - 100,
									width: "100%",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text color={"#FFF"}>
									{refresh ? "Please wait white refreshing..!" : "No product for sell"}
								</Text>
							</View>
						)}
					/>
				</View>
			</View>
		);
	} else {
		return <ProductListingSkeleton />;
	}
}

const styles = StyleSheet.create({
	container: {},
	noProduct: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},
});

export default AllProduct;
