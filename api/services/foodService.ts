import { apiBaseUrl } from '@/config';
import axiosInstance from '../axiosInstance';

export async function getFoodByBarcode(barcode: string): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/foods/getByBarcode', { barcode });
	return response;
}

export const saveFood = async (data: any): Promise<any> => {
	const response = await axiosInstance.post(apiBaseUrl + '/foods', data);
	return response;
};

export const getBySearchTerm = async (searchTerm: string): Promise<any> => {
	const response = await axiosInstance.post(apiBaseUrl + '/foods/getBySearchTerm', { searchTerm });
	return response;
};
