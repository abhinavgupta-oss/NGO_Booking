// components/CommonHeader.tsx

import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatListProperties,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";

interface CommonHeaderProps {
    title: string;
    isFilter?: boolean;
    onFilterPress?: () => void;
    showFilter?: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
    title,
    isFilter = false,
    onFilterPress,
}) => {
    const navigation  = useNavigation();
    return (
        <LinearGradient
            colors={[colors.primary, colors.secondry]}
            style={styles.header}
        >
            {/* Back Button */}
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

            {/* Title */}
            <Text style={styles.headerTitle}>
                {title}
            </Text>

            {/* Filter Button */}
            {isFilter ? (
                <TouchableOpacity
                    style={styles.filterTopBtn}
                    onPress={onFilterPress}
                >
                    <MaterialIcons
                        name="tune"
                        size={22}
                        color="#FFF"
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.emptyView} />
            )}
        </LinearGradient>
    );
};

export default CommonHeader;

const styles = StyleSheet.create({
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

    filterTopBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    headerTitle: {
        color: "#FFF",
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
    },
    emptyView: {
        width: 40,
    },
});