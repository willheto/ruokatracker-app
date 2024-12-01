import type { PropsWithChildren, ReactElement } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

const HEADER_HEIGHT = 250;

export default function PageView({
  children,
}: PropsWithChildren<{}>): ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
});
