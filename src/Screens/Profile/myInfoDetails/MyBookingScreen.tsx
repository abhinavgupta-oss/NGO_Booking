import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../utility/AppTheam";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
    useRoute,
    useNavigation
} from "@react-navigation/native";
import { useState } from "react";

const MyBookingScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("upcoming");
    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            {/* ================= HEADER ================= */}

            <LinearGradient
                colors={[colors.primary, "#F59E0B"]}
                style={styles.header}
            >

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color="#FFF"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    My Bookings
                </Text>

                {/* Empty view for perfect center alignment */}
                <View style={{ width: 42 }} />

            </LinearGradient>


            <View style={styles.tabsContainer}>
                <TouchableOpacity activeOpacity={0.8} style={[styles.tabBtn, activeTab === "upcoming" && styles.activeTab]} onPress={() => setActiveTab("upcoming")}>
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "upcoming" && styles.activeTabText
                        ]}
                    >
                        Upcoming
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={[styles.tabBtn, activeTab === "completed" && styles.activeTab]} onPress={() => setActiveTab("completed")}>
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "completed" && styles.activeTabText
                        ]}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 140
                }}>
                <View style={styles.card}>
                    <Image
                        source={require("../../../assets/images/login.png")}
                        style={styles.image}
                    />


                    <View style={styles.content}>
                        <Text style={styles.roomTitle}>Deluxe Room</Text>
                        <Text style={styles.dateText}>20 May - 22 May 2024</Text>
                        <Text style={styles.bookingLabel}>
                            Booking ID
                        </Text>

                        <Text style={styles.bookingId}>
                            #BK124578
                        </Text>
                        <View style={styles.bottomRow}>

                            <Text style={styles.price}>₹2400</Text>

                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Confirmed</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

export default MyBookingScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    // ================= HEADER =================

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
    headerTitle: {
        color: "#FFF",
        fontSize: 18,
        flex: 1,
        textAlign: "center",
        fontFamily: "Poppins-SemiBold",
    },

    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    tabsContainer: {
        borderRadius: 14,
        padding: 4,
        elevation: 2,
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 18,
        height: 58,
    },

    tabBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        color: "#777",
        fontSize: 14,
        fontFamily: "Poppins-SemiBold",
    },

    activeTabText: {
        color: "#FFF",
    },

    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 18,
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    image: {
        width: 95,
        height: 95,
        borderRadius: 14,
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "space-between"
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12
    },
    statusBadge: {
        backgroundColor: "#E7F8EC",
        paddingHorizontal: 12,
        borderRadius: 20,
        paddingVertical: 6
    },
    statusText: {
        color: "#16A34A",
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
    },
    roomTitle: {
        fontSize: 18,
        color: "#111",
        fontFamily: "Poppins-Bold"
    },
    dateText: {
        marginTop: 6,
        color: "#666",
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },
    bookingId: {
        marginTop: 3,
        color: "#888",
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },
    bookingLabel: {
        marginTop: 15,
        color: "#999",
        fontSize: 12,
        fontFamily: "Poppins-Regular",
    },
    price: {
        fontSize: 20,
        color: "#111",
        fontFamily: "Poppins-Bold",
    },

})