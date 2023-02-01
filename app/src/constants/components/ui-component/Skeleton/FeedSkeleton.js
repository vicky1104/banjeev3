import { Center, HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { View, StyleSheet } from "react-native";

function FeedSkeleton(props) {
	return (
		<View style={styles.container}>
			<Center w="100%">
				<HStack
					mt={5}
					alignItems="center"
					justifyContent={"space-between"}
					width="95%"
					alignSelf={"center"}
					paddingBottom={4}
					borderBottomWidth={1}
					_dark={{
						borderColor: "coolGray.500",
					}}
					_light={{
						borderColor: "coolGray.200",
					}}
				>
					<HStack alignItems="center">
						<Skeleton w={6} h={6} rounded="full" mr={3} />
						<Skeleton w={"150"} h={3} rounded="md" />
					</HStack>
					<Skeleton w={6} h={6} rounded="full" mr={3} />
				</HStack>

				<Skeleton
					w={"150"}
					mt={2}
					h={3}
					rounded="md"
					alignSelf={"flex-start"}
					ml={"2.5%"}
				/>

				<HStack alignSelf={"flex-start"}>
					{[1, 1, 1].map((ele, i) => (
						<VStack
							key={i}
							ml={"2.5%"}
							mt={2}
							height={150}
							width={150}
							borderRadius={8}
							borderWidth={1}
							_dark={{
								borderColor: "coolGray.500",
							}}
							_light={{
								borderColor: "coolGray.200",
							}}
							alignItems="center"
							justifyContent={"space-around"}
						>
							<VStack width={"100%"} alignItems="flex-start" px={1}>
								<Skeleton w={"95%"} h={3} mt={3} rounded="md" />
								<Skeleton w={"60%"} h={3} mt={2} rounded="md" />
							</VStack>

							<HStack
								width={"80%"}
								alignSelf="center"
								justifyContent="space-between"
							>
								<HStack width={"30%"} justifyContent="space-between">
									<Skeleton w={"40%"} h={3} mt={2} rounded="md" />
									<Skeleton w={"40%"} h={3} mt={2} rounded="md" />
								</HStack>
								<HStack width={"30%"} justifyContent="space-between">
									<Skeleton w={"40%"} h={3} mt={2} rounded="md" />
									<Skeleton w={"40%"} h={3} mt={2} rounded="md" />
								</HStack>
							</HStack>

							<Skeleton
								h={7}
								width="90%"
								alignSelf={"center"}
								borderRadius="8"
							/>
						</VStack>
					))}
				</HStack>

				<VStack mt={3} w="95%" alignSelf={"center"}>
					<HStack mt={2} alignItems="center" space={5}>
						<VStack>
							<Skeleton
								width={10}
								height={10}
								startColor="coolGray.100"
								rounded="full"
							/>
						</VStack>
						<VStack>
							<Skeleton h="3" w="100" rounded="md" />

							<HStack justifyContent={"space-between"} mt={2} w="85%">
								<Skeleton h="2" w="150" rounded="md" />
								<Skeleton h="2" w="20" rounded="md" />
							</HStack>
						</VStack>
					</HStack>

					<Skeleton w={"150"} mt={2} h={3} rounded="md" />

					<Skeleton h="320" w="100%" alignSelf={"center"} mt={2} />
				</VStack>
				<VStack mt={3} w="95%" alignSelf={"center"}>
					<HStack mt={2} alignItems="center" space={5}>
						<VStack>
							<Skeleton
								width={10}
								height={10}
								startColor="coolGray.100"
								rounded="full"
							/>
						</VStack>
						<VStack>
							<Skeleton h="3" w="100" rounded="md" />

							<HStack justifyContent={"space-between"} mt={2} w="85%">
								<Skeleton h="2" w="150" rounded="md" />
								<Skeleton h="2" w="20" rounded="md" />
							</HStack>
						</VStack>
					</HStack>

					<Skeleton w={"150"} mt={2} h={3} rounded="md" />

					<Skeleton h="1" w="100%" alignSelf={"center"} mt={2} />
				</VStack>
			</Center>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { backgroundColor: "white" },
});

export default FeedSkeleton;
