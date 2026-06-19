import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";

import CustomInput from "../../../Component/formComponent/CustomInput";
import CustomButton from "../../../Component/formComponent/CustomButton";
import { useToast } from "../../../Component/Toast/ToastContext";
import {
    DevoteeLogin,
    DevoteeLoginwithPass,
    DevoteeSendOTP,
} from "../../../Services/Devotee/DevoteeServices";

import DeviceInfo from "react-native-device-info";
import OtpInput from "../../../Component/otpInput";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../../utility/utility";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../../utility/AppTheam";
import AppEnvironment from "../../../utility/AppEnvironment";
import CustomeLoading from "../../../Component/Loading/CustomeLoading";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // =========================
    // TOGGLE
    // =========================
    const [loginType, setLoginType] = useState<"OTP" | "PASSWORD">("OTP");

    // =========================
    // COMMON
    // =========================
    const [UserID, setUserID] = useState("");
    const [emailError, setEmailError] = useState("");

    // =========================
    // OTP LOGIN
    // =========================
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [showOtpArea, setShowOtpArea] = useState(false);
    const [isNumberEditable, setIsNumberEditable] = useState(true);
    const [timer, setTimer] = useState(30);

    // =========================
    // PASSWORD LOGIN
    // =========================
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // =========================
    // TIMER
    // =========================
    useEffect(() => {
        let interval: any;

        if (showOtpArea && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [showOtpArea, timer]);

    // =========================
    // VALIDATION
    // =========================
    const validateForm = () => {
        let isValid = true;

        if (!UserID.trim()) {
            setEmailError(
                loginType === "OTP"
                    ? "Phone number is required"
                    : "User ID is required"
            );
            isValid = false;
        } else {
            setEmailError("");
        }

        if (loginType === "PASSWORD" && !password.trim()) {
            setPasswordError("Password is required");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    // =========================
    // SEND OTP
    // =========================
    const handelSendOTP = async () => {
        try {
            setLoading(true);
            if (!UserID.trim()) {
                setEmailError("Phone number is required");
                return;
            }

            const OTPform = {
                emailOrMobile: UserID,
                branchCode: AppEnvironment.BRANCH_CODE,
            };

            const respOTP = await DevoteeSendOTP(OTPform);

            if (respOTP?.message) {
                showToast(respOTP?.message, "success");

                setShowOtpArea(true);
                setIsNumberEditable(false);

                setTimer(30);
            }
        } catch (error: any) {
            showToast(error?.customMessage || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOGIN With OTP
    // =========================
    const handelLogin = async () => {
        try {
            setLoading(true);
            if (!validateForm()) return;

            const Loginform = {
                emailOrMobile: UserID,
                otp: loginType === "OTP" ? otp : null,
                password: loginType === "PASSWORD" ? password : null,
                loginType: loginType,
                branchCode: AppEnvironment.BRANCH_CODE,
                deviceUserId: DeviceInfo.getDeviceId(),
                appVersionCode: "1",
            };

            const loginResp = await DevoteeLogin(Loginform);

            if (loginResp?.status) {
                showToast(loginResp?.message, "success");
                navigation.replace("Dashboard");
            }
        } catch (error: any) {
            showToast(error?.customMessage || "Login Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOGIN PASSWORD
    // =========================
    const handelLoginPassword = async () => {
        try {
            setLoading(true);
            if (!validateForm()) return;

            const LoginPass = {
                emailOrMobile: UserID,
                password: password,
                branchCode: AppEnvironment.BRANCH_CODE,
                deviceUserId: DeviceInfo.getDeviceId(),
                appVersionCode: "1",
            };

            const reppass = await DevoteeLoginwithPass(LoginPass);

            if (reppass?.status) {
                showToast(reppass?.message, "success");
                navigation.replace("Dashboard");
            }
        } catch (error: any) {
            showToast(error?.customMessage || "Login Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // EDIT NUMBER
    // =========================
    const handelEditNumber = () => {
        setIsNumberEditable(true);
        setShowOtpArea(false);
        setOtp(["", "", "", "", ""]);
        setTimer(30);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* ========================= */}
                {/* TOP BANNER */}
                {/* ========================= */}

                <LinearGradient
                    colors={[colors.primary, colors.secondry]}
                    style={styles.topContainer}
                >
                    <Image
                        source={Images.login}
                        style={styles.banner}
                        resizeMode="contain"
                    />
                </LinearGradient>

                {/* ========================= */}
                {/* CARD */}
                {/* ========================= */}

                <View style={styles.card}>
                    <Text style={styles.title}>
                        Welcome <Text style={styles.devoteeText}>Devotee 🙏</Text>
                    </Text>

                    <Text style={styles.subTitle}>
                        Login to continue your journey
                    </Text>

                    {/* ========================= */}
                    {/* TOGGLE */}
                    {/* ========================= */}

                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            testID="login-mode-otp"
                            accessibilityLabel="login-mode-otp"
                            style={[
                                styles.toggleButton,
                                loginType === "OTP" && styles.activeToggle,
                            ]}
                            onPress={() => {
                                setLoginType("OTP");
                                setShowOtpArea(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.toggleText,
                                    loginType === "OTP" &&
                                    styles.activeToggleText,
                                ]}
                            >
                                OTP
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            testID="login-mode-password"
                            accessibilityLabel="login-mode-password"
                            style={[
                                styles.toggleButton,
                                loginType === "PASSWORD" &&
                                styles.activeToggle,
                            ]}
                            onPress={() => {
                                setLoginType("PASSWORD");
                                setShowOtpArea(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.toggleText,
                                    loginType === "PASSWORD" &&
                                    styles.activeToggleText,
                                ]}
                            >
                                Password
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ========================= */}
                    {/* USER ID */}
                    {/* ========================= */}

                    <View style={styles.inputHeader}>
                        <Text style={styles.label}>
                            {/* {loginType === "OTP"
                                ? "Phone Number"
                                : "User ID"} */}
                            Phone Number
                        </Text>

                        {!isNumberEditable && loginType === "OTP" && (
                            <TouchableOpacity onPress={handelEditNumber}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <CustomInput
                        testID="login-Phone-input"
                        accessibilityLabel="login-Phone-input"
                        icon={"phone"}
                        placeholder={"Enter Phone Number"}
                        value={UserID}
                        editable={
                            loginType === "OTP"
                                ? isNumberEditable
                                : true
                        }
                        keyboardType={
                            loginType === "OTP"
                                ? "number-pad"
                                : "default"
                        }
                        onChangeText={(text) => {
                            setUserID(text);
                            setEmailError("");
                        }}
                        error={emailError}
                    />

                    {/* ========================= */}
                    {/* PASSWORD */}
                    {/* ========================= */}

                    {loginType === "PASSWORD" && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.label}>Password</Text>

                            <View style={{ position: "relative" }}>
                                <CustomInput
                                    testID="login-Password-input"
                                    accessibilityLabel="login-Password-input"
                                    icon="lock"
                                    placeholder="Enter Password or DOB"
                                    value={password}
                                    secureTextEntry={!showPassword}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setPasswordError("");
                                    }}
                                    error={passwordError}
                                />

                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        right: 15,
                                        top: 18,
                                    }}
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
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* ========================= */}
                    {/* FORGET PASSWORD */}
                    {/* ========================= */}

                    {loginType === "PASSWORD" && (
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <Pressable onPress={() => navigation.navigate("ForgetPassword")}>
                                <Text style={styles.linkText}>Forget Password</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* ========================= */}
                    {/* OTP AREA */}
                    {/* ========================= */}

                    {showOtpArea && loginType === "OTP" && (
                        <View style={styles.otpContainer}>
                            <Text style={styles.otpTitle}>
                                Enter Verification OTP
                            </Text>

                            <OtpInput
                                onChangeOTP={(code) => setOtp(code)}
                            />

                            <View style={styles.resendContainer}>
                                {timer > 0 ? (
                                    <Text style={styles.timerText}>
                                        Resend OTP in {timer}s
                                    </Text>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handelSendOTP}
                                    >
                                        <Text style={styles.resendText}>
                                            Resend OTP
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* ========================= */}
                    {/* BUTTONS */}
                    {/* ========================= */}

                    {loginType === "OTP" ? (
                        !showOtpArea ? (
                            <CustomButton
                                testID="login-Send-OTP"
                                accessibilityLabel="login-Send-OTP"
                                title="Send OTP"
                                onPress={handelSendOTP}
                                buttonStyle={styles.button}
                            />
                        ) : (
                            <CustomButton
                                testID="user-loginOtp-action"
                                accessibilityLabel="user-loginOtp-action"
                                title="Login"
                                onPress={handelLogin}
                                buttonStyle={styles.button}
                            />
                        )
                    ) : (
                        <CustomButton
                            testID="user-loginPass-action"
                            accessibilityLabel="user-loginPass-action"
                            title="Login"
                            onPress={handelLoginPassword}
                            buttonStyle={styles.button}
                        />
                    )}

                    {/* ========================= */}
                    {/* REGISTER */}
                    {/* ========================= */}

                    <View style={styles.Textlinkarea}>
                        <Text style={styles.Textlink}>
                            New Devotee?
                        </Text>

                        <TouchableOpacity
                            testID="user-register-action"
                            accessibilityLabel="user-register-action"
                            onPress={() =>
                                navigation.navigate("Register")
                            }
                        >
                            <Text style={styles.linkText}>
                                Register Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <CustomeLoading isLoading={loading} />
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#FFF7F2",
        paddingBottom: 40,
    },

    // =========================
    // TOP
    // =========================

    topContainer: {
        height: 260,
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },

    banner: {
        width: "85%",
        height: 220,
    },

    // =========================
    // CARD
    // =========================

    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginTop: -35,
        borderRadius: 24,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },

    title: {
        fontSize: 25,
        fontFamily: "Poppins-SemiBold",
        color: "#1A1A1A",
    },

    devoteeText: {
        fontSize: 30,
        color: colors.primary,
    },

    subTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#777",
        marginTop: 4,
        marginBottom: 25,
        lineHeight: 22,
    },

    // =========================
    // TOGGLE
    // =========================

    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#F5F5F5",
        borderRadius: 14,
        padding: 5,
        marginBottom: 20,
    },

    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 10,
    },

    activeToggle: {
        backgroundColor: colors.primary,
    },

    toggleText: {
        fontSize: 14,
        fontFamily: "Poppins-SemiBold",
        color: "#777",
    },

    activeToggleText: {
        color: "#FFF",
    },

    // =========================
    // INPUT
    // =========================

    inputHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    label: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#333",
        marginBottom: 6,
    },

    editText: {
        color: colors.primary,
        fontSize: 13,
        fontFamily: "Poppins-SemiBold",
    },

    // =========================
    // OTP
    // =========================

    otpContainer: {
        alignItems: "center",
        marginTop: 18,
    },

    otpTitle: {
        fontSize: 15,
        fontFamily: "Poppins-SemiBold",
        color: "#333",
        // marginBottom: 18,
    },

    resendContainer: {
        marginTop: 20,
    },

    timerText: {
        color: "#888",
        fontSize: 14,
        fontFamily: "Poppins-Regular",
    },

    resendText: {
        color: colors.primary,
        fontSize: 15,
        fontFamily: "Poppins-SemiBold",
    },

    // =========================
    // BUTTON
    // =========================

    button: {
        marginTop: 24,
    },

    // =========================
    // FOOTER
    // =========================

    Textlinkarea: {
        marginTop: 22,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    Textlink: {
        fontSize: 15,
        fontFamily: "Poppins-Regular",
        color: "#555",
    },

    linkText: {
        fontSize: 15,
        fontFamily: "Poppins-SemiBold",
        color: colors.primary,
        marginLeft: 5,
    },
});