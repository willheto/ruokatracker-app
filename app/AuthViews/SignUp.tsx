import { signUp } from '@/api/services/authService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from '@ui-kitten/components';
import { getErrorString } from '@/util/getErrorString';
import { useUser } from '@/context/UserContext';
import { SCREEN, Screen } from './AuthScreen';

export type SignUpInputs = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function SignUp({ setScreen }: { setScreen: React.Dispatch<React.SetStateAction<Screen>> }) {
	const { control, handleSubmit } = useForm<SignUpInputs>();
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { setUser } = useUser();

	const onSubmit: SubmitHandler<SignUpInputs> = async (data): Promise<void> => {
		try {
			setError(null);
			setIsSubmitting(true);
			if (data.password !== data.confirmPassword) {
				setError('Passwords do not match');
				return;
			}
			const response = await signUp(data);
			const token = response.token;
			await AsyncStorage.setItem('ruokatrackerAuthToken', token);
			setUser(response.user);
		} catch (error: any) {
			const errorString = getErrorString(error);
			setError(errorString);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Sign up</ThemedText>
			</ThemedView>

			<ThemedView style={styles.loginContainer}>
				<ThemedView>
					<ThemedText style={{ color: 'red', marginBottom: 5, marginTop: 5 }}>
						{error ? error : ' '}
					</ThemedText>
					<ThemedText type="subtitle">Email</ThemedText>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								style={{ marginTop: 10 }}
								placeholder="Email"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
						name="email"
					/>
				</ThemedView>
				<ThemedView>
					<ThemedText type="subtitle">First name</ThemedText>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								style={{ marginTop: 10 }}
								placeholder="First name"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
						name="firstName"
					/>
				</ThemedView>
				<ThemedView>
					<ThemedText type="subtitle">Last name</ThemedText>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								style={{ marginTop: 10 }}
								placeholder="Last name"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
						name="lastName"
					/>
				</ThemedView>
				<ThemedView>
					<ThemedText type="subtitle">Password</ThemedText>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								secureTextEntry={true}
								style={{ marginTop: 10 }}
								placeholder="Password"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
						name="password"
					/>
				</ThemedView>
				<ThemedView>
					<ThemedText type="subtitle">Confirm Password</ThemedText>
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								secureTextEntry={true}
								style={{ marginTop: 10 }}
								placeholder="Confirm Password"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
						name="confirmPassword"
					/>
				</ThemedView>

				<Button disabled={isSubmitting} onPress={handleSubmit(onSubmit)} style={{ marginTop: 5 }}>
					{isSubmitting ? 'Please wait...' : 'Sign up'}
				</Button>
				<View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
					<ThemedText>Already have an account? </ThemedText>
					<ThemedText
						onPress={() => {
							setScreen(SCREEN.LOGIN);
						}}
						style={{
							color: '#007AFF',
							textDecorationLine: 'underline',
						}}
					>
						Log in
					</ThemedText>
				</View>
			</ThemedView>
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	loginContainer: {
		gap: 15,
	},
});
