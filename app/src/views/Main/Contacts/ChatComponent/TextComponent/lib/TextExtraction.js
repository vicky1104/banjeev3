class TextExtraction {
	constructor(text, patterns) {
		this.text = text;
		this.patterns = patterns || [];
	}

	parse() {
		let parsedTexts = [{ children: this.text }];
		this.patterns.forEach((pattern) => {
			let newParts = [];

			const tmp = pattern.nonExhaustiveModeMaxMatchCount || 0;
			const numberOfMatchesPermitted = Math.min(
				Math.max(Number.isInteger(tmp) ? tmp : 0, 0) || Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY
			);

			let currentMatches = 0;

			parsedTexts.forEach((parsedText) => {
				if (parsedText._matched) {
					newParts.push(parsedText);
					return;
				}

				let parts = [];
				let textLeft = parsedText.children;
				let indexOfMatchedString = 0;

				let matches;
				pattern.pattern.lastIndex = 0;
				while (textLeft && (matches = pattern.pattern.exec(textLeft))) {
					let previousText = textLeft.substr(0, matches.index);
					indexOfMatchedString = matches.index;

					if (++currentMatches > numberOfMatchesPermitted) {
						// Abort if we've exhausted our number of matches
						break;
					}

					parts.push({ children: previousText });

					parts.push(
						this.getMatchedPart(pattern, matches[0], matches, indexOfMatchedString)
					);

					textLeft = textLeft.substr(matches.index + matches[0].length);
					indexOfMatchedString += matches[0].length - 1;
					// Global RegExps are stateful, this makes it operate on the "remainder" of the string
					pattern.pattern.lastIndex = 0;
				}

				parts.push({ children: textLeft });

				newParts.push(...parts);
			});

			parsedTexts = newParts;
		});

		// Remove _matched key.
		parsedTexts.forEach((parsedText) => delete parsedText._matched);

		return parsedTexts.filter((t) => !!t.children);
	}
	getMatchedPart(matchedPattern, text, matches, index) {
		let props = {};

		Object.keys(matchedPattern).forEach((key) => {
			if (
				key === "pattern" ||
				key === "renderText" ||
				key === "nonExhaustiveModeMaxMatchCount"
			) {
				return;
			}

			if (typeof matchedPattern[key] === "function") {
				// Support onPress / onLongPress functions
				props[key] = () => matchedPattern[key](text, index);
			} else {
				// Set a prop with an arbitrary name to the value in the match-config
				props[key] = matchedPattern[key];
			}
		});

		let children = text;
		if (
			matchedPattern.renderText &&
			typeof matchedPattern.renderText === "function"
		) {
			children = matchedPattern.renderText(text, matches);
		}

		return {
			...props,
			children: children,
			_matched: true,
		};
	}
}

export default TextExtraction;
