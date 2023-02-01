import { Center, HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import color from "../../../env/color";

function ContactSkeleton({ showBorder }) {
	return (
		<View style={styles.container}>
			<Center w={Dimensions.get("screen").width}>
				{Array(20)
					.fill("_")
					.map((ele, i) => (
						<VStack
							key={i}
							mt={1}
							w={showBorder ? "100%" : "95%"}
							alignSelf={"center"}
							height={"70"}
							borderWidth={1}
							borderColor={color.border}
							borderRadius={showBorder ? 0 : 8}
							justifyContent="center"
						>
							<HStack
								// mt={2}
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
										w="180"
										rounded="md"
									/>

									<Skeleton
										mt={2}
										h="2"
										w={110}
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

export default ContactSkeleton;
