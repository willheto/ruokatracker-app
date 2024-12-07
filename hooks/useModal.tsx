import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

const useModal = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [ContentComponent, setContentComponent] = useState<React.FC | null>(null);
	const [title, setTitle] = useState<string>('');

	const openModal = ({ title, Component }: { title: string; Component: React.FC }): void => {
		setContentComponent(() => Component);
		setIsVisible(true);
		setTitle(title);
	};

	const closeModal = (): void => {
		setIsVisible(false);
		setContentComponent(null);
	};

	const ModalWrapper = () => (
		<Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
			<View style={styles.overlay}>
				<View style={styles.modalContainer}>
					{/* Modal Header with Close Button */}
					<View style={styles.header}>
						<Text style={styles.headerText}>{title}</Text>
						<TouchableOpacity onPress={closeModal} style={styles.closeButton}>
							<IconSymbol size={20} name="xmark" color="white"></IconSymbol>
						</TouchableOpacity>
					</View>

					{/* Modal Content */}
					<View style={{ padding: 10 }}>{ContentComponent ? <ContentComponent /> : null}</View>
				</View>
			</View>
		</Modal>
	);

	return { openModal, closeModal, ModalWrapper };
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContainer: {
		width: '90%',
		backgroundColor: 'rgb(21, 23, 24)',
		borderRadius: 10,
		elevation: 5,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
	closeButton: {
		padding: 5,
		borderRadius: 5,
	},
	closeButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
});

export default useModal;
