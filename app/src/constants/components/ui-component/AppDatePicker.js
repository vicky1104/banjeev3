import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";
import { Text } from "native-base";
import React, { memo } from "react";
import { Button, Platform, TouchableOpacity, View } from "react-native";
import { getFormatedDate } from "../../../utils/util-func/convertTime";
import color from "../../env/color";

function AppDatePicker() {
	const [open, setOpen] = React.useState(false);

	const onClose = () => {
		setOpen(false);
	};

	const {
		setFieldValue,
		values: { age },
	} = useFormikContext();

	const handleOpen = () => setOpen(true);

	const handleOnChangeEvent = (e) => {
		if (Platform.OS === "android") {
			onClose();
		}
		let date = e.nativeEvent.timestamp;
		setFieldValue("age", date);
	};

	return (
		<React.Fragment>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					onPress={handleOpen}
					style={{
						height: 40,
						paddingLeft: 23,
						borderColor: color.black,
						borderWidth: 0.5,
						width: "100%",
						borderRadius: 3,
						fontSize: 16,
						marginTop: 20,
						display: "flex",
						justifyContent: "center",
						width: "85%",
						backgroundColor: color.lightWhite,
					}}
				>
					<Text color={color.black}>{getFormatedDate(new Date(age))?.fDate}</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleOpen}>
					<MaterialCommunityIcons
						name="calendar-edit"
						size={20}
						style={{ paddingLeft: 15, paddingTop: 20 }}
						color={color?.black}
					/>
				</TouchableOpacity>
			</View>
			{open && (
				<View>
					{Platform.OS === "ios" && (
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Button
								title="Cancel"
								onPress={onClose}
							/>
							<Button
								title="Done"
								onPress={onClose}
							/>
						</View>
					)}

					<DateTimePicker
						// themeVariant={darkMode === "dark" ? "dark" : "light"}
						testID="dateTimePicker"
						mode={"date"}
						value={new Date(age)}
						display={Platform.OS === "ios" ? "inline" : "default"}
						maximumDate={getFormatedDate(age)?.limit}
						onChange={handleOnChangeEvent}
						style={{ zIndex: 1, backgroundColor: color?.lightWhite }}
					/>
				</View>
			)}
		</React.Fragment>
	);
}
export default memo(AppDatePicker);
