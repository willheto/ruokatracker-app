import { login, signUp } from "@/api/services/authService";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Logger from "@/util/Logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View, StyleSheet } from "react-native";
import { SCREEN } from "./(tabs)";
import { Button, Input } from "@ui-kitten/components";
import { Screen } from "./(tabs)";
import { getErrorString } from "@/util/getErrorString";

export type SignUpInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}) {
  const { control, handleSubmit } = useForm<SignUpInputs>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const onSubmit: SubmitHandler<SignUpInputs> = async (data): Promise<void> => {
    try {
      setError(null);
      setIsSubmitting(true);
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const response = await signUp(data);
      const token = response.token;
      await AsyncStorage.setItem("jwt", token);
    } catch (error: any) {
      const errorMessage = error.response.data;
      const errorString = getErrorString(errorMessage);

      console.log("Error logging in: " + errorString);
      Logger.printError("Error logging in: " + errorString);
      setError(errorString);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sign up</ThemedText>
      </ThemedView>

      <ThemedView style={styles.loginContainer}>
        <ThemedText style={{ color: "red" }}>{error}</ThemedText>
        <ThemedView>
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
              />
            )}
            name="password"
          />
        </ThemedView>
        <ThemedView>
          <ThemedText type="subtitle">Confirm Password</ThemedText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={{ marginTop: 10 }}
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="confirmPassword"
          />
        </ThemedView>

        <Button
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 5 }}
        >
          {isSubmitting ? "Please wait..." : "Sign up"}
        </Button>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
          <ThemedText>Already have an account? </ThemedText>
          <ThemedText
            onPress={() => {
              setScreen(SCREEN.LOGIN);
            }}
            style={{
              color: "#007AFF",
              textDecorationLine: "underline",
            }}
          >
            Log in
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
