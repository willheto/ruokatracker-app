import { authenticate } from "@/api/services/authService";
import { ThemedText } from "@/components/ThemedText";
import { UserProvider } from "@/context/UserContext";
import Logger from "@/util/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { HomeScreen } from "./(tabs)";

export default function Root() {
  const getToken = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem("jwt");
    if (token) {
      return token;
    }
    return null;
  };

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await getToken();
      if (token === null) {
        return null;
      }

      const response = await authenticate({ token });
      if (response.user === null) {
        await AsyncStorage.removeItem("jwt");
        return null;
      }

      return response.user;
    },
  });

  if (isPending) return <ThemedText>"Loading...";</ThemedText>;

  return (
    <UserProvider defaultUser={user}>
      <HomeScreen />
    </UserProvider>
  );
}
