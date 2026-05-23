import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import CustomInput from "../../Component/formComponent/CustomInput";
import { DonationPayment } from "../../Services/Donation/DonationService";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";
import AppEnvironment from "../../utility/AppEnvironment";

interface Props {
    visible: boolean;
    onClose: () => void;
    Details: any;
    onSubmit: (data: any) => void;
}

const DonationModal = ({
    visible,
    onClose,
    Details,
    onSubmit,
}: Props) => {

    const navigation: any = useNavigation();

    const [loading, setLoading] = useState(false);

    const [donationAmount, setDonationAmount] = useState(
        Details?.defaultAmount?.toString() || "0"
    );

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");

    const [nameError, setNameError] = useState("");
    const [mobileError, setMobileError] = useState("");

    const amountList = [
        501,
        1001,
        2100,
        5100,
        11000, 
        21000,
        51000,
    ];

    // =========================
    // REGEX
    // =========================

    const nameRegex = /^[A-Za-z ]{3,50}$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    // =========================
    // RESET
    // =========================

    useEffect(() => {

        if (visible) {

            setDonationAmount(
                Details?.defaultAmount?.toString() || "0"
            );

            setName("");
            setMobile("");

            setNameError("");
            setMobileError("");
        }

    }, [visible, Details]);

    // =========================
    // VALIDATE
    // =========================

    const validateForm = () => {

        let isValid = true;

        // NAME

        if (!name.trim()) {

            setNameError("Name is required");
            isValid = false;

        } else if (!nameRegex.test(name.trim())) {

            setNameError("Enter valid name");
            isValid = false;

        } else {

            setNameError("");
        }

        // MOBILE

        if (!mobile.trim()) {

            setMobileError(
                "Mobile number is required"
            );

            isValid = false;

        } else if (!mobileRegex.test(mobile)) {

            setMobileError(
                "Enter valid mobile number"
            );

            isValid = false;

        } else {

            setMobileError("");
        }

        return isValid;
    };

    // =========================
    // SUBMIT
    // =========================

    const handelProceedDonation = async () => {

        if (
            !donationAmount ||
            Number(donationAmount) <
            Number(Details?.defaultAmount)
        ) {
            return;
        }

        if (!validateForm()) return;

        try {

            setLoading(true);

            const Payment = {
                ESevaId: Details?.id,
                amount: Number(donationAmount),
                branchCode: AppEnvironment.BRANCH_CODE,
                mobile: mobile,
                name: name,
                paymentModeId: 1,
                paymentTypeId: 1,
            };
            onSubmit(Payment);

        } catch (error) {

            console.log(
                "Donation Payment Error",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            <View style={styles.modalOverlay}>

                <View style={styles.modalContainer}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        {/* HEADER */}

                        <View style={styles.modalHeader}>

                            <Text style={styles.modalTitle}>
                                Choose Donation Amount
                            </Text>

                            <TouchableOpacity
                                onPress={onClose}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={24}
                                    color="#000"
                                />
                            </TouchableOpacity>

                        </View>

                        {/* AMOUNT */}

                        <Text style={styles.inputLabel}>
                            Enter custom amount
                        </Text>

                        <View style={styles.amountInputContainer}>

                            <Text style={styles.rupee}>
                                ₹
                            </Text>

                            <TextInput
                                value={donationAmount}
                                keyboardType="number-pad"
                                maxLength={9}
                                placeholder="Enter Amount"
                                onChangeText={(text) => {

                                    const cleaned =
                                        text.replace(
                                            /[^0-9]/g,
                                            ""
                                        );

                                    setDonationAmount(
                                        cleaned || "0"
                                    );
                                }}
                                style={styles.amountInput}
                            />

                        </View>

                        {/* MIN AMOUNT */}

                        {(!donationAmount ||
                            Number(donationAmount) <
                            Number(
                                Details?.defaultAmount
                            )) && (

                                <Text style={styles.errorText}>
                                    Minimum donation amount is ₹
                                    {Details?.defaultAmount}
                                </Text>
                            )}

                        {/* QUICK AMOUNT */}

                        {Number(
                            Details?.defaultAmount
                        ) === 0 && (

                                <>
                                    <Text
                                        style={[
                                            styles.inputLabel,
                                            {
                                                marginTop: 25,
                                            },
                                        ]}
                                    >
                                        Quick Amounts
                                    </Text>

                                    <View
                                        style={
                                            styles.amountGrid
                                        }
                                    >

                                        {amountList.map(
                                            (
                                                amount,
                                                index
                                            ) => (

                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        styles.amountCard,

                                                        Number(
                                                            donationAmount
                                                        ) ===
                                                        amount &&
                                                        styles.activeAmountCard,
                                                    ]}
                                                    onPress={() =>
                                                        setDonationAmount(
                                                            amount.toString()
                                                        )
                                                    }
                                                >

                                                    <Text
                                                        style={[
                                                            styles.amountCardText,

                                                            Number(
                                                                donationAmount
                                                            ) ===
                                                            amount &&
                                                            styles.activeAmountText,
                                                        ]}
                                                    >
                                                        ₹
                                                        {amount.toLocaleString()}
                                                    </Text>

                                                </TouchableOpacity>
                                            )
                                        )}

                                    </View>
                                </>
                            )}

                        {/* DONATION CARD */}

                        <View style={styles.donationInfoCard}>

                            <View
                                style={
                                    styles.donationTopRow
                                }
                            >

                                <View
                                    style={{
                                        flexDirection:
                                            "row",
                                        flex: 1,
                                    }}
                                >

                                    <View
                                        style={
                                            styles.iconCircle
                                        }
                                    >
                                        <MaterialIcons
                                            name="favorite"
                                            size={20}
                                            color="#FFF"
                                        />
                                    </View>

                                    <View
                                        style={{
                                            marginLeft: 12,
                                            flex: 1,
                                        }}
                                    >

                                        <Text
                                            style={
                                                styles.donationText
                                            }
                                        >
                                            Donation
                                        </Text>

                                        <Text
                                            style={
                                                styles.donationSubText
                                            }
                                        >
                                            {
                                                Details?.title
                                            }
                                        </Text>

                                    </View>

                                </View>

                                <View
                                    style={{
                                        alignItems:
                                            "flex-end",
                                    }}
                                >

                                    <Text
                                        style={
                                            styles.youDonateText
                                        }
                                    >
                                        You are donating
                                    </Text>

                                    <Text
                                        style={
                                            styles.amountGreen
                                        }
                                    >
                                        ₹
                                        {
                                            donationAmount
                                        }
                                    </Text>

                                </View>

                            </View>

                            {/* NAME */}

                            <Text style={styles.formLabel}>
                                Name *
                            </Text>

                            <CustomInput
                                placeholder="Your full name"
                                value={name}
                                onChangeText={(text) => {

                                    const cleaned =
                                        text.replace(
                                            /[^A-Za-z ]/g,
                                            ""
                                        );

                                    setName(cleaned);

                                    if (!cleaned.trim()) {

                                        setNameError(
                                            "Name is required"
                                        );

                                    } else if (
                                        !nameRegex.test(
                                            cleaned.trim()
                                        )
                                    ) {

                                        setNameError(
                                            "Enter valid name"
                                        );

                                    } else {

                                        setNameError("");
                                    }
                                }}
                                onBlur={() => {

                                    if (!name.trim()) {

                                        setNameError(
                                            "Name is required"
                                        );

                                    } else if (
                                        !nameRegex.test(
                                            name.trim()
                                        )
                                    ) {

                                        setNameError(
                                            "Enter valid name"
                                        );

                                    } else {

                                        setNameError("");
                                    }
                                }}
                            />

                            {nameError ? (

                                <Text
                                    style={
                                        styles.validationText
                                    }
                                >
                                    {nameError}
                                </Text>

                            ) : null}

                            {/* MOBILE */}

                            <Text
                                style={[
                                    styles.formLabel,
                                    {
                                        marginTop: 15,
                                    },
                                ]}
                            >
                                Mobile Number *
                            </Text>

                            <View
                                style={
                                    styles.mobileContainer
                                }
                            >

                                <View
                                    style={
                                        styles.countryCode
                                    }
                                >
                                    <Text>
                                        +91
                                    </Text>
                                </View>

                                <TextInput
                                    placeholder="10 digit mobile number"
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    value={mobile}
                                    onChangeText={(text) => {

                                        const cleaned =
                                            text.replace(
                                                /[^0-9]/g,
                                                ""
                                            );

                                        setMobile(cleaned);

                                        if (
                                            !cleaned.trim()
                                        ) {

                                            setMobileError(
                                                "Mobile number is required"
                                            );

                                        } else if (
                                            !mobileRegex.test(
                                                cleaned
                                            )
                                        ) {

                                            setMobileError(
                                                "Enter valid mobile number"
                                            );

                                        } else {

                                            setMobileError(
                                                ""
                                            );
                                        }
                                    }}
                                    onBlur={() => {

                                        if (
                                            !mobile.trim()
                                        ) {

                                            setMobileError(
                                                "Mobile number is required"
                                            );

                                        } else if (
                                            !mobileRegex.test(
                                                mobile
                                            )
                                        ) {

                                            setMobileError(
                                                "Enter valid mobile number"
                                            );

                                        } else {

                                            setMobileError("");
                                        }
                                    }}
                                    style={
                                        styles.mobileInput
                                    }
                                />

                            </View>

                            {mobileError ? (

                                <Text
                                    style={
                                        styles.validationText
                                    }
                                >
                                    {mobileError}
                                </Text>

                            ) : null}

                            {/* BUTTON */}

                            <TouchableOpacity
                                onPress={
                                    handelProceedDonation
                                }
                                disabled={
                                    loading ||
                                    !donationAmount ||
                                    Number(
                                        donationAmount
                                    ) <
                                    Number(
                                        Details?.defaultAmount
                                    )
                                }
                                style={[
                                    styles.proceedButton,

                                    (loading ||
                                        !donationAmount ||
                                        Number(
                                            donationAmount
                                        ) <
                                        Number(
                                            Details?.defaultAmount
                                        )) && {
                                        opacity: 0.5,
                                    },
                                ]}
                            >

                                {loading ? (

                                    <ActivityIndicator
                                        color="#FFF"
                                    />

                                ) : (

                                    <Text
                                        style={
                                            styles.proceedText
                                        }
                                    >
                                        Proceed to Donate
                                    </Text>
                                )}

                            </TouchableOpacity>

                            {/* FOOTER */}

                            <View
                                style={
                                    styles.secureRow
                                }
                            >

                                <MaterialIcons
                                    name="lock"
                                    size={16}
                                    color="#777"
                                />

                                <Text
                                    style={
                                        styles.secureText
                                    }
                                >
                                    Secure payment • 80G receipt available
                                </Text>

                            </View>

                        </View>

                        {/* TAX NOTE */}

                        <View
                            style={styles.taxRow}
                        >

                            <MaterialIcons
                                name="verified"
                                size={18}
                                color="#D4A017"
                            />

                            <Text
                                style={
                                    styles.taxText
                                }
                            >
                                All donations are eligible for 80G tax exemption
                            </Text>

                        </View>

                    </ScrollView>

                </View>

            </View>
        </Modal>
    );
};

