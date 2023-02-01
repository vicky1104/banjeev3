import { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
	actions,
	RichEditor,
	RichToolbar,
} from "react-native-pell-rich-editor";
import { MainContext } from "../../../../../context/MainContext";
import color from "../../../../constants/env/color";

export default function Editor({
	value,
	setFieldValue,
	openMediaModal,
	setEditorImageBase64Data,
	editorImageBase64Data,
}) {
	const richText = useRef();

	const richTextHandle = (descriptionText) => {
		setFieldValue(descriptionText);
	};

	useEffect(() => {
		if (editorImageBase64Data) {
			richText.current.insertHTML(
				`<img src="data:image/png;base64,${editorImageBase64Data}" style="aspect-ratio:1;" />`
			);
		}
		return () => {
			setEditorImageBase64Data(false);
		};
	}, [editorImageBase64Data]);

	return (
		<SafeAreaView
			edges={["bottom", "left", "right"]}
			style={{ flex: 1, zIndex: 50 }}
		>
			<View style={styles.container}>
				<View style={styles.richTextContainer}>
					<RichEditor
						containerStyle={{ width: "100%" }}
						ref={richText}
						initialContentHTML={value}
						onChange={richTextHandle}
						placeholder="Write your cool content here :)"
						androidHardwareAccelerationDisabled={true}
						style={[styles.richTextEditorStyle, { backgroundColor: "red" }]}
						initialHeight={250}
					/>

					<RichToolbar
						editor={richText}
						onPressAddImage={(d) => {
							openMediaModal();
						}}
						actions={[
							actions.insertImage,
							actions.setBold,
							actions.setItalic,
							actions.insertBulletsList,
							actions.insertOrderedList,
							actions.insertLink,
							actions.setStrikethrough,
							actions.setUnderline,
							actions.removeFormat,
							actions.checkboxList,
							actions.undo,
							actions.redo,
						]}
						style={[
							styles.richTextToolbarStyle,
							{ backgroundColor: color?.lightWhite },
						]}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		alignItems: "center",
	},

	headerStyle: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 10,
	},

	htmlBoxStyle: {
		height: 330,
		width: 330,
		borderRadius: 10,
		padding: 20,
		marginBottom: 10,
	},

	richTextContainer: {
		display: "flex",
		flexDirection: "column-reverse",
		width: "100%",
		marginBottom: 10,
	},

	richTextEditorStyle: {
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderWidth: 1,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		fontSize: 20,
	},

	richTextToolbarStyle: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderWidth: 1,
	},

	errorTextStyle: {
		color: "#FF0000",
		marginBottom: 10,
	},

	saveButtonStyle: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		width: "25%",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		fontSize: 20,
	},

	textButtonStyle: {
		fontSize: 18,
		fontWeight: "600",
	},
});
