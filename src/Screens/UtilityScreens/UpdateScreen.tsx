import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../utility/utility";
import DeviceInfo from "react-native-device-info";
import { isUserLoggedIn } from "../../Stores/AuthStore/AuthStorage";

const UpdateScreen = ({ route }) => {
  const navigation = useNavigation();
  const { latest } = route?.params || {}
  const handleUpdate = () => {
    // Open Play Store / App Store
  };

  const handleLater = async() => {
    const isLoggedIn = await isUserLoggedIn();
    if (isLoggedIn) {
      navigation.replace("Dashboard");
    } else {
      navigation.replace("Login");
    }
  };

  console.log("latest", latest)


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#ED7723"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#ED7723", "#F59E0B"]}
          style={styles.header}
        >
          <Image
            source={Images.update}
            style={styles.updateImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* CONTENT */}
        <View style={styles.content}>

          <View style={styles.badge}>
            <MaterialIcons
              name="new-releases"
              size={16}
              color="#ED7723"
            />
            <Text style={styles.badgeText}>
              New Update Available
            </Text>
          </View>

          <Text style={styles.title}>
            Update Available!
          </Text>

          <Text style={styles.description}>
            A new version of the app is ready.
            Update now to enjoy the latest
            features and improvements.
          </Text>

          {/* VERSION CARD */}
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.leftRow}>
                <MaterialIcons
                  name="sell"
                  size={20}
                  color="#ED7723"
                />
                <Text style={styles.label}>
                  Current Version
                </Text>
              </View>

              <Text style={styles.value}>
                {DeviceInfo.getVersion()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.leftRow}>
                <MaterialIcons
                  name="star"
                  size={20}
                  color="#ED7723"
                />
                <Text style={styles.label}>
                  Latest Version
                </Text>
              </View>

              <Text style={styles.value}>
                {latest?.versionName}
              </Text>
            </View>
          </View>

          {/* UPDATE BUTTON */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleUpdate}
          >
            <LinearGradient
              colors={[
                "#ED7723",
                "#F59E0B",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateButton}
            >
              <Text
                style={styles.updateText}
              >
                Update Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLater}
          >
            <Text style={styles.laterText}>
              Update Later
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  updateImage: {
    width: 460,
    height: 350,
  },

  content: {
    paddingHorizontal: 20,
    marginTop: -20,
  },

  badge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 15,
  },

  badgeText: {
    color: "#ED7723",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 25,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 16,
    color: "#111",
    marginLeft: 10,
    fontWeight: "500",
  },

  value: {
    fontSize: 16,
    color: "#111",
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F1F1",
  },

  featureCard: {
    backgroundColor: "#FFF8F2",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },

  featureTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ED7723",
    marginBottom: 15,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  featureText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#444",
  },

  updateButton: {
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 25,
  },

  updateText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },

  laterText: {
    textAlign: "center",
    color: "#ED7723",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
  },

  tagline: {
    textAlign: "center",
    color: "#ED7723",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 25,
  },
});