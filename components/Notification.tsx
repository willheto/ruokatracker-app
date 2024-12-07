import { View } from 'react-native';
import { ThemedText } from './ThemedText';

import { StyleSheet } from 'react-native';

export default function Notification({ message, type }: { message: string; type: 'info' | 'error' | 'success' }) {
	return (
		<View style={type === 'error' ? styles.error : type === 'success' ? styles.success : styles.info}>
			<ThemedText style={styles.message}>{message}</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	error: {
		backgroundColor: 'rgb(21, 23, 24)',
		borderColor: '#601505',
		borderWidth: 2,
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		borderLeftWidth: 7,
	},
	success: {
		backgroundColor: 'rgb(21, 23, 24)',
		borderColor: '#06402b',
		borderWidth: 2,
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		borderLeftWidth: 7,
	},
	info: {
		backgroundColor: 'rgb(21, 23, 24)',
		borderColor: '#C9621B',
		borderWidth: 2,
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		borderLeftWidth: 7,
	},
	message: {
		color: 'white',
		fontWeight: 600,
	},
});
