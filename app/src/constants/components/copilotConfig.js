import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text } from "native-base";
import color from "../env/color";
import {
	getLocalStorage,
	setLocalStorage,
} from "../../utils/Cache/TempStorage";
import { emergencyContactListService } from "../../helper/services/AddEmergencyContactService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { memo } from "react";

const CopilotToolTip = ({
	isFirstStep,
	isLastStep,
	handleNext,
	handlePrev,
	handleStop,
	currentStep,
}) => {
	const { navigate } = useNavigation();
	const { name } = useRoute();

	const getMyEmergencyContact = async () => {
		try {
			let y = await Promise.all([
				await emergencyContactListService(),
				await getLocalStorage("EmptyEmergencyContact"),
			]);
			if (y?.[0]?.empty && !JSON.parse(y?.[1])) {
				navigate("UpdateName", { updateName: false });
			}
		} catch (err) {
			console.warn(err);
		}
	};

	const getBottom = () => {
		setLocalStorage("walkThrough1", true).then((res) => {
			emergencyContactListService()
				.then(async (res) => {
					handleStop();
					await getMyEmergencyContact();
				})
				.catch((err) => console.warn(err));
		});
	};

	const getWalkThrough3 = () => {
		setLocalStorage("walkThrough3", true).then((res) => {
			handleStop();
		});
	};

	const getWalkThrough2 = () => {
		setLocalStorage("walkThrough2", true).then((res) => {
			handleStop();
		});
	};

	const handleSkip = () => {
		if (name === "FilterNeighbourhood") {
			getWalkThrough3();
		}

		if (name === "Bottom") {
			getBottom();
		}

		if (name === "MyCloud") {
			getWalkThrough2();
		}
	};

	const handleFinish = () => {
		if (name === "FilterNeighbourhood") {
			getWalkThrough3();
		}

		if (name === "Bottom") {
			getBottom();
		}

		if (name === "MyCloud") {
			getWalkThrough2();
		}
	};

	return (
		<View style={{ marginTop: 0 }}>
			<Text color={color?.black}>{currentStep?.text}</Text>
			<Button.Group
				space={2}
				alignSelf={"flex-end"}
				padding={0}
			>
				{!isLastStep && (
					<Button
						colorScheme="rose"
						variant="ghost"
						onPress={handleSkip}
					>
						Skip
					</Button>
				)}
				{!isFirstStep && (
					<Button
						colorScheme="coolGray"
						variant="ghost"
						onPress={handlePrev}
					>
						Previous
					</Button>
				)}
				{!isLastStep && (
					<Button
						colorScheme="info"
						variant="ghost"
						onPress={handleNext}
					>
						Next
					</Button>
				)}
				{isLastStep && (
					<Button
						colorScheme="success"
						variant="ghost"
						onPress={handleFinish}
					>
						Finish
					</Button>
				)}
			</Button.Group>
		</View>
	);
};

const styles = StyleSheet.create({});

export default copilotConfig = {
	animated: true,
	overlay: "view",
	tooltipComponent: memo(CopilotToolTip),
	tooltipStyle: {
		backgroundColor: color?.drawerGrey,
		borderRadius: 10,
		padding: 10,
	},
	arrowColor: color?.drawerGrey,
};
