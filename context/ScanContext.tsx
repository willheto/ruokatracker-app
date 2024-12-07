import { getFoodByBarcode } from '@/api/services/foodService';
import { getErrorString } from '@/util/getErrorString';
import { usePathname } from 'expo-router';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ScanContextType = {
	scannedCode: string | null;
	food: FoodInterface | null;
	error: string | null;
	isSubmitting: boolean;
	onScan: (scannedCode: string) => void;
	setFood: (food: FoodInterface | null) => void;
};

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const useScan = (): ScanContextType => {
	const context = useContext(ScanContext);
	if (context === undefined) {
		throw new Error('useScan must be used within a ScanProvider');
	}
	return context;
};

type ScanProviderProps = {
	children: ReactNode;
};

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
	const pathName = usePathname();

	const [scannedCode, setScannedCode] = useState<string | null>(null);
	const [food, setFood] = useState<FoodInterface | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		if (pathName !== '/Log/LogView') {
			setFood(null);
			setScannedCode(null);
			setError(null);
			setIsSubmitting(false);
		}
	}, [pathName]);

	const onScan = async (scannedCode: string): Promise<void> => {
		setIsSubmitting(true);
		setScannedCode(scannedCode);
		try {
			const response = await getFoodByBarcode(scannedCode);
			const food = response.food;
			setFood(food);
		} catch (error: any) {
			const errorString = getErrorString(error);
			setError(errorString);
		} finally {
			setIsSubmitting(false);
		}
	};

	const contextValue: ScanContextType = {
		scannedCode: scannedCode,
		food: food,
		error: error,
		isSubmitting: isSubmitting,
		onScan: onScan,
		setFood: setFood,
	};

	return <ScanContext.Provider value={contextValue}>{children}</ScanContext.Provider>;
};
