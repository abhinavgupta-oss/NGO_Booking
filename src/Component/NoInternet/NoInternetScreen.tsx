import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Icons } from "../../utility/utility";
import { colors } from "../../utility/AppTheam";

const NoInternetScreen = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <LinearGradient
      colors={[colors.primary,colors.secondry]}
      style={styles.container}
    >
      {/* ICON */}
      <Image
        source={Icons.success}
        style={styles.icon}
      />

      {/* TITLE */}
      <Text style={styles.title}>You’re Offline</Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>
        No worries 💪{`\n`}
        Check your internet connection and get back to your fitness journey.
      </Text>

      {/* MOTIVATION LINE */}
      <Text style={styles.quote}>
        “Consistency beats excuses.”
      </Text>

      {/* RETRY BUTTON */}
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Retry Connection</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    width: 300,
    height: 300,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.95,
    marginBottom: 20,
  },
  quote: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#FFF",
    opacity: 0.9,
    marginBottom: 30,
  },
  retryBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 5,
  },
  retryText: {
    color: "#FF5722",
    fontWeight: "700",
    fontSize: 16,
  },
});
