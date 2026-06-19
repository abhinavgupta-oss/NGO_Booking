import {
    StatusBar, Image, StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { colors } from "../../utility/AppTheam";
import {
    useNavigation
} from "@react-navigation/native";
import { Images } from "../../utility/utility";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import CommonHeader from "../../Component/Header/CommonHeader";

const ConfirmedBookingScreen = ({route}) => {

    
     const { billData } = route.params || {};

     console.log("ConfirmedBookingScreen",billData)

    const navigation = useNavigation();
    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            {/* ================= HEADER ================= */}

            <CommonHeader title="Payment Successful" />
            

            <View style={styles.card}>

                {/* TOP ICON SECTION */}

                <View style={styles.imageWrapper}>

                    <Image
                        source={Images.login}
                        style={styles.roomImage}
                    />

                    <View style={styles.checkIcon}>

                        <MaterialIcons
                            name="check"
                            size={22}
                            color="#FFF"
                        />

                    </View>

                </View>

                {/* TITLE */}

                <Text style={styles.paymentText}>
                    Payment Successful!
                </Text>

                <Text style={styles.innerText}>
                    Your booking has been{"\n"}
                    confirmed successfully.
                </Text>

                {/* BOOKING INFO */}

                <View style={styles.infoContainer}>

                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>
                            Booking ID
                        </Text>
                        <Text style={styles.infoValue}>
                            {billData?.bookingId}
                        </Text>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>
                            Payment Id
                        </Text>
                        <Text style={styles.infoValue}>
                            {billData?.paymentId}
                        </Text>
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>
                            Total Amount
                        </Text>
                        <Text style={styles.infoValue}>
                            {billData?.tokenAmount}
                        </Text>
                    </View>

                    

                </View>

                {/* BUTTON */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.bookNowBtn} onPress={() =>
                        navigation.replace("MyBookingScreen")
                    }
                >

                    <Text style={styles.bookNowText}>
                        View My Booking
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8}
                    onPress={() =>
                        navigation.replace("Dashboard")
                    }>
                    <Text style={styles.backToHome}>
                        Back to Home
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default ConfirmedBookingScreen;

const styles = StyleSheet.create({

    card: {
        flex: 1,
        backgroundColor: "#FFF",
        margin: 16,
        borderRadius: 24,
        padding: 24,
        paddingBottom: 34,
        alignItems: "center",
    },

    imageWrapper: {
        width: 110,
        height: 110,
        borderRadius: 65,
        backgroundColor: "#FFF3E8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        position: "relative",
    },

    roomImage: {
        width: 90,
        height: 90,
        resizeMode: "contain",
    },

    checkIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#FFF",
    },

    paymentText: {
        fontSize: 24,
        color: colors.primary,
        fontFamily: "Poppins-Bold",
        marginTop: 16,
    },

    innerText: {
        fontSize: 15,
        color: "#777",
        textAlign: "center",
        lineHeight: 24,
        marginTop: 10,
        fontFamily: "Poppins-Regular",
    },

    infoContainer: {
        width: "100%",
        backgroundColor: "#FFF8F2",
        borderRadius: 18,
        // padding: 18,
        paddingTop:18,
        paddingHorizontal:30,
        marginTop: 24,
    },

    infoBlock: {
        marginBottom: 12,
    },

    infoLabel: {
        fontSize: 13,
        color: "#777",
        fontFamily: "Poppins-Regular",
    },

    infoValue: {
        fontSize: 13,
        color: "#111",
        marginTop: 4,
        fontFamily: "Poppins-Regular",
    },

    bookNowBtn: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 20,
    },

    bookNowText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },

    backToHome: {
        marginTop: 22,
        color: colors.primary,
        fontSize: 15,
        fontFamily: "Poppins-Bold",
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#F8F8F8",
    },
    header: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingHorizontal: 18,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 5,
    },
    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        color: "#FFF",
        fontSize: 18,
        flex: 1,
        textAlign: "center",
        fontFamily: "Poppins-SemiBold",
    },
})