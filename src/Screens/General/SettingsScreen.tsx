import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useTheme } from "../../utility/AppTheam/ThemeContext";
import CommonHeader from "../../Component/Header/CommonHeader";
import DeviceInfo from "react-native-device-info";

const SettingsScreen = () => {
  const {
    darkMode,
    toggleTheme,
    colors,
  } = useTheme();

  const [notificationEnabled, setNotificationEnabled] =
    useState(true);
  const styles = createStyles(colors);

  const SettingRow = ({
    icon,
    title,
    onPress,
    rightComponent,
  }: any) => (
    <TouchableOpacity
      style={styles.settingRow}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <MaterialIcons
          name={icon}
          size={22}
          color={colors.primary}
        />

        <Text
          style={[
            styles.settingText,
            { color: colors.text },
          ]}
        >
          {title}
        </Text>
      </View>

      {rightComponent || (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color="#999"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <CommonHeader title="General Setting" />

      {/* Preferences */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Preferences
      </Text>

      <View style={styles.card}>
        <SettingRow
          icon="dark-mode"
          title="Dark Mode"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={toggleTheme}
            />
          }
        />

        <SettingRow
          icon="notifications"
          title="Notifications"
          rightComponent={
            <Switch
              value={notificationEnabled}
              onValueChange={
                setNotificationEnabled
              }
            />
          }
        />

        <SettingRow
          icon="language"
          title="Language"
        />
      </View>

      {/* General */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        General
      </Text>

      <View style={styles.card}>
        <SettingRow
          icon="privacy-tip"
          title="Privacy Policy"
        />

        <SettingRow
          icon="description"
          title="Terms & Conditions"
        />

        <SettingRow
          icon="help"
          title="Help & Support"
        />

        <SettingRow
          icon="info"
          title="About App"
        />
      </View>

      {/* App Info */}

      <View style={styles.versionCard}>
        <Text style={styles.versionTitle}>
          App Version
        </Text>

        <Text style={styles.versionText}>
          {DeviceInfo.getVersion()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    profileCard: {
      backgroundColor: colors.background,
      margin: 16,
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      elevation: 4,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#4F46E5",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },

    userName: {
      fontSize: 18,
      fontFamily: "Poppins-Bold",
    },

    email: {
      color: "#777",
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: 16,
      fontFamily: "Poppins-Bold",
      marginHorizontal: 16,
      marginBottom: 10,
      marginTop: 10,
    },

    card: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: 20,
      elevation: 3,
      marginBottom: 15,
    },

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
    },

    leftSection: {
      flexDirection: "row",
      alignItems: "center",
    },

    settingText: {
      marginLeft: 12,
      fontSize: 15,
      fontFamily: "Poppins-Medium",
    },

    versionCard: {
      marginHorizontal: 16,
      marginTop: 10,
      alignItems: "center",
    },

    versionTitle: {
      color: "#666",
      fontSize: 13,
    },

    versionText: {
      fontSize: 15,
      fontFamily: "Poppins-Bold",
      marginTop: 5,
      color:colors.text
    },

    logoutBtn: {
      backgroundColor: "#EF4444",
      margin: 20,
      borderRadius: 16,
      padding: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },

    logoutText: {
      color: "#FFF",
      fontSize: 16,
      marginLeft: 10,
      fontFamily: "Poppins-Bold",
    },
  });