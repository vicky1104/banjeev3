import { Input, View } from "native-base";
import React, { useState } from "react";
import { Platform, SafeAreaView, StatusBar, Keyboard } from "react-native";
import AppInput from "./ui-component/AppInput";
export default function OtpInput({
	numberOfInputs,
	onChangeInput,
	onDone,
	...rest
}) {
	const [otp, setOpt] = React.useState({});
	const inputs = new Array(numberOfInputs).fill(1).map((ele, index) => {
		return {
			refs: React.useRef(),
		};
	});

	const handleDoneOtp = React.useCallback(() => {
		let doneOtp = Object.values(otp).join("");
		if (doneOtp.length === numberOfInputs) {
			Keyboard.dismiss();
			onDone(doneOtp);
		}
	}, [otp]);

	React.useEffect(() => {
		handleDoneOtp();
		inputs[0].refs.current.focus();
		if (!rest.otp) {
			setOpt({});
		}
		return () => {
			setOpt({});
		};
	}, [rest]);

	return (
		<View>
			{inputs.map((ele, index) => (
				<Input
					w="25%"
					key={index}
					keyboardType="numeric"
					ref={inputs[index].refs}
					onKeyPress={({ nativeEvent: { key: keyValue } }) => {
						if (keyValue === "Backspace" && inputs[index - 1] && otp[index]) {
							inputs[index - 1].refs.current.focus();
						}
					}}
					value={Object.values(otp)[index] ? Object.values(otp)[index] : ""}
					maxLength={1}
					onChange={({ nativeEvent: { text } }) => {
						setOpt((prev) => ({ ...prev, [index]: text }));
						if (inputs[index + 1] && !otp[index]) {
							inputs[index + 1].refs.current.focus();
						}
						onChangeInput(text);
					}}
				/>
			))}
		</View>
	);
}
