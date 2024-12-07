import { apiBaseUrl } from '@/config';
import axiosInstance from '../axiosInstance';
import { LoginInputs } from '@/app/AuthViews/AuthScreen';

export async function login(data: LoginInputs): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/user/login', data);
	return response;
}

export async function signUp(data: { email: string; password: string }): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/users', data);
	return response;
}

export async function authenticate(data: { token: string }): Promise<any> {
	const response = await axiosInstance.post(apiBaseUrl + '/user/auth', data);
	return response;
}
