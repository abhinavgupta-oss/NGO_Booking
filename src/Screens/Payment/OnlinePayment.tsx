import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../../Component/Toast/ToastContext';
import { BookingPaymentUpdate } from '../../Services/Booking/BookingService';
import CustomeLoading from '../../Component/Loading/CustomeLoading';


const OnlinePayment = () => {
    const { showToast } = useToast();

    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const { paymentUrl } = route.params || {};

    const [loading, setLoading] = useState(true);
    const paymentHandled = useRef(false);

    const handleNavigationChange = async (navState: any) => {
        const { url } = navState;
        if (!url || paymentHandled.current) return;

        try {
            const urlObj = new URL(url);
            console.log("Payment URL", urlObj)
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
                if(resp?.status){
                    showToast(resp?.message,"success")
                    const returnData = {
                        ...paymentUrl,
                        paymentId:resp?.result?.paymentId
                    }
                    navigation.replace("ConfirmedBookingScreen",{billData:returnData})
                }
                console.log("BookingPaymentUpdate",resp)

                console.log("successData", successData)
                return;
            }

            // ❌ FAILED
            if (finalStatus === 'failed') {
                paymentHandled.current = true;

                const failedData = {
                    PaymentId: paymentId,
                    PaymentStatusId: 3,
                };
                console.log("successData", failedData)

                showToast("Payment Failed", 'error');

                navigation.goBack();
                return;
            }
        } catch (error) {
            console.log('URL parse error', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                <WebView
                    source={{ uri: paymentUrl?.paymentUrl }}
                    style={styles.webview}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={handleNavigationChange}
                />
            </View>

            <CustomeLoading isLoading={loading}/>
        </View>
    );
};

export default OnlinePayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 25,
        fontFamily: "Poppins-SemiBold"
    },
    closeText: {
        color: '#f87171',
        fontSize: 15,
    },
    webview: {
        flex: 1,
    },
    loader: {
        position: 'absolute',
        zIndex: 10,
        top: '50%',
        alignSelf: 'center',
    },
});