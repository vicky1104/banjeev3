import { Center, HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import color from "../../../env/color";

function AlertItemSkeleton(props) {
	return (
		<View style={styles.container}>
			<Center
				w="95%"
				alignSelf={"center"}
				mt={"3"}
			>
				<View
					style={{
						borderWidth: 1,
						borderColor: color.border,
						borderRadius: 8,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: "100%",
					}}
				>
					<VStack
						w="95%"
						alignSelf={"center"}
					>
						<HStack style={{ justifyContent: "space-between", width: "100%" }}>
							<Skeleton
								h="3"
								w="200"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</HStack>
					</VStack>
					<Skeleton.Text
						lines={2}
						mt={3}
						mb={5}
						w="95%"
					/>

					<HStack mt={2}>
						<Skeleton
							h="2"
							w="100"
							rounded="md"
						/>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "65%",
								marginLeft: 25,
							}}
						>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</View>
					</HStack>
				</View>

				<View
					style={{
						borderWidth: 1,
						marginTop: 20,
						borderColor: color.border,
						borderRadius: 8,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: "100%",
					}}
				>
					<VStack
						w="95%"
						alignSelf={"center"}
					>
						<HStack style={{ justifyContent: "space-between", width: "100%" }}>
							<Skeleton
								h="3"
								w="200"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</HStack>
					</VStack>
					<Skeleton.Text
						lines={2}
						mt={3}
						w="95%"
					/>
					<Skeleton
						h={300}
						w={"100%"}
						mt={2}
					/>

					<HStack mt={2}>
						<Skeleton
							h="2"
							w="100"
							rounded="md"
						/>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "65%",
								marginLeft: 25,
							}}
						>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</View>
					</HStack>
				</View>

				<View
					style={{
						borderWidth: 1,
						marginTop: 20,
						borderColor: color.border,
						borderRadius: 8,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: "100%",
					}}
				>
					<VStack
						w="95%"
						alignSelf={"center"}
					>
						<HStack style={{ justifyContent: "space-between", width: "100%" }}>
							<Skeleton
								h="3"
								w="200"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</HStack>
					</VStack>
					<Skeleton.Text
						lines={2}
						mt={3}
						mb={5}
						w="95%"
					/>

					<HStack mt={2}>
						<Skeleton
							h="2"
							w="100"
							rounded="md"
						/>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "65%",
								marginLeft: 25,
							}}
						>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</View>
					</HStack>
				</View>

				<View
					style={{
						borderWidth: 1,
						marginTop: 20,
						borderColor: color.border,
						borderRadius: 8,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: "100%",
					}}
				>
					<VStack
						w="95%"
						alignSelf={"center"}
					>
						<HStack style={{ justifyContent: "space-between", width: "100%" }}>
							<Skeleton
								h="3"
								w="200"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</HStack>
					</VStack>
					<Skeleton.Text
						lines={2}
						mt={3}
						mb={5}
						w="95%"
					/>

					<HStack mt={2}>
						<Skeleton
							h="2"
							w="100"
							rounded="md"
						/>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "65%",
								marginLeft: 25,
							}}
						>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
							<Skeleton
								h="2"
								w="100"
								rounded="md"
							/>
						</View>
					</HStack>
				</View>
			</Center>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: color.gradientWhite },
});

export default AlertItemSkeleton;
