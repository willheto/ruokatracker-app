import { useState } from "react";
import PageView from "@/components/PageView";
import Login from "./Login";
import SignUp from "./SignUp";

export type LoginInputs = {
    email: string;
    password: string;
};

export type Screen = "login" | "signup";
export const SCREEN: { [key: string]: Screen } = {
    LOGIN: "login",
    SIGNUP: "signup",
};

export default function LoginScreen() {
    const [screen, setScreen] = useState<Screen>(SCREEN.LOGIN);

    return (
        <PageView>
            {screen === SCREEN.LOGIN ? (
                <Login setScreen={setScreen} />
            ) : (
                <SignUp setScreen={setScreen} />
            )}
        </PageView>
    );
}


