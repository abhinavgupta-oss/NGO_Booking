import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  label?: string;
  value: string;
  icon?: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  icon,
  onChangeText,
  onBlur,
  error,
  multiline = false,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      {/* Input Wrapper */}
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          error ? styles.errorInput : null,
        ]}
      >
        <MaterialIcons
          name={icon}
          size={24}
          color="#9CA3AF"
          style={styles.icon}
        />

        {/* Input */}
        <TextInput numberOfLines={1}
          ellipsizeMode="tail"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholderTextColor="#999"
          multiline={multiline}
          style={[
            styles.input,
            multiline && styles.multilineInput,
          ]}
          {...rest}
        />
      </View>

      {/* Error */}
      {!!error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 14,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    minHeight: 50,
  },

  multilineWrapper: {
    alignItems: "flex-start",
    minHeight: 130,
    paddingTop: 16,
  },

  icon: {
    marginRight: 12,
    marginTop: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 0,
    paddingRight: 35,
  },

  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  errorInput: {
    borderColor: "red",
  },

  errorText: {
    marginTop: 6,
    color: "red",
    fontSize: 13,
    fontWeight: "500",
  },
});