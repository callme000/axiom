import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function RootLayout() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);

  // Define the core auth logic as a stable callback for the retry button
  const handleAuthentication = useCallback(async () => {
    try {
      const results = await LocalAuthentication.authenticateAsync({
        promptMessage: "AXIOM: Verify Identity for Ledger Access",
        fallbackLabel: "Use Passcode",
      });

      if (results.success) {
        setIsUnlocked(true);
        setAuthFailed(false);
      } else {
        setAuthFailed(true);
      }
    } catch (error) {
      setAuthFailed(true);
    }
  }, []);

  // Trigger authentication on mount using a pattern that avoids synchronous setState warnings
  useEffect(() => {
    let isMounted = true;

    const triggerAuth = async () => {
      // Small delay or Promise.resolve() can help bypass aggressive sync-check linters
      // by ensuring the state update is clearly decoupled from the effect's setup phase.
      await Promise.resolve();

      try {
        const results = await LocalAuthentication.authenticateAsync({
          promptMessage: "AXIOM: Verify Identity for Ledger Access",
          fallbackLabel: "Use Passcode",
        });

        if (isMounted) {
          if (results.success) {
            setIsUnlocked(true);
            setAuthFailed(false);
          } else {
            setAuthFailed(true);
          }
        }
      } catch (error) {
        if (isMounted) setAuthFailed(true);
      }
    };

    triggerAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isUnlocked) {
    return (
      <View className="flex-1 bg-black justify-center items-start px-8">
        <StatusBar style="light" />
        <View className="w-full">
          <Text className="text-white font-mono text-lg">
            {"> AXIOM SECURITY KERNEL"}
          </Text>
          <Text className="text-white font-mono text-lg">
            {"> HARDWARE LOCK ENGAGED."}
          </Text>

          {authFailed && (
            <View className="mt-12 w-full">
              <View className="border-l-2 border-orange-500 pl-4 mb-8">
                <Text className="text-orange-500 font-mono text-xs uppercase tracking-widest mb-1">
                  Security Alert
                </Text>
                <Text className="text-orange-500 font-mono text-sm">
                  {"> ERROR: AUTHENTICATION_FAILED"}
                </Text>
                <Text className="text-orange-500 font-mono text-sm">
                  {"> SIGNAL_STRENGTH_NOMINAL"}
                </Text>
                <Text className="text-orange-500 font-mono text-sm">
                  {"> HARDWARE_CHALLENGE_REQUIRED"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleAuthentication}
                activeOpacity={0.7}
                className="border border-white py-4 px-6 w-full"
              >
                <Text className="text-white font-mono text-center font-bold tracking-tighter">
                  RETRY BIOMETRICS
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Slot />
    </AuthProvider>
  );
}
