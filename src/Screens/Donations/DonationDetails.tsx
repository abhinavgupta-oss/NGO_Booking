import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import DonationModal from "./DonationModal";
import { DonationPayment } from "../../Services/Donation/DonationService";
import DonationPaymentModel from "./DonationPaymentModel";
import { colors } from "../../utility/AppTheam";
import CustomeLoading from "../../Component/Loading/CustomeLoading";

const DonationDetails = ({ route, navigation }) => {
    const { Details } = route.params;
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentDetails, setpaymentDetails] = useState(false);

    const handelDonationSubmit = async (data: any) => {
        try {
            setLoading(true);
            console.log(data)

            const resp = await DonationPayment(data);

            if (resp?.status) { 
                setShowDonationModal(false)
                const URL = resp?.result
                console.log("URL", URL)
                setpaymentDetails(URL)
                setShowPaymentModal(true)
            }
        } catch (error: any) {

        }finally{
            setLoading(false);
        }

    };

    const handelDonationUpdate = async(data:any)=>{
        try{

        }catch(error:any){

        }
    }

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#000"
                barStyle="light-content"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >
                {/* ================= BANNER ================= */}

                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: Details?.bannerURL }}
                        style={styles.bannerImage}
                    />

                    {/* OVERLAY */}

                    <LinearGradient
                        colors={[
                            "transparent",
                            "rgba(0,0,0,0.7)",
                        ]}
                        style={styles.overlay}
                    />

                    {/* BACK BUTTON */}

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons
                            name="arrow-back-ios-new"
                            size={22}
                            color="#FFF"
                        />
                    </TouchableOpacity>

                    {/* TITLE */}

                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerTitle}>
                            {Details?.title}
                        </Text>

                        <Text style={styles.bannerSubTitle}>
                            {Details?.subTitle}
                        </Text>
                    </View>
                </View>

                {/* ================= CONTENT ================= */}

                <View style={styles.contentContainer}>
                    {/* STATUS */}

                    <View style={styles.statusRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {Details?.statusName}
                            </Text>
                        </View>

                        <View style={styles.badgeOrange}>
                            <Text style={styles.badgeOrangeText}>
                                {Details?.typeName}
                            </Text>
                        </View>
                    </View>

                    {/* DONATION CARD */}

                    <View style={styles.donationCard}>
                        <View style={styles.amountRow}>
                            <View>
                                <Text style={styles.amountLabel}>
                                    Goal Amount
                                </Text>

                                <Text style={styles.goalAmount}>
                                    ₹ {Details?.goalAmount}
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.amountLabel}>
                                    Raised
                                </Text>

                                <Text style={styles.raisedAmount}>
                                    ₹ {Details?.raisedAmount}
                                </Text>
                            </View>
                        </View>

                        {/* PROGRESS */}

                        <View style={styles.progressBarContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: `${Details?.progressPercentage}%`,
                                    },
                                ]}
                            />
                        </View>

                        <View style={styles.progressFooter}>
                            <Text style={styles.progressText}>
                                {Details?.progressPercentage}%
                                Completed
                            </Text>

                            <Text style={styles.progressText}>
                                {Details?.donorCount} Donors
                            </Text>
                        </View>
                    </View>

                    {/* DESCRIPTION */}

                    <Text style={styles.sectionTitle}>
                        About This Donation
                    </Text>

                    <Text style={styles.description}>
                        {Details?.shortDescription
                            ?.replace(/<[^>]*>/g, "")
                            ?.replace(/&nbsp;/g, " ")}
                    </Text>

                    <Text style={styles.longDescription}>
                        {Details?.longDescription
                            ?.replace(/<[^>]*>/g, "")
                            ?.replace(/&nbsp;/g, " ")}
                    </Text>

                    {/* EXTRA INFO */}

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="calendar-month"
                                size={20}
                                color={colors.primary}
                            />

                            <Text style={styles.infoText}>
                                Start Date : {Details?.startDate}
                            </Text>
                        </View>

                        {Details?.endDate && (
                            <View style={styles.infoRow}>
                                <MaterialIcons
                                    name="event"
                                    size={20}
                                    color={colors.primary}
                                />

                                <Text style={styles.infoText}>
                                    End Date : {Details?.endDate}
                                </Text>
                            </View>
                        )}
                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="favorite"
                                size={20}
                                color={colors.primary}
                            />

                            <Text style={styles.infoText}>
                                Minimum Donation : ₹
                                {Details?.defaultAmount}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* ================= FIXED BUTTON ================= */}

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setShowDonationModal(true);
                    }}
                    style={styles.donateButton}
                >
                    <Text style={{color:"#fff",fontSize:19,fontWeight:800}}>Donate Now</Text>
                </TouchableOpacity>
            </View>

            <DonationModal
                visible={showDonationModal}
                onClose={() =>
                    setShowDonationModal(false)
                }
                Details={Details}
                onSubmit={handelDonationSubmit}
            />

            <DonationPaymentModel
                visible={showPaymentModal}
                onClose={() =>
                    setShowPaymentModal(false)
                }
                Details={paymentDetails}
                onSubmit={handelDonationUpdate}
            />

            <CustomeLoading isLoading={loading} />  
        </View>
        
    );
};

export default DonationDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    // ================= IMAGE =================

    imageContainer: {
        height: 320,
    },

    bannerImage: {
        width: "100%",
        height: "100%",
    },

    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },

    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: "rgba(235, 121, 50, 0.57)",
        justifyContent: "center",
        alignItems: "center",
    },

    bannerContent: {
        position: "absolute",
        bottom: 25,
        left: 20,
        right: 20,
    },

    bannerTitle: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "700",
    },

    bannerSubTitle: {
        color: "#FFF",
        fontSize: 15,
        marginTop: 6,
        opacity: 0.9,
    },

    // ================= CONTENT =================

    contentContainer: {
        padding: 20,
    },

    statusRow: {
        flexDirection: "row",
        marginBottom: 20,
    },

    badge: {
        backgroundColor: "#E7F8EC",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
        marginRight: 10,
    },

    badgeText: {
        color: "#1C9B4A",
        fontWeight: "600",
    },

    badgeOrange: {
        backgroundColor: "#FFF3E8",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
    },

    badgeOrangeText: {
        color: colors.primary,
        fontWeight: "600",
    },

    // ================= DONATION CARD =================

    donationCard: {
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 20,
        elevation: 3,
        marginBottom: 25,
    },

    amountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    amountLabel: {
        fontSize: 14,
        color: "#777",
        marginBottom: 6,
    },

    goalAmount: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111",
    },

    raisedAmount: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.primary,
    },

    progressBarContainer: {
        width: "100%",
        height: 10,
        borderRadius: 10,
        backgroundColor: "#EEE",
        overflow: "hidden",
    },

    progressBar: {
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 10,
    },

    progressFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    progressText: {
        color: "#555",
        fontSize: 13,
        fontWeight: "500",
    },

    // ================= DESCRIPTION =================

    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
        marginBottom: 14,
    },

    description: {
        fontSize: 15,
        lineHeight: 24,
        color: "#444",
        marginBottom: 18,
    },

    longDescription: {
        fontSize: 15,
        lineHeight: 26,
        color: "#555",
    },

    // ================= INFO CARD =================

    infoCard: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 18,
        marginTop: 25,
        elevation: 2,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    infoText: {
        marginLeft: 12,
        fontSize: 15,
        color: "#333",
    },

    // ================= BOTTOM BUTTON =================

    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 18,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 20,
    },

    donateButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },

    donateButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },
});