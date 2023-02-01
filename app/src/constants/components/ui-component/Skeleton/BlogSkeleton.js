import { HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";
import color from "../../../env/color";

function BlogSkeleton(props) {
	return (
		<View style={{ backgroundColor: color?.gradientWhite }}>
			{[1, 2, 3, 4].map((ele, i) => (
				<VStack
					key={i}
					mt={3}
					borderBottomWidth="1"
					h={200}
					_dark={{
						borderColor: "coolGray.500",
					}}
					_light={{
						borderColor: "coolGray.200",
					}}
					alignSelf="center"
					w={"97%"}
					rounded="md"
				>
					<VStack style={{ height: "100%", padding: 5 }}>
						<HStack style={{ alignItems: "center", height: "70%", width: "100%" }}>
							<Skeleton
								w={"50%"}
								h={"85%"}
								backgroundColor="coolGray.100"
								rounded="md"
							/>
							<VStack
								h="100%"
								w={"50%"}
								pl={2}
							>
								<Skeleton
									mt={3}
									h="3"
									w="100%"
									rounded="md"
								/>
								<Skeleton
									mt={3}
									h="3"
									w="100%"
									rounded="md"
								/>
								<Skeleton
									mt={3}
									h="3"
									w="70%"
									rounded="md"
								/>
							</VStack>
						</HStack>

						<Skeleton
							mt={3}
							h="3"
							w="100%"
							rounded="md"
						/>
						<Skeleton
							mt={3}
							h="3"
							w="70%"
							rounded="md"
						/>
					</VStack>
				</VStack>
			))}
		</View>
	);
}

const styles = StyleSheet.create({});

export default BlogSkeleton;
