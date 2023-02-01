import React, { useContext, useEffect } from "react";
import { StyleSheet, Dimensions, BackHandler } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { MainContext } from "../../../../context/MainContext";
import Comment from "../../../views/Main/Feed/Comment/Comment";
import color from "../../env/color";

function CommentBottomSheet({ commentSheetRef }) {
	return (
		<RBSheet
			customStyles={{
				container: {
					borderRadius: 20,
					backgroundColor: color?.white,
				},
			}}
			height={Dimensions.get("screen").height - 100}
			ref={commentSheetRef}
			dragFromTopOnly={false}
			closeOnDragDown={true}
			closeOnPressMask={true}
			closeOnPressBack={true}
			// keyboardAvoidingViewEnabled={true}
		>
			<Comment commentSheetRef={commentSheetRef} />
		</RBSheet>
	);
}

export default CommentBottomSheet;
