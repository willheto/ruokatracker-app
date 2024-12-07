interface UserInterface {
	userID: number;
	email: string;
	firstName: string;
	lastName: string;
	weight: number;
	token: string;
	foodLogs: FoodLogInterface[];
	dailyNutrientsGoal: DailyNutrientsGoalInterface;
	weightLogs: WeightLogInterface[];
}

interface FoodInterface {
	foodID: number;
	name: string;
	barcode: string;
	protein: string;
	carbs: string;
	fat: string;
}

interface DailyNutrientsGoalInterface {
	dailyNutrientsGoalID: number;
	userID: number;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

interface FoodLogInterface {
	foodLogID: number;
	userID: number;
	foodID: number;
	servingSize: number;
	date: string;
	food: FoodInterface;
}

interface ScanInterface {
	data: string;
}

interface WeightLogInterface {
	weightLogID: number;
	userID: number;
	weight: number;
	date: string;
}
