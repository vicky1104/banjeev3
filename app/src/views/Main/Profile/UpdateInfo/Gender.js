import { useFormikContext } from "formik";
import React from "react";
// import AppRadioButtons from "../../../Components/AppComponents/AppRadioButtons";
import { Radio, Text } from "native-base";
import color from "../../../../constants/env/color";

export default function Gender() {
	const { setFieldValue, values } = useFormikContext();

	return (
		<React.Fragment>
			<Text
				style={{
					marginBottom: 10,
					fontWeight: "500",
					fontSize: 14,
					color: color?.black,
				}}
			>
				Gender
			</Text>

			<Radio.Group
				name="gender"
				value={values.gender}
				onChange={(nextValue) => {
					// console.log(nextValue);
					setFieldValue("gender", nextValue);
				}}
			>
				<Radio
					value="Male"
					my={2}
				>
					<Text color={color?.black}>Male</Text>
				</Radio>
				<Radio
					value="Female"
					my={2}
				>
					<Text color={color?.black}>Female</Text>
				</Radio>
				<Radio
					value="Rather not to say"
					my={2}
				>
					<Text color={color?.black}>Rather not to say</Text>
				</Radio>
			</Radio.Group>

			{/* <AppRadioButtons
				PROP={[
					{ key: "Male", text: "Male" },
					{ key: "Female", text: "Female" },
					{ text: "I`d rather not to say", key: "Others" },
				]}
				value={values.gender}
				onChange={(e) => {
					setFieldValue("gender", e.key);
				}}
			/> 
			*/}
		</React.Fragment>
	);
}
