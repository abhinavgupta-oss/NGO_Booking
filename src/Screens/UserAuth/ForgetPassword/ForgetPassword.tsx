import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import { colors } from "../../../utility/AppTheam";
import CommonHeader from "../../../Component/Header/CommonHeader";
import CustomInput from "../../../Component/formComponent/CustomInput";
import OtpInput from "../../../Component/otpInput";
import AppEnvironment from "../../../utility/AppEnvironment";
import { ForgetPasswordSendOTP, ForgetReSendOTP, ForgetResetPass, ForgetVerifySendOTP } from "../../../Services/ForgetPassword/ForgetService";
import { useToast } from "../../../Component/Toast/ToastContext";
import CustomeLoading from "../../../Component/Loading/CustomeLoading";
import CustomButton from "../../../Component/formComponent/CustomButton";
import { useNavigation } from "@react-navigation/native";



const ForgetPassword = () => {
    const { showToast } = useToast();
    const navigation = useNavigation()
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [section, setSection] = useState(1);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [loading, setLoading] = useState(false)

    const [newPassword, setNewPassword] = useState("");
    const [ConformPassword, setConformPassword] = useState("");

    const [shownewPassword, setShownewPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);

    const [PasswordError, setPasswordError] = useState("")
    const [ConformPasswordError, setConformPasswordError] = useState("")

    const sendOtp = async () => {
        try {
            setLoading(true)
            const forgetPayload = {
                "emailOrMobile": email,
                "branchCode": AppEnvironment.BRANCH_CODE
            }
            console.log(forgetPayload)

            const resp = await ForgetPasswordSendOTP(forgetPayload)
            showToast(resp?.message, "success");
            setShowOtpSection(true);

        } catch (error: any) {
            showToast(error?.customMessage, "error");

            console.log(error);
        } finally {
            setLoading(false)
        }
    };


    const ResendOtp = async () => {
        try {
            setLoading(true)
            const resendPayload = {
                "emailOrMobile": email,
                "branchCode": AppEnvironment.BRANCH_CODE
            }
            const resp = await ForgetReSendOTP(resendPayload)
            showToast(resp?.message, "success");
            setShowOtpSection(true);

        } catch (error: any) {
            showToast(error?.customMessage, "error");

            console.log(error);
        } finally {
            setLoading(false)
        }
    };


    const verifyOtp = async () => {
        try {
            // VERIFY OTP API
            const OtpVerify = {
                "emailOrMobile": email,
                "otp": otp
            }
            const resp = await ForgetVerifySendOTP(OtpVerify)
            console.log(resp)
            console.log("OTP Verified");
            setSection(2)
        } catch (error:any) {
            console.log(error);
        }
    };

    const validatePassword = () => {
        let isValid = true;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{6,}$/;

        if (!newPassword.trim()) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            isValid = false;
        } else if (!passwordRegex.test(newPassword)) {
            setPasswordError(
                "Password must contain Uppercase, Lowercase, Number and Special Character"
            );
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!ConformPassword.trim()) {
            setConformPasswordError("Confirm Password is required");
            isValid = false;
        } else if (newPassword !== ConformPassword || ConformPassword !== newPassword) {
            setConformPasswordError("Passwords do not match");
            isValid = false;
        }
        else {
            setConformPasswordError("");
        }

        return isValid;
    };

    const handelPasswordReset = async () => {
        try {
            if (!validatePassword()) {
                return;
            }

            setLoading(true)

            const resetForm =
            {
                "emailOrMobile": email,
                "otp": otp,
                "newPassword": newPassword,
                "confirmPassword": ConformPassword,
            }
            console.log("resetForm", resetForm)
            const resp = await ForgetResetPass(resetForm)
            console.log("ForgetResetPass", resp)
            if (resp?.status) {
                showToast(resp?.message, "success");
                navigation.goBack()
            }

        } catch (error: any) {
            showToast(error?.customMessage, "error");
            setSection(1)
            ResendOtp()
        } finally {
            setLoading(false)

        }
    }


    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{6,}$/;

    const resetActive =
        newPassword.length >= 6 &&
        passwordRegex.test(newPassword) &&
        newPassword === ConformPassword;


    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            <CommonHeader title="Forget Password" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >

                {section === 1 && (
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name="lock-reset"
                                size={55}
                                color={colors.primary}
                            />
                        </View>

                        <Text style={styles.title}>
                            Reset Password
                        </Text>

                        <Text style={styles.subtitle}>
                            Enter your email and current password to receive OTP
                        </Text>

                        {/* EMAIL */}

                        <View style={{ marginTop: 25 }}>
                            <Text style={styles.label}>Mobile Number</Text>

                            <CustomInput
                                icon="phone"
                                placeholder="Enter Mobile"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* SEND OTP */}

                        {!showOtpSection && (
                            <CustomButton
                                title="Send OTP"
                                onPress={sendOtp}
                            />
                        )}

                        {/* OTP SECTION */}

                        {showOtpSection && (
                            <>
                                <View style={{ marginTop: 15 }}>
                                    <OtpInput
                                        onChangeOTP={(code) => setOtp(code)}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.resendBtn}
                                    onPress={ResendOtp}
                                >
                                    <Text style={styles.resendText}>
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>

                                <CustomButton
                                    title="Verify OTP"
                                    onPress={verifyOtp}
                                />
                            </>
                        )}
                    </View>
                )}

                {section === 2 && (
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name="lock-reset"
                                size={55}
                                color={colors.primary}
                            />
                        </View>

                        <Text style={styles.title}>
                            Reset Password
                        </Text>

                        <Text style={styles.subtitle}>
                            Enter your New Password And Conform Password
                        </Text>

                        {/* ======================================= */}
                        {/* New PASSWORD */}
                        {/* ======================================= */}

                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.label}>New Password</Text>

                            <View style={{ position: "relative" }}>
                                <CustomInput
                                    icon="lock"
                                    placeholder="Enter Password"
                                    value={newPassword}
                                    secureTextEntry={!shownewPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);

                                        if (!text) {
                                            setPasswordError("Password is required");
                                        } else if (text.length < 6) {
                                            setPasswordError("Minimum 6 characters required");
                                        } else if (!passwordRegex.test(text)) {
                                            setPasswordError(
                                                "Must contain Uppercase, Lowercase, Number & Special Character"
                                            );
                                        } else {
                                            setPasswordError("");
                                        }
                                    }}
                                    error={PasswordError}
                                />

                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        right: 15,
                                        top: 18,
                                    }}
                                    onPress={() =>
                                        setShownewPassword(!shownewPassword)
                                    }
                                >
                                    <MaterialIcons
                                        name={
                                            shownewPassword
                                                ? "visibility-off"
                                                : "visibility"
                                        }
                                        size={24}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* ======================================= */}
                        {/* Conform PASSWORD */}
                        {/* ======================================= */}

                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.label}>Conform Password</Text>

                            <View style={{ position: "relative" }}>
                                <CustomInput
                                    icon="lock"
                                    placeholder="Enter Password"
                                    value={ConformPassword}
                                    secureTextEntry={!showConformPassword}
                                    onChangeText={(text) => {
                                        setConformPassword(text);
                                        if (!text) {
                                            setConformPasswordError("Confirm Password is required");
                                        } else if (newPassword !== text) {
                                            setConformPasswordError("Passwords do not match");
                                        } else {
                                            setConformPasswordError("");
                                        }
                                    }}
                                    error={ConformPasswordError}
                                />

                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        right: 15,
                                        top: 18,
                                    }}
                                    onPress={() =>
                                        setShowConformPassword(!showConformPassword)
                                    }
                                >
                                    <MaterialIcons
                                        name={
                                            showConformPassword
                                                ? "visibility-off"
                                                : "visibility"
                                        }
                                        size={24}
                                        color="#777"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <CustomButton
                            title="Reset Password"
                            onPress={handelPasswordReset}
                            disabled={!resetActive}
                        />
                    </View>
                )}
            </ScrollView>
            <CustomeLoading isLoading={loading} />
        </View>
    );
};

export default ForgetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },

    content: {
        padding: 20,
    },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 20,
        elevation: 3,
    },

    iconContainer: {
        alignSelf: "center",
        marginBottom: 15,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#222",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        lineHeight: 22,
    },

    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },

    button: {
        marginTop: 25,
        backgroundColor: colors.primary,
        height: 55,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },

    resendBtn: {
        marginVertical: 25,
        alignItems: "center",
    },

    resendText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "600",
    },
});