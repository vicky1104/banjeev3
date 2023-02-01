import { HStack, Skeleton, VStack } from "native-base";
import React from "react";
import { Dimensions, View } from "react-native";
import color from "../../../env/color";
const card_width = Dimensions.get("screen").width / 6 + 2.3;

function CategorySkeleton(props) {
	return (
		<View style={{ backgroundColor: color?.gradientWhite }}>
			<VStack
				borderWidth="1"
				_dark={{
					borderColor: "coolGray.500",
				}}
				_light={{
					borderColor: "coolGray.200",
				}}
				h={190}
				w={"95%"}
				rounded="md"
				alignSelf="center"
				alignItems={"center"}
				justifyContent="center"
			>
				<VStack
					// borderWidth="1"
					// _dark={{
					// 	borderColor: "coolGray.500",
					// }}
					// _light={{
					// 	borderColor: "coolGray.200",
					// }}
					h={"92%"}
					w={"95%"}
					rounded="md"
					alignSelf="center"
				>
					<Skeleton
						ml={1.5}
						alignItems={"flex-start"}
						rounded="md"
						h={3}
						my={3}
						w="50%"
					/>

					<HStack
						alignItems={"center"}
						ml={1.5}
					>
						{[1, 1, 1, 1, 1].map((ele) => (
							<VStack
								// borderWidth="1"
								// _dark={{
								// 	borderColor: "coolGray.500",
								// }}
								// _light={{
								// 	borderColor: "coolGray.200",
								// }}
								h={card_width}
								w={card_width}
								rounded="md"
								alignItems={"center"}
								justifyContent="center"
							>
								<Skeleton
									rounded="md"
									h={"50%"}
									w="50%"
								/>
								<Skeleton
									rounded="md"
									h={2}
									mt={1}
									w="70%"
								/>
							</VStack>
						))}
					</HStack>
					<HStack
						alignItems={"center"}
						mt={3}
						ml={1.5}
					>
						{[1, 1, 1].map((ele) => (
							<VStack
								// borderWidth="1"
								// _dark={{
								// 	borderColor: "coolGray.500",
								// }}
								// _light={{
								// 	borderColor: "coolGray.200",
								// }}
								h={card_width}
								w={card_width}
								rounded="md"
								alignItems={"center"}
								justifyContent="center"
							>
								<Skeleton
									rounded="md"
									h={"50%"}
									w="50%"
								/>
								<Skeleton
									rounded="md"
									h={2}
									mt={1}
									w="70%"
								/>
							</VStack>
						))}
					</HStack>
				</VStack>
			</VStack>
		</View>
	);
}

export default CategorySkeleton;
