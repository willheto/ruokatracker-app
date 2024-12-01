import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import { useUser } from "@/context/UserContext";
import { Text } from "@ui-kitten/components";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) {
    return <ThemedText>Not logged in</ThemedText>;
  }

  return (

    <Text category="h3">
      Hi {user.firstName} {user.lastName}
    </Text>

  );
}
