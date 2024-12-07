import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getTotalCalories } from '@/util/foodUtils';
import { View } from 'react-native';
import { FoodInputs } from './Scan';
import { Button, Text } from '@ui-kitten/components';
import { logFood } from '@/api/services/foodLogService';
import { useUser } from '@/context/UserContext';
import { saveFood } from '@/api/services/foodService';
import { getErrorString } from '@/util/getErrorString';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Input } from '@/components/Input';
import { useScan } from '@/context/ScanContext';
import Notification from '@/components/Notification';

export default function LogView({ navigation }: { navigation: any }) {
	const {
		control,
		reset,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FoodInputs>();
	const { addFoodLogs } = useUser();
	const watchedValues = useWatch({ control, name: ['protein', 'fat', 'carbs', 'barcode', 'servingSize', 'name'] });
	const [protein, fat, carbs, barcode, servingSize, name] = watchedValues;
	const [loggingError, setLoggingError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const { food, scannedCode, error: scanError } = useScan();

	const log = async (): Promise<void> => {
		setLoggingError(null);
		setIsSubmitting(true);
		try {
			if (food) {
				const foodLogResponse = await logFood({
					servingSize: Number(servingSize),
					foodID: food.foodID,
				});
				addFoodLogs([foodLogResponse.foodLog]);
				reset();
				navigation.navigate('Home', { screen: 'Dashboard' });
			} else {
				// always save 100g amounts, so divide the macronutrients by the serving size
				const payload = {
					name: name,
					barcode: barcode,
					protein: (Number(protein) / Number(servingSize)) * 100,
					carbs: (Number(carbs) / Number(servingSize)) * 100,
					fat: (Number(fat) / Number(servingSize)) * 100,
				};

				const response = await saveFood(payload);

				const logPayload = {
					servingSize: Number(servingSize),
					foodID: response.food.foodID,
				};

				const foodLogResponse = await logFood(logPayload);
				addFoodLogs([foodLogResponse.foodLog]);
				reset();
				navigation.navigate('Home', { screen: 'Dashboard' });
			}
		} catch (error: any) {
			const errorString = getErrorString(error);
			setLoggingError(errorString);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (food !== null) {
			setValue('name', food.name);
			setValue('barcode', food.barcode);
			setValue('protein', food.protein);
			setValue('carbs', food.carbs);
			setValue('fat', food.fat);
		}
	}, [food]);

	useEffect(() => {
		if (food === null) {
			return;
		}

		if (Number(servingSize) === 0 || isNaN(Number(servingSize))) {
			return;
		}

		// protein, carbs and fat are in grams per 100g default
		const newProtein = (Number(food.protein) / 100) * Number(servingSize);
		const newCarbs = (Number(food.carbs) / 100) * Number(servingSize);
		const newFat = (Number(food.fat) / 100) * Number(servingSize);

		setValue('protein', newProtein.toFixed(2));
		setValue('carbs', newCarbs.toFixed(2));
		setValue('fat', newFat.toFixed(2));
	}, [servingSize]);

	const getValidationMessage = () => {
		if (errors.name) {
			return errors.name.message;
		} else if (errors.servingSize) {
			return errors.servingSize.message;
		} else if (errors.protein) {
			return errors.protein.message;
		} else if (errors.carbs) {
			return errors.carbs.message;
		} else if (errors.fat) {
			return errors.fat.message;
		}
		return null;
	};

	return (
		<PageView>
			<View
				style={{
					padding: 20,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '100%',
				}}
			>
				<View>
					{(loggingError || getValidationMessage() !== null || scanError) && (
						// @ts-ignore
						<Notification message={loggingError || getValidationMessage() || scanError} type="info" />
					)}

					<View style={{ gap: 15 }}>
						<ThemedView>
							<ThemedText style={{ fontWeight: 600 }}>Name</ThemedText>
							<Input
								name="name"
								control={control}
								required="Name is required"
								isDisabled={food !== null}
							/>
						</ThemedView>
						<ThemedView>
							<ThemedText style={{ fontWeight: 600 }}>Serving size (g)</ThemedText>
							<Input
								name="servingSize"
								control={control}
								required="Serving size is required"
								isDisabled={false}
							/>
						</ThemedView>
						<ThemedView>
							<ThemedText style={{ fontWeight: 600 }}>Protein (g)</ThemedText>
							<Input
								name="protein"
								control={control}
								required="Protein is required"
								isDisabled={food !== null}
							/>
						</ThemedView>
						<ThemedView>
							<ThemedText style={{ fontWeight: 600 }}>Carbs (g)</ThemedText>
							<Input
								name="carbs"
								control={control}
								required="Carbs is required"
								isDisabled={food !== null}
							/>
						</ThemedView>

						<ThemedView>
							<ThemedText style={{ fontWeight: 600 }}>Fat (g)</ThemedText>
							<Input name="fat" control={control} required="Fat is required" isDisabled={food !== null} />
						</ThemedView>
						<ThemedView style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
							<View>
								<ThemedText style={{ fontWeight: 600 }}>Kilocalories</ThemedText>
								<Text>
									{getTotalCalories(Number(protein) || 0, Number(fat) || 0, Number(carbs) || 0) || 0}
								</Text>
							</View>
							<View>
								<ThemedText style={{ fontWeight: 600 }}>Barcode</ThemedText>
								<Text>{scannedCode || food?.barcode || ''}</Text>
							</View>
						</ThemedView>
						<Button disabled={isSubmitting} onPress={handleSubmit(log)}>
							{isSubmitting ? 'Please wait...' : 'Log'}
						</Button>
					</View>
				</View>
			</View>
		</PageView>
	);
}
