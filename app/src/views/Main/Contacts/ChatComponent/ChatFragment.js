import { View } from "react-native";
import React from "react";
import RenderMedia from "./RenderMedia";
import RenderCall from "./RenderCall";

export default function ChatFragment({ chatContent, setLoading }) {
	return (
		<View
			style={{
				paddingHorizontal: 10,
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{chatContent?.content.type === "OTHER" ? (
				<RenderCall chatContent={chatContent} />
			) : (
				<View style={{}}>
					<RenderMedia
						setLoading={setLoading}
						messId={chatContent?.id}
						chatContent={chatContent}
					/>
				</View>
			)}
		</View>
	);
}
