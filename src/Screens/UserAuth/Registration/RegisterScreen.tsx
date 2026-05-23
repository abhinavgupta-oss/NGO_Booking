// RegisterScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import CustomInput from "../../../Component/formComponent/CustomInput";
import CustomCalendar from "../../../Component/formComponent/CustomCalendar";
import OtpInput from "../../../Component/otpInput";

import { Icons } from "../../../utility/utility";
import {
  DevoteeLogin,
  DevoteeRegister,
} from "../../../Services/Devotee/DevoteeServices";
import { useToast } from "../../../Component/Toast/ToastContext";
import DeviceInfo from "react-native-device-info";
import CustomButton from "../../../Component/formComponent/CustomButton";
import { colors } from "../../../utility/AppTheam";
import AppEnvironment from "../../../utility/AppEnvironment";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();

  // ================= STATES =================

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const [errors, setErrors] = useState<any>({});

  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= VALIDATION =================

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          error = "Full Name is required";
        }
        break;

      case "mobile":
        if (!value.trim()) {
          error = "Mobile Number is required";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Enter valid 10 digit mobile number";
        }
        break;

      case "email":
        if (
          value &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          error = "Enter valid email address";
        }
        break;

      case "dob":
        if (!value.trim()) {
          error = "Date of Birth is required";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "Address is required";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be minimum 6 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prev: any) => ({
      ...prev,
      [field]: error,
    }));

    return error;
  };

  const validateForm = () => {
    const fullNameError = validateField("fullName", fullName);
    const mobileError = validateField("mobile", mobile);
    const emailError = validateField("email", email);
    const dobError = validateField("dob", dob);
    const addressError = validateField("address", address);
    const passwordError = validateField("password", password);

    return !(
      fullNameError ||
      mobileError ||
      emailError ||
      dobError ||
      addressError ||
      passwordError
    );
  };

  const isFormValid =
    fullName.trim() &&
    /^[6-9]\d{9}$/.test(mobile) &&
    dob.trim() &&
    address.trim() &&
    password.trim().length >= 6 &&
    (email === "" ||
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email));

  // ================= REGISTER =================

  const handleRegister = async () => {
    const isValid = validateForm();

    if (!isValid) return;

    try {
      const payload = {
        name: fullName,
        mobile: mobile,
        EmailAddress: email,
        DateOfBirth: dob,
        Address: address,
        password: password,
        branchCode: AppEnvironment.BRANCH_CODE,
      };

      const registerDetails = await DevoteeRegister(payload);

      console.log("registerDetails", registerDetails);

      if (registerDetails?.status) {
        setShowOtpModal(true);
        showToast(registerDetails?.message, "success");
      } else {
        showToast(registerDetails?.message, "error");
      }
    } catch (error: any) {
      console.log("Register Error", error);
      showToast("Something went wrong", "error");
    }
  };

  // ================= OTP VERIFY =================

  const handelSubmit = async () => {
    try {
      const enteredOtp = otp;

      const Loginform = {
        emailOrMobile: mobile,
        otp: enteredOtp,
        branchCode: AppEnvironment.BRANCH_CODE,
        deviceUserId: DeviceInfo.getDeviceId(),
        appVersionCode: "1",
      };

      const loginResp = await DevoteeLogin(Loginform);

      if (loginResp?.status) {
        showToast(loginResp?.message, "success");
        navigation.replace("Dashboard");
      } else {
        showToast(loginResp?.message, "error");
      }
    } catch (error: any) {
      console.log("OTP Verify Error", error);
      showToast("Something went wrong", "error");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ================= HEADER ================= */}

          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
              style={styles.backButton}
            >
              <Image
                source={Icons.LeftSolid}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={styles.headerText}>
              Devotee Registration
            </Text>

            <View style={{ width: 45 }} />
          </View>

          {/* ================= FORM ================= */}

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              Register Now
            </Text>

            <Text style={styles.subTitle}>
              Fill your details to continue
            </Text>

            {/* FULL NAME */}

            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              icon="person-outline"
              value={fullName}
              onChangeText={(text: string) => {
                setFullName(text);
                validateField("fullName", text);
              }}
              onBlur={() =>
                validateField("fullName", fullName)
              }
            />

            {errors.fullName ? (
              <Text style={styles.errorText}>
                {errors.fullName}
              </Text>
            ) : null}

            {/* MOBILE */}

            <CustomInput
              label="Mobile Number"
              placeholder="10-digit mobile number"
              icon="call"
              keyboardType="phone-pad"
              value={mobile}
              maxLength={10}
              onChangeText={(text: string) => {
                const cleaned = text.replace(
                  /[^0-9]/g,
                  ""
                );

                setMobile(cleaned);
                validateField("mobile", cleaned);
              }}
              onBlur={() =>
                validateField("mobile", mobile)
              }
            />

            {errors.mobile ? (
              <Text style={styles.errorText}>
                {errors.mobile}
              </Text>
            ) : null}

            {/* EMAIL */}

            <CustomInput
              label="Email Address"
              placeholder="your.email@example.com"
              icon="mail-outline"
              keyboardType="email-address"
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
                validateField("email", text);
              }}
              onBlur={() =>
                validateField("email", email)
              }
            />

            {errors.email ? (
              <Text style={styles.errorText}>
                {errors.email}
              </Text>
            ) : null}

            {/* DOB */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowBirthPicker(true)}
            >
              <View pointerEvents="none">
                <CustomInput
                  label="Date of Birth"
                  placeholder="dd-mm-yyyy"
                  icon="calendar-today"
                  value={dob}
                  onChangeText={setDob}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            {errors.dob ? (
              <Text style={styles.errorText}>
                {errors.dob}
              </Text>
            ) : null}

            {/* ADDRESS */}

            <CustomInput
              label="Address"
              placeholder="Enter your complete address"
              icon="location-on"
              value={address}
              multiline
              onChangeText={(text: string) => {
                setAddress(text);
                validateField("address", text);
              }}
              onBlur={() =>
                validateField("address", address)
              }
            />

            {errors.address ? (
              <Text style={styles.errorText}>
                {errors.address}
              </Text>
            ) : null}

            {/* PASSWORD */}

            <View>
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                icon="lock-outline"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={(text: string) => {
                  setPassword(text);
                  validateField("password", text);
                }}
                onBlur={() =>
                  validateField("password", password)
                }
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <MaterialIcons
                  name={
                    showPassword
                      ? "visibility-off"
                      : "visibility"
                  }
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {errors.password ? (
              <Text style={styles.errorText}>
                {errors.password}
              </Text>
            ) : null}

            {/* BUTTON */}

            {/* <TouchableOpacity
              style={[
                styles.button,
                {
                  opacity: isFormValid ? 1 : 0.5,
                },
              ]}
              activeOpacity={0.85}
              disabled={!isFormValid}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                Register
              </Text>
            </TouchableOpacity> */}

            <CustomButton
              title="Register"
              onPress={handleRegister}
              disabled={!isFormValid}
              buttonStyle={styles.button}
            />
          </View>
        </ScrollView>

        {/* ================= CALENDAR ================= */}

        <CustomCalendar
          visible={showBirthPicker}
          maxDate={new Date()}
          onDateSelect={(date: string) => {
            setDob(date);
            validateField("dob", date);
            setShowBirthPicker(false);
          }}
        />

        {/* ================= OTP MODAL ================= */}

        <Modal
          visible={showOtpModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.otpTitle}>
                Verify OTP
              </Text>

              <Text style={styles.otpSubTitle}>
                Enter the OTP sent to your mobile
                number
              </Text>

              <OtpInput
                onChangeOTP={(code: any) =>
                  setOtp(code)
                }
              />

              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handelSubmit}
              >
                <Text style={styles.verifyText}>
                  Verify OTP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setShowOtpModal(false)
                }
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF7F1",
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  backIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#111",
  },

  headerText: {
    fontSize: 20,
    color: "#111",
    fontFamily: "Poppins-SemiBold",
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 4,
  },

  title: {
    fontSize: 24,
    color: "#111",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },

  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },

  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Poppins-Regular",
  },

  button: {
    backgroundColor: colors.primary,
    marginTop: 24,
    borderRadius: 14,
    height: 55,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  eyeButton: {
    position: "absolute",
    right: 15,
    top: 48,
    zIndex: 10,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
  },

  otpTitle: {
    fontSize: 24,
    color: "#111",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },

  otpSubTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    fontFamily: "Poppins-Regular",
  },

  verifyButton: {
    height: 55,
    backgroundColor: "#FF6B00",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  verifyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },

  cancelText: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
}); 