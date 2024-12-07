import { apiBaseUrl } from '@/config';
import axiosInstance from '../axiosInstance';

export async function logWeight(weight: number): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/weightLogs', { weight });
	return response;
}
