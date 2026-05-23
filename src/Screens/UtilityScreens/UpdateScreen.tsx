import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateScreen = () => {
  const navigation = useNavigation();

  const handleUpdate = () => {
    // TODO: Add update logic
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.content}>
        <Text style={styles.title}>Update Available</Text>

        <Text style={styles.description}>
          A new version of the app is available. Please update the app to
          continue using all features.
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          activeOpacity={0.8}
        >
          <Text style={styles.updateText}>Update Now</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  bottomContainer: {
    width: "100%",
    alignItems: "center",
  },

  updateButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#ED7723",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  skipText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
});