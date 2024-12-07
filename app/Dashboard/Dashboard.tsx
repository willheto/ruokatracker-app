import PageView from '@/components/PageView';
import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/context/UserContext';
import { getTotalCaloriesFromFoodLogs, getTotalCarbs, getTotalFat, getTotalProtein } from '@/util/foodUtils';
import { Text } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { Button } from '@ui-kitten/components';
import DashboardDailyNutrientsGoal from './DashboardDailyNutrientsGoal';
import WeightProgress from './WeightProgress';

export default function Dashboard({ navigation }: { navigation: any }) {
	const { user } = useUser();

	const handleSetGoal = () => {
		navigation.navigate('Home', { screen: 'SetGoal' });
	};

	if (!user) {
		return <ThemedText>Not logged in</ThemedText>;
	}

	return (
		<PageView>
			<View style={styles.pageContainer}>
				<View>
					<Text category="h4" style={styles.greeting}>
						Hi {user.firstName} {user.lastName}
					</Text>

					<View style={styles.statsContainer}>
						<Text category="h3" style={styles.statsTitle}>
							Today's nutrients
						</Text>
						<View style={styles.statsItem}>
							<Text style={styles.statText}>Calories:</Text>
							<Text style={styles.statValue}>{getTotalCaloriesFromFoodLogs(user.foodLogs)} kcal</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={styles.statText}>Protein:</Text>
							<Text style={styles.statValue}>{getTotalProtein(user.foodLogs)} g</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={styles.statText}>Carbs:</Text>
							<Text style={styles.statValue}>{getTotalCarbs(user.foodLogs)} g</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={styles.statText}>Fat:</Text>
							<Text style={styles.statValue}>{getTotalFat(user.foodLogs)} g</Text>
						</View>
					</View>

					<View style={styles.statsContainer}>
						<Text category="h3" style={styles.statsTitle}>
							Daily nutrients goal
						</Text>
						{!user.dailyNutrientsGoal ? (
							<Button disabled={user.weight === null} onPress={() => handleSetGoal()}>
								{user.weight === null ? 'Log your first weight first!' : 'Set goal'}
							</Button>
						) : (
							<DashboardDailyNutrientsGoal />
						)}
					</View>
					<WeightProgress navigation={navigation} />
				</View>
			</View>
		</PageView>
	);
}

const styles = StyleSheet.create({
	pageContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
		padding: 20,
	},
	greeting: {
		marginBottom: 20,
	},
	statsContainer: {
		marginBottom: 20,
	},
	statsTitle: {
		fontSize: 18,
		marginBottom: 12,
	},
	statsItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
		alignItems: 'center',
	},
	statText: {
		fontSize: 16,
	},
	statValue: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	foodLogContainer: {
		marginTop: 20,
	},
	foodLogText: {
		fontSize: 14,
		marginBottom: 6,
	},
});
