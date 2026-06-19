import React, { useEffect, useRef, useState } from "react";
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
import { DonationPayment, DonationPaymentVerify } from "../../Services/Donation/DonationService";
import { useNavigation } from "@react-navigation/native";
import WebView from "react-native-webview";
import { useToast } from "../../Component/Toast/ToastContext";
import { BookingPaymentUpdate } from "../../Services/Booking/BookingService";

interface Props {
    visible: boolean;
    onClose: () => void;
    Details: any;
}

const WebViewModel = ({
    visible,
    onClose,
    Details,
}: Props) => {
    const { showToast } = useToast();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const paymentHandled = useRef(false);

    const PayUrl = Details?.paymentUrl
    console.log(Details)


    const handleNavigationChange = async (navState: any) => {
        const { url } = navState;
        if (!url || paymentHandled.current) return;

        try {
            const urlObj = new URL(url);

            const linkStatus = urlObj.searchParams.get(
                'razorpay_payment_link_status'
            );

            const status = urlObj.searchParams.get('status');
            const razorpayPaymentLink = urlObj.searchParams.get('razorpay_payment_link_id');
            const paymentId =
                urlObj.searchParams.get('razorpay_payment_id') ||
                urlObj.pathname.split('/payments/')[1]?.split('/')[0] ||
                null;

            const signature = urlObj.searchParams.get(
                'razorpay_payment_link_reference_id'
            );

            const finalStatus = linkStatus || status;

            // ✅ SUCCESS
            if (finalStatus === 'paid' || finalStatus === 'captured') {
                paymentHandled.current = true;

                const successData = {
                    // "razorpayPaymentLink":razorpayPaymentLink,
                    "razorpayPaymentLinkId": razorpayPaymentLink,
                    "razorpayPaymentReferenceId": signature,
                    "razorpayPaymentStatus": "Paid"
                };

                const resp = await BookingPaymentUpdate(successData);
                if (resp?.status) {
                    showToast(resp?.message, "success")
                    navigation.replace("MyBookingScreen")
                }
                console.log("successData", successData)

                return;
            }

            // ❌ FAILED
            if (finalStatus === 'failed') {
                paymentHandled.current = true;

                const successData = {
                    "razorpayPaymentLinkId": paymentId,
                    // "razorpayPaymentReferenceId": signature,
                    "razorpayPaymentStatus": "Failed"
                }

                console.log("successData", successData)

                showToast("Payment Failed", 'error');

                navigation.goBack();
                return;
            }
        } catch (error) {
            console.log('URL parse error', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            <View style={styles.modalOverlay}>
                <WebView
                    source={{ uri: PayUrl }}
                    style={styles.webview}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={handleNavigationChange}
                />

            </View>
        </Modal>
    );
};

export default WebViewModel;

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
    }
})