export default DonationModal;

const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },

    modalContainer: {
        backgroundColor: "#F8F5F1",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        maxHeight: "92%",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#8B0000",
    },

    inputLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        marginBottom: 12,
    },

    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 16,
        paddingHorizontal: 18,
        height: 65,
    },

    rupee: {
        fontSize: 28,
        fontWeight: "700",
        color: "#555",
    },

    amountInput: {
        flex: 1,
        fontSize: 26,
        marginLeft: 15,
        color: "#000",
    },

    errorText: {
        color: "red",
        marginTop: 8,
        fontSize: 13,
    },

    amountGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    amountCard: {
        width: "31%",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: "center",
        marginBottom: 15,
    },

    activeAmountCard: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    amountCardText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
    },

    activeAmountText: {
        color: "#FFF",
    },

    donationInfoCard: {
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 18,
        marginTop: 25,
    },

    donationTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    donationText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111",
    },

    donationSubText: {
        fontSize: 13,
        color: "#555",
        marginTop: 4,
    },

    youDonateText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#777",
    },

    amountGreen: {
        fontSize: 22,
        fontWeight: "700",
        color: "#0F9D58",
        marginTop: 4,
    },

    formLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111",
        marginBottom: 10,
    },

    mobileContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: 14,
        overflow: "hidden",
    },

    countryCode: {
        width: 70,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderColor: "#DADADA",
    },

    mobileInput: {
        flex: 1,
        paddingHorizontal: 15,
        height: 55,
    },

    proceedButton: {
        marginTop: 25,
        backgroundColor: "#E7924A",
        paddingVertical: 16,
        borderRadius: 40,
        alignItems: "center",
    },

    proceedText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },

    secureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
    },

    secureText: {
        marginLeft: 6,
        color: "#666",
        fontSize: 13,
    },

    taxRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        marginBottom: 20,
    },

    taxText: {
        marginLeft: 8,
        color: "#8B6B00",
        fontSize: 14,
        textAlign: "center",
    },

    validationText: {
        color: "red",
        fontSize: 13,
        marginLeft: 4,
        marginTop: 5,
    },
});