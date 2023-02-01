import React from "react";
import { Text } from "react-native";
import AppDatePicker from "../../../../constants/components/ui-component/AppDatePicker";
import color from "../../../../constants/env/color";

export default function DOB({ onChange, value }) {
	return (
		<React.Fragment>
			<Text
				style={{
					marginTop: 20,
					marginBottom: -10,
					fontWeight: "500",
					fontSize: 14,
					color: color?.black,
				}}
			>
				Date Of Birth
			</Text>

			<AppDatePicker />
		</React.Fragment>
	);
}
