import { apiBaseUrl } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

type AxiosRequestConfigOmited = Omit<AxiosRequestConfig, 'headers'>;

const config: AxiosRequestConfigOmited = {
	baseURL: apiBaseUrl,
	timeout: 10000,
};

type AxiosInstanceOmitted = Omit<AxiosInstance, 'config'> & Omit<AxiosInstance, 'interceptors'>;

type CustomAxiosInstance = AxiosInstanceOmitted & {
	config?: AxiosRequestConfigOmited;
};

type axiosOmitted = Omit<typeof axios, 'create'>;

type CustomAxios = axiosOmitted & {
	create: (config: AxiosRequestConfigOmited) => CustomAxiosInstance;
};

const customAxios = axios as CustomAxios;

const axiosInstance: CustomAxiosInstance = customAxios.create(config);

axiosInstance.interceptors.request.use(
	async config => {
		const token = await AsyncStorage.getItem('ruokatrackerAuthToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		// Do something with request error
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	response => {
		if (!response) {
			throw response;
		}

		if (response.data.error) {
			throw response.data.error;
		}

		if (response.data) {
			return response.data;
		}

		return response;
	},
	error => {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			if (error.response.data) {
				if (error.response.data.error) {
					const errorObject = {
						error: error.response.data.error,
					};
					throw errorObject;
				}
				throw error.response.data;
			}
			throw error.response;
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			const errorObject = {
				code: 9999,
				title: 'Connectivity error',
				details: 'There seems to be a connection problem. Please try again.',
				errors: [],
			};
			throw errorObject;
			// throw error.request
		}
		throw error;
	},
);

export default axiosInstance;
