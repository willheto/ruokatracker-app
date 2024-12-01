import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Login from "../login";
import SignUp from "../signUp";
import PageView from "@/components/PageView";
import { useUser } from "@/context/UserContext";
import Root from "../root";
import Dashboard from "../components/dashboard";

export type LoginInputs = {
  email: string;
  password: string;
};

export type Screen = "login" | "signup";
export const SCREEN: { [key: string]: Screen } = {
  LOGIN: "login",
  SIGNUP: "signup",
};

export function HomeScreen() {
  const [screen, setScreen] = useState<Screen>(SCREEN.LOGIN);
  const { user } = useUser();


  return (
    <PageView>
      {user ? (
        <Dashboard />
      ) : screen === SCREEN.LOGIN ? (
        <Login setScreen={setScreen} />
      ) : (
        <SignUp setScreen={setScreen} />
      )}
    </PageView>
  );
}

export default () => {

  return (

    <Root />

  );
};

