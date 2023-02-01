import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Text } from "native-base";
import Lottie from "lottie-react-native";

export default function AutoFillOtpModal({ autoFillModal, manualFilling }) {
	return (
		<React.Fragment>
			<Modal
				isOpen={autoFillModal}
				// onClose={() => setModalState({ open: false })}
				size="md"
			>
				<Modal.Content maxH="212">
					<Modal.Body>
						<View style={{ flexDirection: "column", alignItems: "center" }}>
							<Text>Auto Filling One Time Password</Text>
							<Lottie
								source={require("../../../assets/loader/loader.json")}
								autoPlay
								style={{ height: 40, marginTop: 5, marginBottom: 10 }}
							/>
						</View>
					</Modal.Body>
					<Modal.Footer>
						<Button
							onPress={manualFilling}
							size="xs"
						>
							Enter OTP Manually
						</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({});
