import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/context/UserContext';
import { getTotalProtein, getTotalCarbs, getTotalFat } from '@/util/foodUtils';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Text } from '@ui-kitten/components';

const DashboardDailyNutrientsGoal = () => {
	const { user } = useUser();

	if (!user) {
		return <ThemedText>Not logged in</ThemedText>;
	}

	const getPieValues = (type: 'protein' | 'carbs' | 'fat') => {
		const { protein, carbs, fat } = user.dailyNutrientsGoal;

		if (type === 'protein') {
			const todaysProtein = getTotalProtein(user.foodLogs);
			return [
				{ value: todaysProtein, color: '#549E14' },
				{ value: protein - todaysProtein, color: '#417A10' }, // Darker blue
			];
		}

		if (type === 'carbs') {
			const todaysCarbs = getTotalCarbs(user.foodLogs);
			return [
				{ value: todaysCarbs, color: '#018EC1' },
				{ value: carbs - todaysCarbs, color: '#016A91' }, // Darker red
			];
		}

		if (type === 'fat') {
			const todaysFat = getTotalFat(user.foodLogs);
			return [
				{ value: todaysFat, color: '#E26F0B' },
				{ value: fat - todaysFat, color: '#B35709' }, // Darker yellow
			];
		}

		return [];
	};

	const getProteinGoalPercentage = () => {
		return Math.round((getTotalProtein(user.foodLogs) / user.dailyNutrientsGoal.protein) * 100);
	};

	const getCarbsGoalPercentage = () => {
		return Math.round((getTotalCarbs(user.foodLogs) / user.dailyNutrientsGoal.carbs) * 100);
	};

	const getFatGoalPercentage = () => {
		return Math.round((getTotalFat(user.foodLogs) / user.dailyNutrientsGoal.fat) * 100);
	};

	return (
		<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
			<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
				<PieChart
					donut
					showText
					textColor="white"
					radius={50}
					innerRadius={25}
					textBackgroundColor="white"
					data={getPieValues('protein')}
					backgroundColor="rgb(21, 23, 24)"
					centerLabelComponent={() => {
						return <Text style={{ fontSize: 16 }}>{getProteinGoalPercentage()}%</Text>;
					}}
				/>

				<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<ThemedText style={{ color: 'white' }}>Protein</ThemedText>
					<ThemedText style={{ color: 'white' }}>
						{getTotalProtein(user.foodLogs)} / {user.dailyNutrientsGoal.protein}g
					</ThemedText>
				</View>
			</View>
			<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
				<PieChart
					donut
					showText
					textColor="white"
					radius={50}
					innerRadius={25}
					textBackgroundColor="white"
					data={getPieValues('carbs')}
					backgroundColor="rgb(21, 23, 24)"
					centerLabelComponent={() => {
						return <Text style={{ fontSize: 16 }}>{getCarbsGoalPercentage()}%</Text>;
					}}
				/>
				<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<ThemedText style={{ color: 'white' }}>Carbs</ThemedText>
					<ThemedText style={{ color: 'white' }}>
						{getTotalCarbs(user.foodLogs)} / {user.dailyNutrientsGoal.carbs}g
					</ThemedText>
				</View>
			</View>
			<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
				<PieChart
					donut
					showText
					textColor="white"
					radius={50}
					innerRadius={25}
					textBackgroundColor="white"
					data={getPieValues('fat')}
					backgroundColor="rgb(21, 23, 24)"
                    centerLabelComponent={() => {
						return <Text style={{ fontSize: 16 }}>{getFatGoalPercentage()}%</Text>;
					}}
				/>
				<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<ThemedText style={{ color: 'white' }}>Fat</ThemedText>
					<ThemedText style={{ color: 'white' }}>
						{getTotalFat(user.foodLogs)} / {user.dailyNutrientsGoal.fat}g
					</ThemedText>
				</View>
			</View>
		</View>
	);
};

export default DashboardDailyNutrientsGoal;
