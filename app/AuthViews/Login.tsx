import { login } from "@/api/services/authService";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View, StyleSheet } from "react-native";
import { Button, Input } from "@ui-kitten/components";
import { getErrorString } from "@/util/getErrorString";
import { LoginInputs, SCREEN } from "./AuthScreen";
import { Screen } from "./AuthScreen";
import { useUser } from "@/context/UserContext";

export default function Login({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}) {
  const { control, handleSubmit } = useForm<LoginInputs>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<LoginInputs> = async (data): Promise<void> => {
    try {
      setError(null);
      setIsSubmitting(true);
      const response = await login(data);
      const token = response.token;
      await AsyncStorage.setItem("ruokatrackerAuthToken", token);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = getErrorString(error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Login</ThemedText>
      </ThemedView>

      <ThemedView style={styles.loginContainer}>
        <ThemedView>
          <ThemedText style={{ color: "red", marginBottom: 5, marginTop: 5 }}>{error ? error : ' '}</ThemedText>
          <ThemedText type="subtitle">Email</ThemedText>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={{ marginTop: 10 }}
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
        </ThemedView>
        <ThemedView>
          <ThemedText type="subtitle">Password</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={{ marginTop: 10 }}
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
              />
            )}
            name="password"
          />
        </ThemedView>

        <Button
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 5 }}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
          <ThemedText>Don't have an account? </ThemedText>
          <ThemedText
            onPress={() => {
              setScreen(SCREEN.SIGNUP);
            }}
            style={{
              color: "#007AFF",
              textDecorationLine: "underline",
            }}
          >
            Sign up
          </ThemedText>
        </View>
      </ThemedView>
    </View>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginContainer: {
    gap: 15,
  },
});
