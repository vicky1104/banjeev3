import { Center, HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import color from "../../../env/color";

function NotificationSkeleton(props) {
	return (
		<View style={styles.container}>
			<Center w="100%">
				{Array(20)
					.fill("_")
					.map((ele, i) => (
						<VStack
							key={i}
							mt={3}
							w="95%"
							alignSelf={"center"}
							height={60}
							borderWidth={1}
							borderColor={color.border}
							borderRadius={8}
						>
							<HStack
								mt={2}
								ml={2}
								alignItems="center"
								space={5}
							>
								<Skeleton
									width={10}
									height={10}
									startColor="coolGray.100"
									rounded="full"
								/>

								<VStack>
									<Skeleton
										h="3"
										w="120"
										rounded="md"
									/>

									<Skeleton
										mt={2}
										h="2"
										w={Dimensions.get("screen").width - 110}
										rounded="md"
									/>
								</VStack>
							</HStack>
						</VStack>
					))}
			</Center>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default NotificationSkeleton;
