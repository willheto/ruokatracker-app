import { apiBaseUrl } from '@/config';
import axiosInstance from '../axiosInstance';

export async function logFood({ servingSize, foodID }: { servingSize: number; foodID: number }): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/foodlogs', { servingSize, foodID });
	return response;
}
