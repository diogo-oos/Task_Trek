import { Redirect } from "expo-router";
import { auth } from "../services/firebaseConfig";
import Login from "./login";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, useColorScheme, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

export default function Root() {
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    loading ? (
      <ThemedView style={styles.loading}>
        <ActivityIndicator size="large" color={colorScheme === 'light' ? Colors['light'].text : Colors['dark'].text} />
      </ThemedView>
    ) : (
      user ? <Redirect href="/task" /> : <Login />
    )
  )
}

const styles = StyleSheet.create({
  loading: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

