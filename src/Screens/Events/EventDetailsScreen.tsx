import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { colors } from "../../utility/AppTheam";
import { useEventStore } from "../../Stores/useEventStore";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import { removeHtmlTags } from "../../Helper/HtmlTagHelper";

const EventDetailsScreen = ({ route, navigation }: any) => {

    const { eventId } = route.params;

    const { fetchEventDetails, eventDetails, loading, error } = useEventStore();

    useEffect(() => {
        EventDetails();
    }, []);

    const EventDetails = async () => {
        try {
            const resp = await fetchEventDetails({ eventId: eventId });
            console.log("Event Details:", resp);
        } catch (error) {
            console.log("Event Details Error:", error);
        }
    }



    // =========================
    // REMOVE HTML TAGS
    // =========================

   
    // =========================
    // STATUS COLOR
    // =========================

    const getStatusColor = (status: string) => {

        switch (status) {

            case "Published":
                return "#16A34A";

            case "Cancelled":
                return "#DC2626";

            case "Completed":
                return "#2563EB";

            default:
                return "#F59E0B";
        }
    };

    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor="#000"
                barStyle="light-content"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Image
                        source={{
                            uri: eventDetails?.bannerURL,
                        }}
                        style={styles.banner}
                    />

                    {/* BACK BUTTON */}

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color="#FFF"
                        />
                    </TouchableOpacity>

                    {/* STATUS */}

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    getStatusColor(
                                        eventDetails?.statusName
                                    ),
                            },
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {eventDetails?.statusName}
                        </Text>
                    </View>

                </View>

                {/* ================= CONTENT ================= */}

                <View style={styles.contentContainer}>

                    {/* TITLE */}

                    <Text style={styles.title}>
                        {eventDetails?.title}
                    </Text>

                    {eventDetails?.subTitle ? (
                        <Text style={styles.subTitle}>
                            {eventDetails?.subTitle}
                        </Text>
                    ) : null}

                    {/* TYPE */}

                    <View style={styles.typeContainer}>
                        <MaterialIcons
                            name="event-note"
                            size={18}
                            color={colors.primary}
                        />

                        <Text style={styles.typeText}>
                            {eventDetails?.eventTypeName}
                        </Text>
                    </View>

                    {/* ================= EVENT INFO CARD ================= */}

                    <LinearGradient
                        colors={["#FFF7ED", "#FFF"]}
                        style={styles.infoCard}
                    >

                        {/* DATE */}

                        <View style={styles.infoRow}>

                            <View style={styles.iconBox}>
                                <MaterialIcons
                                    name="calendar-month"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>
                                    Event Date
                                </Text>

                                <Text style={styles.infoValue}>
                                    {eventDetails?.startDate} {"to "}
                                    {eventDetails?.endDate}
                                </Text>
                            </View>

                        </View>

                        {/* TIME */}

                        <View style={styles.infoRow}>

                            <View style={styles.iconBox}>
                                <MaterialIcons
                                    name="access-time"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>
                                    Event Time
                                </Text>

                                <Text style={styles.infoValue}>
                                    {eventDetails?.startTimeHr}
                                    {eventDetails?.endTimeHr && (
                                        <>
                                            {" - "}
                                            {eventDetails?.endTimeHr}
                                        </>
                                    )}

                                </Text>
                            </View>

                        </View>

                        {/* VENUE */}

                        <View style={styles.infoRow}>

                            <View style={styles.iconBox}>
                                <MaterialIcons
                                    name="location-on"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>
                                    Venue
                                </Text>

                                <Text style={styles.infoValue}>
                                    {eventDetails?.venue}
                                </Text>

                                {eventDetails?.venueAddress ? (
                                    <Text style={styles.addressText}>
                                        {
                                            eventDetails?.venueAddress
                                        }
                                    </Text>
                                ) : null}

                            </View>

                        </View>

                        {/* DURATION */}

                        <View style={styles.infoRow}>

                            <View style={styles.iconBox}>
                                <MaterialIcons
                                    name="hourglass-bottom"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>
                                    Duration
                                </Text>

                                <Text style={styles.infoValue}>
                                    {eventDetails?.duration} Day
                                </Text>
                            </View>

                        </View>

                    </LinearGradient>

                    {/* ================= DESCRIPTION ================= */}

                    {eventDetails?.longDescription && (
                        <>
                            <Text style={styles.sectionTitle}>
                                About Event
                            </Text>

                            <Text style={styles.description}>
                                {removeHtmlTags(eventDetails?.longDescription)}
                            </Text>
                        </>
                    )}

                    {/* ================= EVENT SCHEDULE ================= */}

                    {eventDetails?.eventSchedules?.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>
                                Event Schedule
                            </Text>

                            {eventDetails?.eventSchedules?.map(
                                (schedule: any, index: number) => (

                                    <LinearGradient
                                        key={index}
                                        colors={["#FFFFFF", "#FFF7ED"]}
                                        style={styles.scheduleCard}
                                    >

                                        {/* HEADER */}

                                        <View style={styles.scheduleHeader}>

                                            <View style={styles.scheduleDateBox}>
                                                <MaterialIcons
                                                    name="calendar-month"
                                                    size={22}
                                                    color="#FFF"
                                                />
                                            </View>

                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.scheduleTitle}>
                                                    {schedule?.title}
                                                </Text>

                                                <Text style={styles.scheduleDate}>
                                                    {schedule?.date}
                                                </Text>
                                            </View>

                                        </View>

                                        {/* TIME */}

                                        <View style={styles.scheduleInfoRow}>
                                            <MaterialIcons
                                                name="access-time"
                                                size={18}
                                                color={colors.primary}
                                            />

                                            <Text style={styles.scheduleInfoText}>
                                                {schedule?.startTimeHr}
                                                {schedule?.endTimeHr
                                                    ? ` - ${schedule?.endTimeHr}`
                                                    : ""}
                                            </Text>
                                        </View>

                                        {/* DESCRIPTION */}

                                        {schedule?.shortDescription ? (
                                            <Text style={styles.scheduleDescription}>
                                                {removeHtmlTags(
                                                    schedule?.shortDescription
                                                )}
                                            </Text>
                                        ) : null}

                                    </LinearGradient>
                                )
                            )}
                        </>
                    )}

                    {/* ================= ORGANIZER ================= */}

                    {eventDetails?.eventRepresentative?.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>
                                Event Representatives
                            </Text>

                            {eventDetails?.eventRepresentative?.map(
                                (item: any, index: number) => (

                                    <View
                                        key={index}
                                        style={styles.organizerCard}
                                    >

                                        <View style={styles.organizerIcon}>
                                            <MaterialIcons
                                                name="person"
                                                size={24}
                                                color="#FFF"
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>

                                            <Text
                                                style={
                                                    styles.organizerName
                                                }
                                            >
                                                {item?.name}
                                            </Text>

                                            <View
                                                style={
                                                    styles.rolesContainer
                                                }
                                            >

                                                {item?.roles?.map(
                                                    (
                                                        role: string,
                                                        roleIndex: number
                                                    ) => (

                                                        <View
                                                            key={
                                                                roleIndex
                                                            }
                                                            style={
                                                                styles.roleBadge
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.roleText
                                                                }
                                                            >
                                                                {role}
                                                            </Text>
                                                        </View>
                                                    )
                                                )}

                                            </View>

                                        </View>

                                    </View>
                                )
                            )}
                        </>
                    )}

                    {/* ================= REGISTRATION BUTTON ================= */}

                    {eventDetails?.isRegistrationOpen ? (

                        <TouchableOpacity
                            style={styles.registerButton}
                        >
                            <Text
                                style={
                                    styles.registerButtonText
                                }
                            >
                                Register Now
                            </Text>
                        </TouchableOpacity>

                    ) : (

                        <View style={styles.closedButton}>
                            <Text style={styles.closedButtonText}>
                                Registration Closed
                            </Text>
                        </View>

                    )}

                </View>

            </ScrollView>

            <CustomeLoading isLoading={loading} />

        </View>
    );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    banner: {
        width: "100%",
        height: 280,
    },

    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        width: 42,
        height: 42,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    statusBadge: {
        position: "absolute",
        bottom: 20,
        right: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
    },

    statusText: {
        color: "#FFF",
        fontSize: 13,
        fontFamily: "Poppins-SemiBold",
    },

    contentContainer: {
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontFamily: "Poppins-SemiBold",
        color: "#111",
    },

    subTitle: {
        marginTop: 8,
        fontSize: 15,
        color: "#666",
        lineHeight: 22,
    },

    typeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },

    typeText: {
        marginLeft: 8,
        fontSize: 15,
        fontFamily: "Poppins-SemiBold",
        color: colors.primary,
    },

    infoCard: {
        marginTop: 25,
        borderRadius: 22,
        padding: 20,
        backgroundColor: "#FFF",
        elevation: 2,
    },

    infoRow: {
        flexDirection: "row",
        marginBottom: 22,
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        elevation: 1,
    },

    infoTextContainer: {
        flex: 1,
        justifyContent: "center",
    },

    infoLabel: {
        fontSize: 13,
        color: "#777",
        marginBottom: 4,
        fontFamily: "Poppins-SemiBold",

    },

    infoValue: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        color: "#111",
    },

    addressText: {
        marginTop: 5,
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },

    sectionTitle: {
        marginTop: 28,
        marginBottom: 12,
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
    },

    description: {
        fontSize: 15,
        color: "#555",
        lineHeight: 28,
        fontFamily: "Poppins-SemiBold",
        textAlign: "justify",

    },

    organizerCard: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 18,
        marginBottom: 15,
        alignItems: "center",
    },

    organizerIcon: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    organizerName: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",

        color: "#111",
    },

    rolesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },

    roleBadge: {
        backgroundColor: "#FFF3E8",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
        marginRight: 8,
        marginBottom: 8,
    },

    roleText: {
        color: colors.primary,
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",

    },

    registerButton: {
        marginTop: 35,
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: "center",
        marginBottom: 30,
    },

    registerButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",

    },

    closedButton: {
        marginTop: 35,
        backgroundColor: "#E5E5E5",
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: "center",
        marginBottom: 30,
    },

    closedButtonText: {
        color: "#666",
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",

    },

    scheduleCard: {
        marginTop: 15,
        borderRadius: 20,
        padding: 18,
        backgroundColor: "#FFF",
        elevation: 2,
    },

    scheduleHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    scheduleDateBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    scheduleTitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        color: "#111",
    },

    scheduleDate: {
        marginTop: 4,
        fontSize: 13,
        color: "#666",
        fontFamily: "Poppins-SemiBold",
    },

    scheduleInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    scheduleInfoText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
        fontFamily: "Poppins-SemiBold",
    },

    scheduleDescription: {
        fontSize: 14,
        color: "#555",
        lineHeight: 24,
        fontFamily: "Poppins-Regular",
    },
});