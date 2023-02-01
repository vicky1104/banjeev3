import { HStack, Skeleton, VStack } from "native-base";
import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
const CARD_WIDTH = Dimensions.get("screen").width / 2 - 15;

function ProductListingSkeleton(props) {
	const { darkMode } = useContext(MainContext);
	return (
		<View style={[styles.container, { backgroundColor: "#1D1D1F" }]}>
			{[1, 1].map((ele, i) => (
				<HStack
					mt={3}
					key={i}
					justifyContent={"space-between"}
				>
					<VStack
						borderWidth="1"
						_dark={{
							borderColor: "coolGray.500",
						}}
						_light={{
							borderColor: "coolGray.200",
						}}
						h={190}
						w={CARD_WIDTH}
						rounded="md"
						alignSelf="center"
					>
						<Skeleton h={110} />
						<Skeleton.Text mt={3} />
					</VStack>
					<VStack
						borderWidth="1"
						_dark={{
							borderColor: "coolGray.500",
						}}
						_light={{
							borderColor: "coolGray.200",
						}}
						h={190}
						w={CARD_WIDTH}
						rounded="md"
						alignSelf="center"
					>
						<Skeleton h={110} />
						<Skeleton.Text mt={3} />
					</VStack>
				</HStack>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: "2.5%", backgroundColor: "white" },
});

export default ProductListingSkeleton;
