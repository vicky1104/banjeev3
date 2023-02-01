import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";
import color from "../../../env/color";
const CARD_WIDTH = 150;

function ProductSkeleton({ name }) {
	return (
		<View style={styles.container}>
			<Center
				w="100%"
				mt={"3"}
			>
				<View
					style={{
						flexDirection: "row",
						width: "95%",
						alignSelf: "center",
						justifyContent: "space-between",
						alignItems: "center",
						marginVertical: 10,
					}}
				>
					<Text
						fontWeight={"medium"}
						fontSize="16"
						color={color?.black}
					>
						{name}{" "}
					</Text>

					<Text
						color={color?.black}
						fontWeight={"medium"}
						style={{
							// backgroundColor: "lightgrey",
							paddingHorizontal: 10,
							paddingVertical: 5,
							borderRadius: 48,
						}}
					>
						View all
					</Text>
				</View>

				<HStack
					w="97.5%"
					overflow={"hidden"}
					alignSelf="flex-end"
				>
					{[1, 1, 1].map((ele, i) => (
						<VStack
							key={i}
							borderWidth="1"
							_dark={{
								borderColor: color?.lightGrey,
							}}
							_light={{
								borderColor: "coolGray.200",
							}}
							h={200}
							w={CARD_WIDTH}
							rounded="md"
							mr={3}
						>
							<Skeleton
								// flex="1"
								h={120}
								w={CARD_WIDTH}
								rounded="md"
								startColor="coolGray.100"
							/>
							<Skeleton.Text
								mt={2}
								rounded="md"
							/>
						</VStack>
					))}
				</HStack>
			</Center>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { backgroundColor: color?.gradientWhite, paddingBottom: 20 },
});

export default ProductSkeleton;
