import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { TAXONOMY_CATEGORIES } from "@shared/lib/finance/taxonomy";
import { useBiometrics } from "../hooks/useBiometrics";

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const { authenticate, isEnrolled } = useBiometrics();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Authentication Error", error.message);
    setLoading(false);
  };

  const handleBiometricAuth = async () => {
    const { success } = await authenticate();
    if (success) {
      setIsUnlocked(true);
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  // Phase 3: Auth Flow
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-black p-6 justify-center">
        <StatusBar style="light" />
        <Text className="text-white font-mono text-2xl mb-8">
          {">"} AXIOM_AUTH_REQUIRED
        </Text>

        <View className="space-y-4">
          <TextInput
            className="bg-zinc-900 text-white p-4 font-mono border border-zinc-800"
            placeholder="SYSTEM_ID (EMAIL)"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            className="bg-zinc-900 text-white p-4 font-mono border border-zinc-800"
            placeholder="ACCESS_CODE (PASSWORD)"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-white p-4 items-center mt-4"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-black font-mono font-bold">
              {loading ? "AUTHENTICATING..." : "INITIALIZE_SESSION"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Phase 3: Biometric Lock (If enrolled)
  if (isEnrolled && !isUnlocked) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center p-6">
        <StatusBar style="light" />
        <Text className="text-white font-mono text-xl mb-8">
          {">"} SYSTEM_LOCKED
        </Text>
        <TouchableOpacity
          className="border border-white p-4 px-8"
          onPress={handleBiometricAuth}
        >
          <Text className="text-white font-mono">UNLOCK_BIOMETRICS</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Phase 3: Main Dashboard (Shared Logic Demo)
  return (
    <SafeAreaView className="flex-1 bg-black p-6">
      <StatusBar style="light" />
      <View className="mb-8">
        <Text className="text-white font-mono text-xl">
          {">"} AXIOM MOBILE UNIT_ONLINE
        </Text>
        <Text className="text-zinc-500 font-mono text-xs mt-1">
          SESSION_ID: {user.id.substring(0, 8)}...
        </Text>
      </View>

      <View className="space-y-4">
        <Text className="text-zinc-400 font-mono text-sm border-b border-zinc-800 pb-2">
          SHARED_TAXONOMY_INTEGRITY:
        </Text>
        {TAXONOMY_CATEGORIES.map((cat) => (
          <View key={cat.value} className="mb-3">
            <Text className="text-white font-mono text-sm">
              [{cat.value.toUpperCase()}]
            </Text>
            <Text className="text-zinc-500 font-mono text-xs">
              {cat.definition}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="mt-auto border border-zinc-800 p-4 items-center"
        onPress={() => supabase.auth.signOut()}
      >
        <Text className="text-zinc-500 font-mono text-xs">
          TERMINATE_SESSION
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
