// src/screens/DonationPenDetails.tsx

import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    FlatList,
    ActivityIndicator,
    Modal,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";

import { DevoteeInVoiceDetails, DevoteeUpdateDetails } from "../../Services/Donation/DonationService";

import CustomInput from "../../Component/formComponent/CustomInput";

import CustomCalendar from "../../Component/formComponent/CustomCalendar";
import { GetCityList } from "../../Services/Utils/UtilsService";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";
import CustomButton from "../../Component/formComponent/CustomButton";

const DonationPenDetails = ({ route }) => {

    const navigation = useNavigation()

    const { paymentId, token } = route.params || "";

    console.log("paymentId", paymentId)
    console.log("token", token)

    // ======================
    // FORM STATES
    // ======================

    const [city, setCity] = useState("");

    const [selectedCityId, setSelectedCityId] =
        useState<number | null>(null);

    const [pincode, setPincode] = useState("");

    const [address, setAddress] = useState("");

    const [pan, setPan] = useState("");

    const [birthDate, setBirthDate] = useState("");

    const [anniversaryDate, setAnniversaryDate] =
        useState("");

    const [showBirthPicker, setShowBirthPicker] =
        useState(false);

    const [
        showAnniversaryPicker,
        setShowAnniversaryPicker,
    ] = useState(false);

    // ======================
    // CITY STATES
    // ======================

    const [cityList, setCityList] = useState<any[]>(
        [],
    );

    const [cityPage, setCityPage] = useState(1);

    const [cityLoading, setCityLoading] =
        useState(false);

    const [hasMoreCity, setHasMoreCity] =
        useState(true);

    const [
        showCityDropdown,
        setShowCityDropdown,
    ] = useState(false);

    // ======================
    // FETCH CITY
    // ======================

    const fetchCityList = async (
        searchText: string,
        page: number = 1,
        isLoadMore: boolean = false,
    ) => {
        try {
            setCityLoading(true);

            const payload = {
                pageNumber: page,
                pageSize: 10,
                searchText: searchText,
                // sortBy: "",
                // sortDirection: "",
                // branchCode: "",
                // eOrganizationBranchId: "",
                // organizationId: 0,
                // isActive: true,
                // stateId: 0,
            };

            const response =
                await GetCityList(payload);

            console.log(
                "CITY RESPONSE",
                response,
            );

            const cityData =
                response?.result || [];

            if (isLoadMore) {
                setCityList(prev => [
                    ...prev,
                    ...cityData,
                ]);
            } else {
                setCityList(cityData);
            }

            setHasMoreCity(
                cityData.length >= 10,
            );

            setShowCityDropdown(true);

        } catch (error: any) {

            console.log(
                "CITY ERROR",
                error,
            );

        } finally {

            setCityLoading(false);

        }
    };

    // ======================
    // SEARCH CITY
    // ======================

    const handleCitySearch = (
        text: string,
    ) => {

        setCity(text);

        setSelectedCityId(null);

        if (text.trim().length < 3) {

            setShowCityDropdown(false);

            setCityList([]);

            setCityPage(1);

            return;
        }

        setCityPage(1);

        fetchCityList(text, 1, false);
    };

    // ======================
    // LOAD MORE
    // ======================

    const handleLoadMoreCity = () => {

        if (
            cityLoading ||
            !hasMoreCity ||
            city.trim().length < 3
        ) {
            return;
        }

        const nextPage = cityPage + 1;

        setCityPage(nextPage);

        fetchCityList(
            city,
            nextPage,
            true,
        );
    };

    // ======================
    // SAVE
    // ======================

    const handelSaveDetails = async () => {

        try {

            const payloadForm = {
                "address": address,
                "anniversaryDate": anniversaryDate,
                "cityId": selectedCityId,
                "dob": birthDate,
                "panCardNumber": pan,
                "paymentId": paymentId,
                "pinCode": pincode,
                "token": token
            }

            console.log(
                "SAVE PAYLOAD",
                payloadForm,
            );

            const resp =
                await DevoteeUpdateDetails(
                    payloadForm,
                );
            if (resp?.status) {
                const respInvoice = await DevoteeInVoiceDetails(paymentId)
                navigation.replace("DevoteeReceipt", { InvoiceDetails: respInvoice?.result })
            }
            console.log(resp);

        } catch (error: any) {

            console.log(error);

        }
    };

    const handelSkipDetails = async () => {
        try {
            const respInvoice = await DevoteeInVoiceDetails(paymentId)
            navigation.replace("DevoteeReceipt", { InvoiceDetails: respInvoice?.result })

        } catch (error: any) {
            console.log(error)
        }
    }
    const parseDate = (dateStr: string) => {
        const [dd, mm, yyyy] = dateStr.split('/');

        return new Date(
            Number(yyyy),
            Number(mm) - 1,
            Number(dd),
        );
    };


    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor="#F7F7F7"
                barStyle="dark-content"
            />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >

                {/* SUCCESS */}
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View
                        style={styles.successCircle}
                    >
                        <MaterialIcons
                            name="check"
                            size={40}
                            color="#FFF"
                        />
                    </View>

                    <Text style={styles.title}>
                        धन्यवाद!
                    </Text>
                </View>
                <Text style={styles.subTitle}>
                    आपके सहयोग के लिए
                    हृदय से आभार
                </Text>

                {/* DIVIDER */}

                <View
                    style={
                        styles.dividerContainer
                    }
                >
                    <View style={styles.line} />

                    <Text
                        style={
                            styles.dividerText
                        }
                    >
                        अतिरिक्त जानकारी
                        (वैकल्पिक)
                    </Text>

                    <View style={styles.line} />
                </View>

                {/* ROW 1 */}

                <View
                    style={[
                        styles.formRow,
                        {
                            zIndex: showCityDropdown ? 9999 : 1,
                        },
                    ]}
                >
                    {/* CITY */}

                    <View
                        style={[
                            styles.inputWrapper,
                            {
                                zIndex: 99999,
                                elevation: 99999,
                            },
                        ]}
                    >
                        <Text style={styles.label}>
                            🏙️ शहर / City
                        </Text>

                        <View
                            style={{
                                overflow: "visible",
                            }}
                        >
                            <CustomInput
                                placeholder="Type 3+ chars..."
                                value={city}
                                onChangeText={handleCitySearch}
                                placeholderTextColor="#999"
                                icon="apartment"
                            />
                            {showCityDropdown && (
                                <Modal visible={showCityDropdown} transparent>
                                    <View style={styles.overlay}>
                                        <View style={styles.modalContainer}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, textAlign: "center", marginVertical: 10 }}>Select City</Text>

                                                <TouchableOpacity onPress={() => setShowCityDropdown(false)} style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                                                    <MaterialIcons
                                                        name="close"
                                                        size={24}
                                                        color="#000"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <CustomInput
                                                placeholder="Type 3+ chars..."
                                                value={city}
                                                onChangeText={handleCitySearch}
                                                placeholderTextColor="#999"
                                            />
                                            <FlatList
                                                data={cityList}
                                                nestedScrollEnabled
                                                keyboardShouldPersistTaps="handled"
                                                removeClippedSubviews={false}
                                                style={{
                                                    maxHeight: 220,
                                                }}
                                                keyExtractor={(
                                                    item,
                                                    index,
                                                ) => index.toString()}
                                                onEndReached={
                                                    handleLoadMoreCity
                                                }
                                                onEndReachedThreshold={0.5}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        style={styles.cityItem}
                                                        onPress={() => {
                                                            setCity(
                                                                item?.name,
                                                            );

                                                            setSelectedCityId(
                                                                item?.id,
                                                            );

                                                            setShowCityDropdown(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.cityText
                                                            }
                                                        >
                                                            {item?.name}, ({item?.stateName}), {item?.countryName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                                ListFooterComponent={
                                                    cityLoading ? (
                                                        <ActivityIndicator
                                                            size="small"
                                                            color={colors.primary}
                                                            style={{
                                                                marginVertical: 10,
                                                            }}
                                                        />
                                                    ) : null
                                                }
                                            />
                                        </View>
                                    </View>
                                </Modal>
                            )}
                        </View>
                    </View>

                    {/* PINCODE */}

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                            📍 Pincode
                        </Text>

                        <CustomInput
                            placeholder="6 digits"
                            value={pincode}
                            onChangeText={text =>
                                setPincode(
                                    text.replace(
                                        /[^0-9]/g,
                                        "",
                                    ),
                                )
                            }
                            maxLength={6}
                            keyboardType="number-pad"
                            placeholderTextColor="#999"
                            icon="home"
                        />
                    </View>
                </View>

                {/* ROW 2 */}

                <View style={styles.formRow}>

                    {/* ADDRESS */}

                    <View
                        style={
                            styles.inputWrapper
                        }
                    >

                        <Text style={styles.label}>
                            📍 Address
                        </Text>

                        <CustomInput
                            placeholder="Enter address"
                            value={address}
                            onChangeText={
                                setAddress
                            }
                            placeholderTextColor="#999"
                            icon="home"
                        />

                    </View>

                    {/* PAN */}

                    <View
                        style={
                            styles.inputWrapper
                        }
                    >

                        <Text style={styles.label}>
                            💳 PAN
                        </Text>

                        <CustomInput
                            placeholder="ABCDE1234F"
                            value={pan}
                            onChangeText={(
                                text,
                            ) =>
                                setPan(
                                    text
                                        .toUpperCase()
                                        .replace(
                                            /[^A-Z0-9]/g,
                                            "",
                                        ),
                                )
                            }
                            maxLength={10}
                            placeholderTextColor="#999"
                            icon="badge"
                        />

                    </View>

                </View>

                {/* DATE ROW */}

                <View style={styles.formRow}>

                    {/* DOB */}

                    <View
                        style={
                            styles.inputWrapper
                        }
                    >

                        <Text style={styles.label}>
                            🎂 DOB
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.dateInput
                            }
                            onPress={() =>
                                setShowBirthPicker(
                                    true,
                                )
                            }
                        >
                            <MaterialIcons
                                name="calendar-month"
                                size={22}
                                color="#9CA3AF"
                            />
                            <Text
                                style={[
                                    styles.dateText,
                                    !birthDate && {
                                        color:
                                            "#999",
                                    },
                                ]}
                            >
                                {birthDate ||
                                    "DD/MM/YYYY"}
                            </Text>


                        </TouchableOpacity>

                    </View>

                    {/* ANNIVERSARY */}

                    <View
                        style={
                            styles.inputWrapper
                        }
                    >

                        <Text style={styles.label}>
                            ❤️ Anniversary
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.dateInput
                            }
                            onPress={() =>
                                setShowAnniversaryPicker(
                                    true,
                                )
                            }
                        >

                            <MaterialIcons
                                name="calendar-month"
                                size={22}
                                color="#9CA3AF"
                            />
                            <Text
                                style={[
                                    styles.dateText,
                                    !anniversaryDate && {
                                        color:
                                            "#999",
                                    },
                                ]}
                            >
                                {anniversaryDate ||
                                    "DD/MM/YYYY"}
                            </Text>


                        </TouchableOpacity>

                    </View>

                </View>

                {/* BUTTONS */}

                <View style={styles.buttonRow}>

                    {/* <TouchableOpacity
                        style={
                            styles.saveButton
                        }
                        onPress={
                            handelSaveDetails
                        }
                    >

                        <MaterialIcons
                            name="save"
                            size={20}
                            color="#FFF"
                        />

                        <Text
                            style={
                                styles.saveText
                            }
                        >
                            Save
                        </Text>

                    </TouchableOpacity> */}

                    <CustomButton
                        title="Save"
                        onPress={handelSaveDetails}
                        buttonStyle={styles.saveButton}

                    />

                    <TouchableOpacity
                        style={
                            styles.skipButton
                        }
                        onPress={
                            handelSkipDetails
                        }
                    >

                        <Text
                            style={
                                styles.skipText
                            }
                        >
                            Skip
                        </Text>

                    </TouchableOpacity>

                </View>
            </ScrollView>
            {/* DOB */}

            <CustomCalendar
                visible={showBirthPicker}
                selectedDate={birthDate ? parseDate(birthDate) : parseDate("1/1/2001")}
                maxDate={new Date()}
                onDateSelect={date => {
                    setBirthDate(date);
                    setShowBirthPicker(
                        false,
                    );
                }}
            />

            {/* ANNIVERSARY */}

            <CustomCalendar
                visible={
                    showAnniversaryPicker
                }
                maxDate={new Date()}
                onDateSelect={date => {

                    setAnniversaryDate(
                        date,
                    );

                    setShowAnniversaryPicker(
                        false,
                    );

                }}
            />

        </View>
    );
};

