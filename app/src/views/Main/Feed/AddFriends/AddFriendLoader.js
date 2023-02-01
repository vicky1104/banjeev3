import { Skeleton } from "native-base";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

function AddFriendLoader(props) {
	return (
		<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
			{[1, 1, 1, 1, 1].map((ele, i) => {
				return (
					<View key={i}>
						<Skeleton
							h="144"
							w="101"
							borderColor="coolGray.200"
							endColor="warmGray.50"
							style={{ marginLeft: 10 }}
						/>

						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-around",
								width: 101,
								marginLeft: 10,
							}}
						>
							<Skeleton
								borderWidth={1}
								borderColor="coolGray.200"
								endColor="warmGray.50"
								size="10"
								rounded="full"
								mt="-50"
							/>
							<Skeleton
								borderWidth={1}
								borderColor="coolGray.200"
								endColor="warmGray.50"
								size="10"
								rounded="full"
								mt="-50"
							/>
						</View>
					</View>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default AddFriendLoader;
