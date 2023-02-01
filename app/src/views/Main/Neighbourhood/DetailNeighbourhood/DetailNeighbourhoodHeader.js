import { Skeleton } from "native-base";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import color from "../../../../constants/env/color";
import DetailNHTopHeader from "./DetailNHTopHeader";
import NeighbourhoodBusinessCard from "./NeighbourhoodBusinessCard";

function DetailNeighbourhoodHeader({
	data,
	setDetailApi,
	setNeighbourhoodReport,
}) {
	return (
		<View style={styles.container}>
			{data.id ? (
				data.cloudType === "PUBLIC" ? (
					<View style={{ backgroundColor: color?.white }}>
						<DetailNHTopHeader data={data} />
						<NeighbourhoodBusinessCard
							setNeighbourhoodReport={setNeighbourhoodReport}
							data={data}
							setDetailApi={setDetailApi}
						/>
					</View>
				) : null
			) : (
				<View style={{ height: 460 }}>
					<View
						style={{ height: 300, borderColor: color?.border, borderWidth: 1 }}
					></View>

					<View style={styles.loaderContainer}>
						<Skeleton
							w={"60%"}
							h={3}
							rounded="md"
							mt={5}
						/>

						<Skeleton
							w={"40%"}
							h={2}
							rounded="md"
							mt={3}
						/>
						<View style={styles.icon}>
							{Array(4)
								.fill(0)
								.map((ele, i) => (
									<View
										key={i}
										style={{ alignItems: "center" }}
									>
										<Skeleton
											width={10}
											height={10}
											startColor="coolGray.100"
											rounded="full"
										/>

										<Skeleton
											w={10}
											h={2}
											rounded="md"
											mt={2}
										/>
									</View>
								))}
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	moreText: {
		flexDirection: "row",
		width: "80%",
		alignSelf: "center",
		marginTop: -7,
		marginBottom: 5,
		alignItems: "center",
	},
	loaderContainer: {
		borderRadius: 8,
		height: 155,
		marginTop: 5,
		marginBottom: 20,
		borderColor: color?.border,
		borderWidth: 1,
		alignItems: "center",
	},
	icon: {
		flexDirection: "row",
		marginTop: 20,
		alignItems: "center",
		width: "70%",
		alignSelf: "center",
		justifyContent: "space-between",
	},
});

export default memo(DetailNeighbourhoodHeader);
