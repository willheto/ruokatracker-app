import { useUser } from '@/context/UserContext';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Text, Button } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export default function WeightProgress({ navigation }: { navigation: any }) {
	const { user } = useUser();
	if (!user) {
		return null;
	}
	const getTodaysWeightLog = () => {
		const weightLogs = user.weightLogs;

		if (!weightLogs) {
			return null;
		}

		// get todays date utc as "yyyy-mm-dd"
		const today = new Date().toISOString().split('T')[0];
		return weightLogs.find(log => log.date === today) || null;
	};

	const getYesterdaysWeightLog = () => {
		const weightLogs = user.weightLogs;

		if (!weightLogs) {
			return null;
		}

		// get yesterdays date utc as "yyyy-mm-dd"
		const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
		return weightLogs.find(log => log.date === yesterday) || null;
	};

	const getWeightChange = () => {
		const todaysWeightLog = getTodaysWeightLog();
		const yesterdaysWeightLog = getYesterdaysWeightLog();

		if (!todaysWeightLog || !yesterdaysWeightLog) {
			return null;
		}

		return (todaysWeightLog.weight - yesterdaysWeightLog.weight).toFixed(1);
	};

	const todaysWeight = getTodaysWeightLog()?.weight;
	const weightChange = getWeightChange();
	const weightChangeNumber = weightChange !== null ? parseFloat(weightChange) : 0;
	const weightChangeColor = weightChangeNumber > 0 ? 'green' : 'red';
	const weightChangeSign = weightChangeNumber > 0 ? '+' : '';

	const getWeightData = () => {
		const weightLogs = user.weightLogs;

		if (!weightLogs) {
			return [];
		}

		const logs = weightLogs
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.map(log => ({
				value: Number(log.weight),
			}));

		const numberOfLogsMissing = 7 - logs.length;

		let resultLogs;

		if (numberOfLogsMissing > 0) {
			const missingLogs = Array.from({ length: numberOfLogsMissing }, _ => {
				return { value: 0 };
			});

			resultLogs = [...missingLogs, ...logs];
		} else {
			resultLogs = logs;
		}

		return resultLogs;
	};

	const getLowestWeight = () => {
		const weightLogs = user.weightLogs;

		if (!weightLogs) {
			return 0;
		}

		const logs = weightLogs.map(log => log.weight);

		return Math.min(...logs);
	};
	return (
		<View style={{ marginBottom: 20, gap: 5 }}>
			<Text category="h3" style={styles.statsTitle}>
				Weight progress
			</Text>
			{!todaysWeight ? (
				<Button onPress={() => navigation.navigate('Home', { screen: 'LogWeight' })}>Log today's weight</Button>
			) : (
				<View
					style={{
						overflow: 'hidden',
					}}
				>
					<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
						<Text>{todaysWeight} kg</Text>
						{weightChange !== null && (
							<Text style={{ color: weightChangeColor }}>
								{' '}
								({weightChangeSign}
								{weightChange} kg from yesterday)
							</Text>
						)}
					</View>
					<LineChart
						scrollToEnd
						adjustToWidth
						isAnimated
						thickness={3}
						color="#E26F0B"
						mostNegativeValue={60}
						noOfSections={5}
						animateOnDataChange
						animationDuration={1000}
						onDataChangeAnimationDuration={300}
						areaChart
						yAxisTextStyle={{ color: 'lightgray' }}
						data={getWeightData()}
						hideDataPoints
						startFillColor="#E26F0B"
						endFillColor="#E26F0B"
						startOpacity={0.4}
						endOpacity={0.1}
						rulesColor="gray"
						rulesType="solid"
						yAxisColor="lightgray"
						xAxisColor="lightgray"
						yAxisOffset={getLowestWeight() - 5}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
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
});
