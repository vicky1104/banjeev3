import { useFormikContext } from "formik";
import { Text } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Keyboard } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import color from "../../../../constants/env/color";

export default function UserDetailForm({
	passwordFeild,
	emailEditable,
	mobileEditable,
}) {
	const [passEye, setPassEye] = React.useState("eye-off");
	const [secureText, setSecureText] = React.useState(true);
	const { values, setFieldValue } = useFormikContext();

	const nameArr = [
		{
			title: "First Name",
			placeholder: "First Name",
			name: "firstName",
			onPress: () => console.log("firstName"),
			secureTextEntry: false,
			style: {
				// width: "50%",
				borderColor: "black",
				borderRadius: 8,
				backgroundColor: color?.lightWhite,
				color: color?.black,
				height: 40,
				paddingRight: 10,
				paddingLeft: 10,
				marginRight: 10,
			},
		},
		{
			title: "Last Name",
			placeholder: "Last Name",
			name: "lastName",
			style: {
				// width: "50%",

				backgroundColor: color?.lightWhite,
				color: color?.black,
				borderRadius: 8,
				height: 40,
				marginLeft: 10,
				paddingRight: 10,
				paddingLeft: 10,
			},
			onPress: () => console.log("LastName"),
			secureTextEntry: false,
		},
	];

	const formArr = [
		{
			title: "Username",
			placeholder: "Username",
			name: "username",
			onPress: () => console.log("UserName"),
			secureTextEntry: false,
			keyboardType: "default",
		},
		{
			title: "Email ID",
			placeholder: "Email ID",
			name: "email",
			onPress: () => console.log("Email ID"),
			secureTextEntry: false,
			keyboardType: "email-address",
			autoCapitalize: "none",
			disabled: true,
			editable: emailEditable,
		},
		{
			title: "Contact Number",
			placeholder: "Contact Number",
			name: "mobile",
			onPress: () => console.log("Contact Number"),
			secureTextEntry: false,
			keyboardType: "phone-pad",
			editable: mobileEditable,
		},
		passwordFeild
			? {
					autoCapitalize: "none",
					title: "Password",
					placeholder: "Passsword",
					name: "password",
					onPress: () => {
						if (secureText && passEye === "eye") {
							setPassEye("eye-off");
							setSecureText(!secureText);
						} else {
							setPassEye("eye");
							setSecureText(!secureText);
						}
					},
					secureTextEntry: secureText,
					keyboardType: "default",
			  }
			: {
					empty: true,
			  },
	];
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
				marginBottom: 20,
				paddingRight: 30,
			}}
		>
			<View style={{ flexDirection: "row", width: "100%" }}>
				{/* {nameArr.map((ele, index) => ( */}
				<View
					style={{ width: "50%" }}
					// key={index}
				>
					<Text style={[styles.Text, { color: color?.black }]}>First Name</Text>
					<View style={[styles.inputView]}>
						<AppInput
							shouldDismiss={true}
							autoFocus={true}
							autoCapitalize={"none"}
							value={values.firstName}
							// keyboardType={ele.keyboardType}
							onChangeText={(text) => setFieldValue("firstName", text)}
							// editable={ele.editable === false ? false : true}
							placeholder={"First Name"}
							width={"100%"}
							style={{
								// width: "50%",
								borderColor: "black",
								borderRadius: 8,
								backgroundColor: color?.lightWhite,
								color: color?.black,
								height: 40,
								paddingRight: 10,
								paddingLeft: 10,
								marginRight: 10,
							}}
							secureTextEntry={false}
						/>
					</View>
				</View>

				<View
					style={{ width: "50%" }}
					// key={index}
				>
					<Text style={[styles.Text, { color: color?.black }]}>Last Name</Text>

					<View style={[styles.inputView]}>
						<AppInput
							autoCapitalize={"none"}
							shouldDismiss={true}
							value={values.lastName}
							// keyboardType={ele.keyboardType}
							onChangeText={(text) => setFieldValue("lastName", text)}
							// editable={ele.editable === false ? false : true}
							placeholder={"Last Name"}
							width={"100%"}
							style={{
								// width: "50%",

								backgroundColor: color?.lightWhite,
								color: color?.black,
								borderRadius: 8,
								height: 40,
								marginLeft: 10,
								paddingRight: 10,
								paddingLeft: 10,
							}}
							// secureTextEntry={ele.secureTextEntry}
						/>
					</View>
				</View>
				{/* ))} */}
			</View>

			{/* ```````````````` rest feilds */}

			{formArr.map((ele, index) => {
				if (!ele.empty) {
					return (
						<View key={index}>
							<Text style={[styles.Text, { color: color?.black }]}>{ele.title}</Text>

							<View style={styles.inputView}>
								<AppInput
									shouldDismiss={true}
									autoCapitalize={"none"}
									value={values[ele.name]}
									keyboardType={ele.keyboardType}
									onChangeText={(text) => setFieldValue(ele.name, text)}
									editable={ele.editable === false ? false : true}
									placeholder={ele.placeholder}
									width="85%"
									secureTextEntry={ele.secureTextEntry}
									style={{
										height: 40,
										width: "100%",
										borderRadius: 8,
										padding: 10,
										// borderWidth: 1,
										backgroundColor: color?.lightWhite,
										color: color?.black,
									}}
								/>

								{/* {ele.name === "email" && (
									<TouchableOpacity
										onPress={() => ele.onPress()}
										style={styles.imgView}
									>
										<Feather name="edit" size={20} color={color.black} />
									</TouchableOpacity>
								)} */}

								{ele.name === "password" && (
									<TouchableOpacity
										onPress={() => ele.onPress()}
										style={styles.imgView}
									>
										<Feather
											name={passEye}
											size={20}
											color={color?.black}
										/>
									</TouchableOpacity>
								)}
							</View>
						</View>
					);
				} else return null;
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	Text: { fontSize: 14, marginTop: 20, fontWeight: "500" },
	inputView: {
		flexDirection: "row",
		display: "flex",
		marginTop: 15,
	},
	imgView: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
		marginLeft: 15,
	},
});
