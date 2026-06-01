import * as LocalAuthentication from "expo-local-authentication";
import { useState, useEffect } from "react";

export const useBiometrics = () => {
  const [isCompatible, setIsCompatible] = useState(false);
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsCompatible(compatible);
      setHasHardware(compatible);
      setIsEnrolled(enrolled);
    })();
  }, []);

  const authenticate = async (
    reason: string = "Authenticate to access Axiom",
  ) => {
    if (!isCompatible || !isEnrolled) {
      return {
        success: false,
        error: "Biometrics not available or not set up",
      };
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      return {
        success: result.success,
        error: result.success
          ? undefined
          : (
              result as LocalAuthentication.LocalAuthenticationResult & {
                error?: string;
              }
            ).error,
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  return { isCompatible, hasHardware, isEnrolled, authenticate };
};
