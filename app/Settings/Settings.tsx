import { Button, Text } from "@ui-kitten/components";
import PageView from "@/components/PageView";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/context/UserContext";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function Settings() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setUser } = useUser();

  const logout = async () => {
    setIsSubmitting(true);
    try {
      await AsyncStorage.removeItem("ruokatrackerAuthToken");
      setUser(null);
    }
    catch (error: any) {
      console.error("Error logging out: ", error);
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageView>
      <View style={styles.pageContainer}>
        <Text category="h3">Settings</Text>
        <Button
          disabled={isSubmitting}
          onPress={logout}
          style={{ marginTop: 5 }}
        >
          {isSubmitting ? "Logging out..." : "Log out"}
        </Button>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
});
