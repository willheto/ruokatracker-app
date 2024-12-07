import { Input } from '@/components/Input';
import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Notification from '@/components/Notification';
import { PieChart } from 'react-native-gifted-charts';
import { useUser } from '@/context/UserContext';
import { Button } from '@ui-kitten/components';
import { useState } from 'react';
import { setGoal } from '@/api/services/dailyNutrientsGoalService';

type GoalInputs = {
	calories: number;
};

export const head = {
	title: 'Dashboard - My App', // Custom title for this page
};

const SetGoal = ({ navigation }: { navigation: any }) => {
	const { user, updateGoal } = useUser();
	const {
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<GoalInputs>({
		defaultValues: {
			calories: 0,
		},
	});

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const onSubmit = async (data: GoalInputs) => {
		setIsSubmitting(true);
		const { proteinGoal, fatGoal, carbsGoal } = getNutritionGoal();

		try {
			const response = await setGoal({
				protein: proteinGoal,
				fat: fatGoal,
				carbs: carbsGoal,
			});

			updateGoal(response.dailyNutrientsGoal);
			navigation.navigate('Home', { screen: 'Dashboard' });
		} catch (e) {
			console.error(e);
		} finally {
			setIsSubmitting(false);
		}
	};

	const proteinRanges = {
		who: [0.8, 0.8],
		bulk: [1.6, 2.2],
		maintenance: [1.6, 2.2],
		cut: [1.8, 2.7],
	};

	const weight = user?.weight || 0;
	const proteinPerKg = 1.9;
	const fatPercentage = 0.25;

	const getNutritionGoal = () => {
		const calorieGoal = watch('calories');
		const proteinGoal = Math.round(proteinPerKg * weight);
		const fatGoal = Math.round((calorieGoal * fatPercentage) / 9);
		const carbsGoal = Math.round((calorieGoal - proteinGoal * 4 - fatGoal * 9) / 4);

		return {
			proteinGoal,
			fatGoal,
			carbsGoal,
		};
	};

	const getPieValues = () => {
		const { proteinGoal, fatGoal, carbsGoal } = getNutritionGoal();

		return [
			{ value: proteinGoal, color: '#549E14' },
			{ value: carbsGoal, color: '#018EC1' },
			{ value: fatGoal, color: '#E26F0B' },
		];
	};

	return (
		<PageView>
			<View style={styles.pageContainer}>
				<Notification
					message="Here you can set up a daily nutrition goal for yourself. Start by specifying your target calorie count."
					type="info"
				/>
				<View style={{ gap: 5 }}>
					<ThemedText style={{ fontWeight: 600 }}>Calorie goal per day (kcal)</ThemedText>
					<Input
						name="calories"
						control={control}
						required="You need to fill calories to save goal"
						isDisabled={false}
						placeholder="> 1000kcal"
						isNumeric
					/>
				</View>

				{watch('calories') >= 1000 && (
					<>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginTop: 20,
							}}
						>
							<View>
								<ThemedText style={{ fontWeight: 600, marginBottom: 5 }}>
									Nutrition breakdown
								</ThemedText>
								<View
									style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
								>
									<ThemedText style={{ fontWeight: 600 }}>Protein: </ThemedText>
									<ThemedText style={{ fontWeight: 600 }}>
										{(proteinPerKg * weight).toFixed(0)}g
									</ThemedText>
								</View>
								<View
									style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
								>
									<ThemedText style={{ fontWeight: 600 }}>Fat: </ThemedText>
									<ThemedText style={{ fontWeight: 600 }}>
										{((watch('calories') * fatPercentage) / 9).toFixed(0)}g
									</ThemedText>
								</View>
								<View
									style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
								>
									<ThemedText style={{ fontWeight: 600 }}>Carbs: </ThemedText>
									<ThemedText style={{ fontWeight: 600 }}>
										{(
											(watch('calories') -
												proteinPerKg * weight * 4 -
												((watch('calories') * fatPercentage) / 9) * 9) /
											4
										).toFixed(0)}
										g
									</ThemedText>
								</View>
							</View>
							<View>
								<PieChart
									donut
									showText
									textColor="white"
									radius={80}
									innerRadius={40}
									textBackgroundColor="white"
									data={getPieValues()}
									backgroundColor="rgb(21, 23, 24)"
								/>
							</View>
						</View>
						{renderLegendComponent({
							...getNutritionGoal(),
						})}
						<Notification
							message="Here is our suggestion for your daily nutrition goal. You can adjust the values if you want."
							type="info"
						/>
						<Button disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
							{isSubmitting ? 'Please wait...' : 'Set goal'}
						</Button>
					</>
				)}
			</View>
		</PageView>
	);
};

export const renderDot = (color: string) => {
	return (
		<View
			style={{
				height: 10,
				width: 10,
				borderRadius: 5,
				backgroundColor: color,
				marginRight: 10,
			}}
		/>
	);
};

export const renderLegendComponent = ({
	proteinGoal,
	carbsGoal,
	fatGoal,
}: {
	proteinGoal: number;
	carbsGoal: number;
	fatGoal: number;
}) => {
	const total = proteinGoal + carbsGoal + fatGoal;
	const proteinPercentage = (proteinGoal / total) * 100;
	const carbsPercentage = (carbsGoal / total) * 100;
	const fatPercentage = (fatGoal / total) * 100;

	return (
		<>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 10,
					gap: 15,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{renderDot('#549E14')}
					<ThemedText style={{ color: 'white' }}>Protein {proteinPercentage.toFixed(0)}%</ThemedText>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{renderDot('#018EC1')}
					<ThemedText style={{ color: 'white' }}>Carbs {carbsPercentage.toFixed(0)}%</ThemedText>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{renderDot('#E26F0B')}
					<ThemedText style={{ color: 'white' }}>Fat {fatPercentage.toFixed(0)}%</ThemedText>
				</View>
			</View>
		</>
	);
};

export default SetGoal;
const styles = StyleSheet.create({
	pageContainer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		padding: 15,
		gap: 5,
	},
});
