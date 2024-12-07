import { Input } from '@/components/Input';
import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@ui-kitten/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Notification from '@/components/Notification';
import { getErrorString } from '@/util/getErrorString';
import { logWeight } from '@/api/services/weightService';
import { useUser } from '@/context/UserContext';

export default function LogWeight({ navigation }: { navigation: any }) {
	const { control, handleSubmit } = useForm();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { updateWeightLog } = useUser();

	const onSubmit = async (data: any) => {
		setIsSubmitting(true);
		try {
			const response = await logWeight(Number(data.weight));
			updateWeightLog(response.weightLog);
			navigation.navigate('Home', { screen: 'Dashboard' });
		} catch (e) {
			console.error(e);
			const errorMessage = getErrorString(e);
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<PageView>
			<View style={styles.pageContainer}>
				<View style={{ gap: 5 }}>
					{error && <Notification message={error} type="error" />}

					<ThemedText style={{ fontWeight: 600 }}>Weight (kgs)</ThemedText>
					<Input name="weight" control={control} required="Weight is required" isDisabled={false} isNumeric />
				</View>
				<Button disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
					{isSubmitting ? 'Please wait...' : 'Log weight'}
				</Button>
			</View>
		</PageView>
	);
}

const styles = StyleSheet.create({
	pageContainer: {
		padding: 20,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
	},
});
