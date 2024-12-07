import { View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, ScanningResult } from 'expo-camera';
import { Button, Input, Text } from '@ui-kitten/components';
import PageView from '@/components/PageView';
import { useState } from 'react';
import { getBySearchTerm } from '@/api/services/foodService';
import { getErrorString } from '@/util/getErrorString';
import { FormProvider, useForm } from 'react-hook-form';
import LogFoodsList from './LogFoodsList';
import { useScan } from '@/context/ScanContext';

export type FoodInputs = {
	foodID: number;
	name: string;
	barcode: string;
	servingSize: string;
	protein: string;
	carbs: string;
	fat: string;
};

export default function Scan({ navigation }: { navigation: any }) {
	const [permission, requestPermission] = useCameraPermissions();
	const methods = useForm<FoodInputs>();
	const [isSelectingFromList, setIsSelectingFromList] = useState<boolean>(false);
	const [foodFetchingError, setFoodFetchingError] = useState<string | null>(null);
	const [foods, setFoods] = useState<FoodInterface[]>([]);
	const { onScan, scannedCode } = useScan();

	const searchByTerm = async (term: string): Promise<void> => {
		try {
			const response = await getBySearchTerm(term);
			setFoods(response.foods);
		} catch (error: any) {
			const errorString = getErrorString(error);
			setFoodFetchingError(errorString);
		}
	};

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<PageView>
				<Text style={styles.message}>We need your permission to show the camera</Text>
				<Button onPress={requestPermission}>Allow Camera Access</Button>
			</PageView>
		);
	}

	return (
		<PageView>
			{!isSelectingFromList && (
				<CameraView
					style={styles.camera}
					facing={'back'}
					barcodeScannerSettings={{
						barcodeTypes: ['ean13', 'ean8'],
					}}
					onBarcodeScanned={(result: ScanningResult) => {
						if (scannedCode) {
							return;
						}
						onScan(result.data);

						navigation.navigate('Log', { screen: 'LogView' });
					}}
				/>
			)}
			<View style={styles.footer}>
				<Input
					style={{ flex: 1 }}
					placeholder="Scan barcode or search for a food here"
					onChange={e => {
						if (e.nativeEvent.text.length > 0) {
							setIsSelectingFromList(true);
						} else {
							setIsSelectingFromList(false);
						}
						searchByTerm(e.nativeEvent.text);
					}}
				/>
			</View>
			{isSelectingFromList && (
				<FormProvider {...methods}>
					<LogFoodsList navigation={navigation} foods={foods} />
				</FormProvider>
			)}
		</PageView>
	);
}

const styles = StyleSheet.create({
	footer: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		height: 40,
	},
	camera: {
		flex: 1,
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
});
