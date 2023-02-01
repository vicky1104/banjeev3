import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CategorySkeleton from "../../constants/components/ui-component/Skeleton/CategorySkeleton";
import ProductSkeleton from "../../constants/components/ui-component/Skeleton/ProductSkeleton";
import {
	BusinessCategoryService,
	FilterService,
} from "../../helper/services/BusinessCategory";
import { filterClassifiedService } from "../../helper/services/Classifieds";
import { getMyDefaultNeighbourhood } from "../../utils/Cache/TempStorage";
import BuisnessNearBy from "./BuisnessNearBy";
import SellProductList from "./SellProduct/SellProductList";
import ServiceCategory from "./ServiceCategory";

import color from "../../constants/env/color";
function Services(props) {
	const { setOptions } = useNavigation();

	const [categoryData, setCategoryData] = useState([]);
	const [productData, setProductData] = useState([]);
	const [businessData, setBusinessData] = useState([]);
	const [myNH, setMyNH] = useState();

	const [categoryVisible, setCategoryVisible] = useState(true);

	const [businessVisible, setBusinessVisible] = useState(true);
	const [productVisible, setProductVisible] = useState(true);

	const solveApiCall = useCallback(async () => {
		const x = JSON.parse(await getMyDefaultNeighbourhood("neighbourhood"));

		setMyNH(x);

		setTimeout(() => {
			BusinessCategoryService({
				categoryId: null,
				categoryName: null,
				description: null,
				name: null,
				type: "LOCALBUSINESS",
			})
				.then((response1) => {
					setCategoryVisible(false);
					setCategoryData(response1.content);

					filterClassifiedService({
						categoryId: "",
						cloudId: x.cloudId,
						deleted: "",
						domain: "",
						fields: "",
						inactive: "",
						page: 0,
						pageSize: 10,
						sortBy: "",
						userId: "",
					})
						.then((response2) => {
							setProductVisible(false);
							setProductData(response2?.content);

							FilterService({
								approved: true,
								cloudId: x.cloudId,
								// sponsored: false,
							})
								.then((response3) => {
									setBusinessVisible(false);
									setBusinessData(response3?.content);
								})
								.catch((err3) => console.warn("error 3", err3));
						})
						.catch((err2) => console.warn("error 2", err2));
				})
				.catch((err1) => console.warn("error 1", err1));
		}, 200);

		// setTimeout(async () => {
		// 	Promise.all([
		// 		await BusinessCategoryService({
		// 			categoryId: null,
		// 			categoryName: null,
		// 			description: null,
		// 			name: null,
		// 			type: "LOCALBUSINESS",
		// 		}),
		// 		await filterClassifiedService({
		// 			categoryId: "",
		// 			cloudId: x.cloudId,
		// 			deleted: "",
		// 			domain: "",
		// 			fields: "",
		// 			inactive: "",
		// 			page: 0,
		// 			pageSize: 10,
		// 			sortBy: "",
		// 			userId: "",
		// 		}),
		// 		await FilterService({
		// 			approved: true,
		// 			cloudId: x.cloudId,
		// 			// sponsored: false,
		// 		}),
		// 	])
		// 		.then((res) => {
		// 			if (res?.[0]?.content) {
		// 				setCategoryVisible(false);
		// 				setCategoryData(res?.[0]?.content);
		// 			}

		// 			if (res?.[1]?.content) {
		// 				setProductVisible(false);
		// 				setProductData(res?.[1]?.content);
		// 			}
		// 			if (res?.[2]?.content) {
		// 				setBusinessVisible(false);
		// 				setBusinessData(res?.[2]?.content);
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			console.error(err);
		// 		});
		// }, 200);
	}, []);

	useFocusEffect(
		useCallback(() => {
			solveApiCall();
			return async () => {
				setCategoryData([]);
				setProductData([]);
				setBusinessData([]);
				setCategoryVisible(true);
				setProductVisible(true);
				setBusinessVisible(true);
			};
		}, [solveApiCall])
	);

	useEffect(() => {
		setOptions({
			headerTitle: () => (
				<Text
					fontSize={20}
					color={color?.black}
					fontWeight="medium"
					style={{ marginLeft: -8 }}
				>
					Services
				</Text>
			),
		});
	}, [color]);

	// <CategorySkeleton />
	// 				<ProductSkeleton name="For sell nearby" />
	// 				<ProductSkeleton name={"Business Nearby"} />

	return (
		// <LinearGradient
		// style={[
		// 	{
		// 		backgroundColor: color?.white,
		// 	},
		// 	styles.container,
		// ]}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={
		// 		darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
		// 	}
		// >
		<View
			style={[
				{
					backgroundColor: color?.white,
				},
				styles.container,
			]}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text
					fontWeight={"medium"}
					fontSize={16}
					numberOfLines={1}
					style={{
						marginLeft: 10,
						width: "100%",
						marginBottom: 10,
						paddingTop: 5,
						color: color?.black,
					}}
				>
					Explore, {myNH?.payload?.name}
				</Text>
				{categoryVisible ? (
					<CategorySkeleton />
				) : (
					<ServiceCategory data={categoryData} />
				)}
				{productVisible ? (
					<ProductSkeleton name="For sell nearby" />
				) : (
					<SellProductList data={productData} />
				)}
				{businessVisible ? (
					<ProductSkeleton name={"Business Nearby"} />
				) : (
					<BuisnessNearBy
						data={businessData}
						businessVisible={businessVisible}
					/>
				)}
				<View style={{ height: 80 }} />
			</ScrollView>
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default Services;
