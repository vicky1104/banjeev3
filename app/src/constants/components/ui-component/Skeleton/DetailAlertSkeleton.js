import { Center, HStack, Skeleton, Text, VStack } from "native-base";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import color from "../../../env/color";
const CARD_WIDTH = 150;

function DetailAlertSkeleton(props) {
	return (
		<View style={styles.container}>
			<Center
				w="100%"
				mt={"3"}
			>
				<HStack
					w="97.5%"
					overflow={"hidden"}
					alignSelf="center"
				>
					<VStack
						borderWidth="1"
						_dark={{
							borderColor: color?.lightGrey,
						}}
						_light={{
							borderColor: "coolGray.200",
						}}
						h={"100%"}
						w={"100%"}
						rounded="md"
						mt={3}
					>
						<Skeleton
							h={Dimensions.get("screen").height - 400}
							w={"100%"}
							rounded="md"
							startColor="coolGray.100"
						/>

						<View
							style={{
								flex: 1,
								borderRadius: 16,
								backgroundColor: color.gradientBlack,
								marginTop: -10,
								zIndex: 99,
							}}
						>
							<Skeleton.Text
								mt={2}
								rounded="md"
							/>
						</View>
					</VStack>
				</HStack>
			</Center>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: color?.gradientWhite,
		paddingBottom: 20,
		flex: 1,
	},
});

export default DetailAlertSkeleton;
