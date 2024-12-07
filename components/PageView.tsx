import type { PropsWithChildren, ReactElement } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";

interface PageViewProps {
  withKeyboardAvoidance?: boolean;
}

export default function PageView({
  children,
  withKeyboardAvoidance = true,
}: PropsWithChildren<PageViewProps>): ReactElement {
  const Wrapper = withKeyboardAvoidance ? KeyboardAvoidingView : SafeAreaView;

  return (
    <SafeAreaView style={styles.container}>
      <Wrapper
        style={styles.wrapper}
        {...(withKeyboardAvoidance && {
          behavior: Platform.OS === "ios" ? "padding" : "height",
        })}
      >
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(21, 23, 24)",
  },
  content: {
    flexGrow: 1,
  },
});
