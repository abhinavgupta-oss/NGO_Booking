import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../utility/AppTheam";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;

  // Custom Style
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  buttonStyle,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.buttonWrapper, buttonStyle]}
    >
      <LinearGradient
        colors={
          isDisabled
            ? ["#BDBDBD", "#9E9E9E"]
            : [colors.primary, colors.secondry]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },

  button: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});