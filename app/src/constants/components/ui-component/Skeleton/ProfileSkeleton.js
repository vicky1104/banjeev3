import { Center, HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";
import color from "../../../env/color";

function ProfileSkeleton(props) {
	return (
		<View style={styles.container}>
			<Center
				w="100%"
				// mt={"3"}
			>
				<View
					style={{
						width: "95%",
						alignSelf: "center",
						height: 180,
						alignItems: "center",
						justifyContent: "center",
						marginVertical: 10,
						borderWidth: 1,
						borderColor: color.border,
						padding: 1,
						borderRadius: 12,
					}}
				>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 20,
						}}
					>
						<Skeleton
							width={100}
							height={100}
							startColor="coolGray.100"
							rounded="full"
							mr={3}
						/>
						<VStack flex={1}>
							<Skeleton.Text />
						</VStack>
					</View>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							alignItems: "center",
							paddingLeft: 20,
							width: "100%",
							marginTop: 20,
						}}
					>
						<Skeleton
							h={3}
							borderRadius={50}
							width={100}
						/>
						<Skeleton
							h={45}
							borderBottomStartRadius={20}
							borderTopStartRadius={20}
							overflow="hidden"
							width={"50%"}
						/>
					</View>
				</View>
				<View
					style={{
						height: 50,
						width: "100%",
						justifyContent: "center",
						paddingLeft: "4%",
						borderTopWidth: 1,
						borderBottomWidth: 1,
						borderColor: color.border,
					}}
				>
					<Skeleton
						rounded={"md"}
						h={3}
						width={150}
					/>
				</View>
				<VStack
					mt={3}
					w="95%"
					alignSelf={"center"}
				>
					<HStack
						mt={2}
						alignItems="center"
						space={5}
					>
						<VStack>
							<Skeleton
								width={10}
								height={10}
								startColor="coolGray.100"
								rounded="full"
							/>
						</VStack>
						<VStack>
							<Skeleton
								h="3"
								w="100"
								rounded="md"
							/>

							<HStack
								justifyContent={"space-between"}
								mt={2}
								w="82%"
							>
								<Skeleton
									h="2"
									w="150"
									rounded="md"
								/>
								<Skeleton
									h="2"
									w="20"
									rounded="md"
								/>
							</HStack>
						</VStack>
					</HStack>
				</VStack>

				<Skeleton.Text
					mt={3}
					w="95%"
				/>

				<Skeleton
					h="181"
					w="95%"
					mt={2}
				/>

				<VStack
					mt={3}
					w="95%"
					alignSelf={"center"}
				>
					<HStack
						mt={5}
						alignItems="center"
						space={5}
					>
						<VStack>
							<Skeleton
								width={10}
								height={10}
								startColor="coolGray.100"
								rounded="full"
							/>
						</VStack>
						<VStack>
							<Skeleton
								h="3"
								w="100"
								rounded="md"
							/>

							<HStack
								justifyContent={"space-between"}
								mt={2}
								w="82%"
							>
								<Skeleton
									h="2"
									w="150"
									rounded="md"
								/>
								<Skeleton
									h="2"
									w="20"
									rounded="md"
								/>
							</HStack>
						</VStack>
					</HStack>
				</VStack>

				<Skeleton.Text
					mt={3}
					w="95%"
				/>
			</Center>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: color?.gradientWhite },
});

export default ProfileSkeleton;