export default DonationPenDetails;

const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",

        overflow: "visible",
    },

    formRow: {
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "visible",
    },

    inputWrapper: {
        width: "95%",
        position: "relative",
        overflow: "visible",
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    modalContainer: {
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 20,
        maxHeight: "75%",
    },

    dropdownContainer: {
        position: "absolute",
        top: 62,
        left: 0,
        right: 0,

        backgroundColor: "#FFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E5E5",

        zIndex: 99999,
        elevation: 30,

        maxHeight: 220,
    },

    cityItem: {
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F2",
    },

    cityText: {
        fontSize: 15,
        color: "#111",
    },

    scrollContainer: {
        padding: 20,
        paddingBottom: 80,
    },

    successCircle: {
        width: 60,
        height: 60,
        borderRadius: 45,
        backgroundColor: "#2DBE60",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
    },

    title: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 48,
        fontFamily: "Poppins-SemiBold",
        color: "#2AA84A",
        textAlign: "center",
    },

    subTitle: {
        marginTop: 10,
        fontSize: 18,
        color: "#666",
        textAlign: "center",
    },

    idContainer: {
        marginTop: 25,
        alignSelf: "center",
        backgroundColor: "#FFF",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },

    idText: {
        color: "#777",
        fontSize: 14,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 35,
        marginBottom: 25,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#DDD",
    },

    dividerText: {
        marginHorizontal: 12,
        color: "#999",
        fontSize: 14,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },

    input: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 14,
        paddingHorizontal: 15,
        height: 58,
        fontSize: 16,
        color: "#000",
    },

    dateInput: {
        height: 58,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 14,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",

    },

    dateText: {
        marginLeft: 15,
        fontSize: 16,
        color: "#000",
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },

    saveButton: {
        width: "48%",
        height: 56,
    },

    saveText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 8,
    },

    skipButton: {
        width: "48%",
        height: 45,
        borderRadius: 14,
        backgroundColor: "#ECECEC",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    skipText: {
        color: "#555",
        fontSize: 18,
        fontWeight: "700",
    },
});