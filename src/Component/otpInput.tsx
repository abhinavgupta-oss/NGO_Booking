import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OtpInput = ({ onChangeOTP }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Send OTP to parent as a string
    onChangeOTP(newOtp.join(""));

    // Auto move to next input
    if (text && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.input}
          maxLength={1}
          keyboardType="number-pad"
          value={value}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: {
    width: 50,
    height: 55,
    borderWidth: 1.5,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    borderColor: "#9BA1A6",
    color: "#000",
    marginHorizontal: 5,
  },
});
