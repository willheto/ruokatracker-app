const calculateCalories = (protein: number, fat: number, carbs: number): number => {
	const total = protein * 4 + fat * 9 + carbs * 4;
	return Math.round(total);
};

export const getTotalCaloriesFromFoodLogs = (foodLogs: FoodLogInterface[]): number => {
	const protein = getTotalProtein(foodLogs);
	const fat = getTotalFat(foodLogs);
	const carbs = getTotalCarbs(foodLogs);

	return calculateCalories(protein, fat, carbs);
};

export const getTotalProtein = (foodLogs: FoodLogInterface[]): number => {
	let total = 0;
	foodLogs.forEach(foodLog => {
		const servingSize = foodLog.servingSize;
		const protein = foodLog.food.protein;

		total += (Number(protein) / 100) * servingSize;
	});
	return Math.round(total * 100) / 100;
};

export const getTotalCarbs = (foodLogs: FoodLogInterface[]): number => {
	let total = 0;
	foodLogs.forEach(foodLog => {
		const servingSize = foodLog.servingSize;
		const carbs = foodLog.food.carbs;
		total += (Number(carbs) / 100) * servingSize;
	});

	return Math.round(total * 100) / 100;
};

export const getTotalFat = (foodLogs: FoodLogInterface[]): number => {
	let total = 0;
	foodLogs.forEach(foodLog => {
		const servingSize = foodLog.servingSize;
		const fat = foodLog.food.fat;
		total += (Number(fat) / 100) * servingSize;
	});
	return Math.round(total * 100) / 100;
};

export const getTotalCalories = (protein: number, fat: number, carbs: number): number => {
	return calculateCalories(protein, fat, carbs);
};
