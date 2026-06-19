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

interface Props {
    visible: boolean;
    onClose: () => void;
    Details: any;
}

const DonationPaymentModel = ({
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
                    "isActive": true,
                    "razorpayPaymentLinkId": paymentId,
                    "razorpayPaymentReferenceId": signature,
                    "razorpayPaymentStatus": "Paid"
                }

                console.log("successData", successData)

                const updateDetails = await DonationPaymentVerify(successData)
                if (updateDetails?.status) {
                    showToast(updateDetails?.message, "success")
                    const Resp = updateDetails?.result
                    navigation.replace("DonationPenDetails",{paymentId:Resp?.paymentId,token:Details?.token})
                    onClose()
                }
                console.log("updateDetails", updateDetails)

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

                const updateDetails = await DonationPaymentVerify(successData)
                if (updateDetails?.status) {
                    showToast("Payment Failed", "error")
                    onClose()
                }

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

export default DonationPaymentModel;

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