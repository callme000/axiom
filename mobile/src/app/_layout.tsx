import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "../../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
        }}
      />
    </AuthProvider>
  );
}
