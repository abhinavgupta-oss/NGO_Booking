// RegisterScreen.tsx

import React, { useState, useEffect } from "react";
import { GetCityList } from "../../../Services/Utils/UtilsService";

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
  ActivityIndicator,
} from "react-native";

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
import AppEnvironment from "../../../utility/AppEnvironment";
import CustomeLoading from "../../../Component/Loading/CustomeLoading";


const useDebounce = (value: string,) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 3000);

    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
};

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();

  // ================= STATES =================

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [cityList, setCityList] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const debouncedCity = useDebounce(city, 300);

  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const [errors, setErrors] = useState<any>({});

  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // ================= VALIDATION =================

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          error = "Full Name is required";
        } else if (!/^[A-Za-z ]+$/.test(value.trim())) {
          error = "Only letters and spaces are allowed";
        } else if (value.trim().length > 45) {
          error = "Name must not exceed 45 characters";
        }
        break;

      case "mobile":
        if (!value.trim()) {
          error = "Mobile Number is required";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Enter valid 10 digit mobile number";
        }
        break;

      // case "email":
      //   if (
      //     value &&
      //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
      //   ) {
      //     error = "Enter valid email address";
      //   }
      //   break;

      case "dob":
        if (!value.trim()) {
          error = "Date of Birth is required";
        }
        break;

      // case "address":
      //   if (!value.trim()) {
      //     error = "Address is required";
      //   }
      //   break;

      // case "password":
      //   if (!value.trim()) {
      //     error = "Password is required";
      //   } else if (value.length < 6) {
      //     error = "Password must be minimum 6 characters";
      //   }
      //   break;

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
    // const emailError = validateField("email", email);
    // const dobError = validateField("dob", dob);
    // const passwordError = validateField("password", password);

    return !(
      fullNameError ||
      mobileError
    );
  };



  const isFormValid =
    fullName.trim() &&
    /^[6-9]\d{9}$/.test(mobile) && dob && selectedCityId

  // ================= REGISTER =================

  const handleRegister = async () => {
    const isValid = validateForm();

    if (!isValid) return;
    setLoading(true);
    try {
      const payload = {
        name: fullName,
        mobile: mobile,
        dob: dob,
        cityId: selectedCityId,
        branchCode: AppEnvironment.BRANCH_CODE,
        isActive: true,
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
    } finally {
      setLoading(false);
    }
  };

  // ================= OTP VERIFY =================

  const handelSubmit = async () => {
    setLoading(true);
    try {
      const enteredOtp = otp;

      const Loginform = {
        emailOrMobile: mobile,
        otp: enteredOtp,
        branchCode: AppEnvironment.BRANCH_CODE,
        deviceUserId: DeviceInfo.getDeviceId(),
        appVersionCode: DeviceInfo.getVersion(),
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
    } finally {
      setLoading(false);
    }
  };


  const parseDate = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split('/');

    return new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
    );
  };




  // const handleCityChange = (text: string) => {
  //   setCity(text);
  //   setSelectedCityId(null);

  //   if (text.trim().length < 3) {
  //     setCityList([]);
  //     setShowDropdown(false);
  //   }
  // };

  const fetchCityList = async (searchText: string) => {
    try {
      if (searchText.trim().length < 3) {
        setCityList([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      setShowDropdown(true);

      const payload = {
        pageNumber: 1,
        pageSize: 10,
        searchText,
      };

      const response = await GetCityList(payload);

      const data = response?.result || [];

      setCityList(data);

      // ❗ IMPORTANT: if no data → close dropdown OR show message
      if (data.length === 0) {
        setShowDropdown(true); // show "No results"
      }
    } catch (err) {
      console.log(err);
      setCityList([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    // if city already selected -> don't search again
    if (selectedCityId) {
      return;
    }

    if (debouncedCity.trim().length >= 3) {
      fetchCityList(debouncedCity);
    }
  }, [debouncedCity, selectedCityId]);

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
          nestedScrollEnabled={true}
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
              label="Full Name*"
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
              label="Mobile Number*"
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

            {/* <CustomInput
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
            ) : null} */}

            {/* DOB */}

            <View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowBirthPicker(true)}
              >
                <View pointerEvents="none">

                  <CustomInput
                    label="Date of Birth*"
                    placeholder="dd-mm-yyyy"
                    icon="calendar-today"
                    value={dob}
                    onChangeText={setDob}
                    editable={false}
                  />

                </View>
              </TouchableOpacity>

              {/* {dob ? (

                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 15,
                    top: 42,
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setDob("")}
                >

                  <MaterialIcons
                    name="close"
                    size={20}
                    color="#777"
                  />

                </TouchableOpacity>

              ) : null} */}

            </View>

            {errors.dob ? (
              <Text style={styles.errorText}>
                {errors.dob}
              </Text>
            ) : null}

            {/* CITY */}

            <View style={styles.cityWrapper}>

              <CustomInput
                label="City*"
                placeholder="Search city"
                value={city}
                icon="location-city"
                onChangeText={(text: string) => {
                  setCity(text);
                  setSelectedCityId(null);

                  if (text.trim().length < 3) {
                    setCityList([]);
                    setShowDropdown(false);
                    return;
                  }

                  setShowDropdown(true);
                }}
              />

              {showDropdown && (
                <View style={styles.dropdownContainer}>

                  {loading ? (
                    <ActivityIndicator style={{ margin: 12 }} />
                  ) : cityList.length === 0 ? (
                    <Text style={styles.noResult}>
                      No results found
                    </Text>
                  ) : (
                    <View
                    >
                      {cityList.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.item}
                          onPress={() => {
                            setCity(`${item.name}, ${item.stateName}`);
                            setSelectedCityId(item.id);
                            setCityList([]);
                            setShowDropdown(false);
                          }}
                        >
                          <Text style={styles.cityText}>
                            {item.name}, {item.stateName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                </View>
              )}

            </View>
            {/* PASSWORD */}


            {/* <View style={{ position: "relative" }}>

              <CustomInput
                label="Password*"
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
                  size={22}
                  color="#777"
                />

              </TouchableOpacity>

            </View>


            {errors.password ? (
              <Text style={styles.errorText}>
                {errors.password}
              </Text>
            ) : null} */}

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

          <CustomeLoading isLoading={loading} />
        </ScrollView>

        {/* ================= CALENDAR ================= */}

        <CustomCalendar
          selectedDate={dob ? parseDate(dob) : parseDate("1/1/2001")}
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

              <CustomButton
                title="Verify OTP"
                onPress={handelSubmit}
                buttonStyle={styles.verifyButton}
              />
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
    </SafeAreaView >
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF7F1",
  },

  scrollContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  cityModal: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    maxHeight: "75%",
  },

  cityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  cityTitle: {
    fontSize: 20,
    color: "#111",
    fontFamily: "Poppins-SemiBold",
  },

  cityItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  cityItemText: {
    fontSize: 15,
    color: "#111",
    fontFamily: "Poppins-Regular",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  dropdownIcon: {
    position: "absolute",
    right: 15,
    top: 47,
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
    fontSize: 11,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: "Poppins-Regular",
  },

  button: {
    marginTop: 24,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    top: 32,
    height: 50,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
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
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
    color: "#000",
  },

  // dropdown: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 10,
  //   paddingHorizontal: 15,
  //   paddingVertical: 14,
  //   justifyContent: "center",
  // },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  dropdownModal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 300,
  },

  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemText: {
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 250,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 999,
  },

  cityText: {
    fontSize: 15,
    color: "#111",
  },

  noResult: {
    padding: 15,
    textAlign: "center",
    color: "#999",
  },

  cityWrapper: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownContainer: {
    position: "absolute",
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 220,
    overflow: "hidden",

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,

    zIndex: 9999,
  },
}); 