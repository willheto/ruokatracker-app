import { TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useScan } from '@/context/ScanContext';

export default function LogFoodsList({ navigation, foods }: { navigation: any; foods: FoodInterface[] }) {
	const { setFood } = useScan();

	return (
		<View style={{ flex: 1 }}>
			{foods
				?.sort((a: FoodInterface, b: FoodInterface) => {
					return a.name.localeCompare(b.name);
				})
				.map((food: FoodInterface) => {
					return (
						<TouchableOpacity
							key={food.foodID}
							onPress={() => {
								setFood(food);
								navigation.navigate('Log', { screen: 'LogView' });
							}}
						>
							<View
								style={{
									padding: 10,
									borderBottomWidth: 1,
									borderBottomColor: 'rgb(21, 23, 24)',
								}}
							>
								<Text>{food.name}</Text>
							</View>
						</TouchableOpacity>
					);
				})}
		</View>
	);
}
