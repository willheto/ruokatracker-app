import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserContextType = {
	user: UserInterface | null;
	setUser: (user: UserInterface | null) => void;
	addFoodLogs: (foodLogs: FoodLogInterface[]) => void;
	updateGoal: (goal: DailyNutrientsGoalInterface) => void;
	updateWeightLog: (weightLogs: WeightLogInterface) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};

type UserProviderProps = {
	defaultUser: UserInterface | null;
	children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ defaultUser, children }) => {
	const [user, setUser] = useState<UserInterface | null>(null);

	const addFoodLogs = (foodLogs: FoodLogInterface[]): void => {
		setUser(prevUser => {
			if (prevUser === null) {
				return null;
			}
			return {
				...prevUser,
				foodLogs: [...prevUser.foodLogs, ...foodLogs],
			};
		});
	};

	const updateGoal = (goal: DailyNutrientsGoalInterface): void => {
		setUser(prevUser => {
			if (prevUser === null) {
				return null;
			}
			return {
				...prevUser,
				dailyNutrientsGoal: goal,
			};
		});
	};

	const updateWeightLog = (weightLog: WeightLogInterface): void => {
		setUser(prevUser => {
			if (prevUser === null) {
				return null;
			}
			return {
				...prevUser,
				weight: weightLog.weight,
				weightLogs: [...prevUser.weightLogs, weightLog],
			};
		});
	};

	useEffect(() => {
		setUser(defaultUser);
	}, [defaultUser]);

	const contextValue: UserContextType = {
		user,
		setUser,
		addFoodLogs,
		updateGoal,
		updateWeightLog,
	};

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
