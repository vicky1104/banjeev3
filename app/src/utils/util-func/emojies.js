import React from "react";
import { StyleSheet } from "react-native";
import LIKE from "../../../assets/emoji/LIKE.png";
import FastImage from "react-native-fast-image";
import LOVING from "../../../assets/emoji/LOVE.png";
import CELEBRATING from "../../../assets/emoji/CELEBRATING.png";
import NICE from "../../../assets/emoji/NICE.png";
import SAD from "../../../assets/emoji/SAD.png";
import ANGRY from "../../../assets/emoji/ANGRY.png";

export function emojies(reactionType, position, size) {
	const styles = StyleSheet.create({
		emoji: {
			height: size,
			width: size,
			borderRadius: 10,
			position: !position ? "absolute" : "relative",
			bottom: !position ? -5 : 0,
			right: !position ? -5 : 0,
		},
	});

	switch (reactionType) {
		case "LIKE": {
			return (
				<FastImage
					source={LIKE}
					style={styles.emoji}
				/>
			);
		}
		case "LOVING": {
			return (
				<FastImage
					source={LOVING}
					style={styles.emoji}
				/>
			);
		}
		case "CELEBRATING": {
			return (
				<FastImage
					source={CELEBRATING}
					style={styles.emoji}
				/>
			);
		}
		case "NICE": {
			return (
				<FastImage
					source={NICE}
					style={styles.emoji}
				/>
			);
		}
		case "SAD": {
			return (
				<FastImage
					source={SAD}
					style={styles.emoji}
				/>
			);
		}
		case "ANGRY": {
			return (
				<FastImage
					source={ANGRY}
					style={styles.emoji}
				/>
			);
		}
		default: {
			return (
				<FastImage
					source={LIKE}
					style={styles.emoji}
				/>
			);
		}
	}
}
