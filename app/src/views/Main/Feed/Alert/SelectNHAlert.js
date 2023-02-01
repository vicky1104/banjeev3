import { Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ScrollView,
} from 'react-native';
import { listMyNeighbourhood } from '../../../../helper/services/ListOurNeighbourhood';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import color from '../../../../constants/env/color';
import AppButton from '../../../../constants/components/ui-component/AppButton';
function SelectNHAlert(props) {
	const [active, setActive] = useState(false);
	const { goBack, navigate } = useNavigation();
	const [selectedNeighbourhood, setSelectedNeighbourhood] = useState();
	const [data, setData] = useState([]);

	useEffect(() => {
		listMyNeighbourhood()
			.then((res) => {
				setData(res);
			})
			.catch((err) => {
				console.error('listMyAllNeighbourhood', err);
			});
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView>
				{data?.map((ele, i) => (
					<TouchableWithoutFeedback
						onPress={() => {
							setActive(i);
							setSelectedNeighbourhood({
								name: ele.payload.name,
								cloudId: ele.cloudId,
							});
						}}
						key={i}
					>
						<View
							style={{
								height: 50,
								borderRadius: 8,
								backgroundColor: active === i ? color.primary : color.lightGrey,
								marginTop: 10,
								justifyContent: 'center',
								width: '95%',
								alignSelf: 'center',
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<MaterialCommunityIcons
										name='home-group'
										size={18}
										color={active === i ? color.white : color.black}
										style={{ marginLeft: 20, marginRight: 10 }}
									/>
									<Text
										fontSize={16}
										color={active === i ? color.white : color.black}
									>
										{ele.payload.name}
									</Text>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				))}
			</ScrollView>

			<View
				style={{ alignSelf: 'center', width: 120, marginBottom: 20, marginTop: 20 }}
			>
				<AppButton title={'Create'} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default SelectNHAlert;
