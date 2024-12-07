import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import * as eva from '@eva-design/eva';
import { default as theme } from './theme.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApplicationProvider } from '@ui-kitten/components';
import { ScanProvider } from '@/context/ScanContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { authenticate } from '@/api/services/authService';
import { UserProvider } from '@/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import LoginScreen from './AuthViews/AuthScreen';
import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings/Settings';
import { createStackNavigator } from '@react-navigation/stack';
import SetGoal from './Dashboard/SetGoal';
import Dashboard from './Dashboard/Dashboard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Log from './Log/Scan';
import LogView from './Log/LogView';
import LogWeight from './Dashboard/LogWeight';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardViewStack() {
	return (
		<Stack.Navigator>
			{/* Stack Screens go here */}
			<Stack.Screen name="Dashboard" component={Dashboard} />
			<Stack.Screen name="SetGoal" component={SetGoal} options={{ title: 'Set Goal' }} />
			<Stack.Screen name="LogWeight" component={LogWeight} options={{ title: 'Log Weight' }} />
		</Stack.Navigator>
	);
}

function LogViewStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Scan" component={Log} />
			<Stack.Screen name="LogView" component={LogView} options={{ title: 'Log' }} />
		</Stack.Navigator>
	);
}

function RootLayout() {
	const colorScheme = useColorScheme();
	const { user } = useUser();

	if (user === null) {
		return <LoginScreen />;
	}

	return (
		<ScanProvider>
			<Tab.Navigator
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
					tabBarStyle: {
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						backgroundColor: Colors[colorScheme ?? 'light'].background,
					},
				}}
			>
				<Tab.Screen
					name="Home"
					component={DashboardViewStack}
					options={{
						title: 'Dashboard',
						headerShown: false,
						tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
					}}
				/>
				<Tab.Screen
					name="Log"
					component={LogViewStack}
					options={{
						title: 'Log Food',
						headerShown: false,
						tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus" color={color} />,
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={Settings}
					options={{
						title: 'Settings',
						tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
					}}
				/>
			</Tab.Navigator>
		</ScanProvider>
	);
}

function UserInitializer() {
	const getToken = async (): Promise<string | null> => {
		const token = await AsyncStorage.getItem('ruokatrackerAuthToken');
		return token || null;
	};

	const { isLoading, data: user } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			try {
				const token = await getToken();
				if (token === null) return null;

				const response = await authenticate({ token });
				return response.user;
			} catch (error) {
				await AsyncStorage.removeItem('ruokatrackerAuthToken');
				return null;
			}
		},
	});

	// Hide splash screen once loading is done
	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hideAsync();
		}
	}, [isLoading]);

	if (isLoading) return null; // Show nothing while loading

	return (
		<UserProvider defaultUser={user}>
			<RootLayout />
		</UserProvider>
	);
}

export default () => {
	const colorScheme = useColorScheme();
	const queryClient = new QueryClient();

	return (
		<ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<QueryClientProvider client={queryClient}>
					<UserInitializer />
				</QueryClientProvider>
			</ThemeProvider>
		</ApplicationProvider>
	);
};
