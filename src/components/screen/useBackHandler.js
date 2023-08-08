import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useBackHandler = (handleBack) => {
  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [handleBack]);
};
