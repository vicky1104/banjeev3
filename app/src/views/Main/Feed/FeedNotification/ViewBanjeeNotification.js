import { useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { MainContext } from "../../../../../context/MainContext";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { getBlogApi } from "../../../../helper/services/Blogs";

function ViewBanjeeNotification(props) {
	const [visible, setVisible] = useState(true);
	const [data, setData] = useState();

	const { params } = useRoute();

	useEffect(() => {
		if (params.id) {
			getBlogApi(params.id)
				.then((res) => {
					setData(res);
					// console.warn(res);
					setVisible(false);
				})
				.catch((err) => console.error(err));
		}
	}, [params]);

	return (
		<View style={{ backgroundColor: color?.gradientWhite, flex: 1 }}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<ScrollView>
					<View style={styles.container}>
						<View style={{ flex: 1 }}>
							<Text
								color={color?.black}
								fontSize={16}
								fontWeight={"bold"}
							>
								{data.title}
							</Text>
							<Text
								mb={2}
								color={color?.black}
							>
								{data.shortDescription}
							</Text>

							<HTMLView
								TextComponent={(props) => {
									return <Text color={color?.black}>{props.children}</Text>;
								}}
								value={data?.description}
								// style={{ color: color?.black, paddingBottom: 20 }}
							/>
						</View>
					</View>
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: "2.5%",
		alignSelf: "center",
		paddingHorizontal: 10,
		paddingVertical: 20,
	},
});

export default ViewBanjeeNotification;
