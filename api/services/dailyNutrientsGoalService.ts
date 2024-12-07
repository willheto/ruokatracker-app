import { apiBaseUrl } from '@/config';
import axiosInstance from '../axiosInstance';

export async function setGoal({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/dailyNutrientsGoals', { protein, carbs, fat });
	return response;
}
