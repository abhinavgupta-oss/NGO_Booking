import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";

const RoomCard = ({ item, roomAvailable }: any) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.roomCard}>
      <LinearGradient
        colors={["#FFFFFF", "#FFF7ED"]}
        style={styles.roomGradient}
      >
        <Image
          source={{
            uri:
              item.imageUrl ||
              "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
          }}
          style={styles.roomImage}
        />

        <View style={styles.roomContent}>
          <View style={styles.topRow}>
            <Text
              numberOfLines={1}
              style={styles.roomTitle}
            >
              {item.roomTypeName}
            </Text>

            {item.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {item.discount}% OFF
                </Text>
              </View>
            )}
          </View>

          <View style={styles.facilityRow}>
            <View style={styles.facilityItem}>
              <MaterialIcons
                name="person"
                size={14}
                color="#777"
              />
              <Text style={styles.facilityText}>
                {item.maxGuests} Guests
              </Text>
            </View>

            <View style={styles.facilityItem}>
              <MaterialIcons
                name="bed"
                size={14}
                color="#777"
              />
              <Text style={styles.facilityText}>
                {item.numberOfBeds} Beds
              </Text>
            </View>
          </View>

          <View style={styles.amenitiesContainer}>
            {item.amenities
              ?.slice(0, 2)
              .map((amenity: any, index: number) => (
                <View
                  key={index}
                  style={styles.amenityChip}
                >
                  <MaterialIcons
                    name={amenity.icon || "check-circle"}
                    size={12}
                    color={colors.primary}
                  />

                  <Text
                    numberOfLines={1}
                    style={styles.amenityText}
                  >
                    {amenity.name}
                  </Text>
                </View>
              ))}
          </View>

          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              {item.discount > 0 && (
                <Text style={styles.oldPrice}>
                  ₹{item.totalPrice}
                </Text>
              )}

              <Text style={styles.priceText}>
                ₹{item.finalPrice}
              </Text>

              <Text style={styles.perNight}>
                /Night
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={() =>
                navigation.navigate(
                  "CreateBookingScreen",
                  {
                    bookingData: roomAvailable,
                    roomId: item.id,
                  }
                )
              }
            >
              <Text style={styles.bookNowText}>
                Book Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewDetailsBtn}
              onPress={() =>
                navigation.navigate(
                  "RoomDetailsScreen",
                  {
                    roomAvailable,
                    roomId: item.id,
                  }
                )
              }
            >
              <Text style={styles.viewDetailsText}>
                View Details
              </Text>

              <MaterialIcons
                name="arrow-forward-ios"
                size={12}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  roomCard: {
    marginBottom: 12,
  },

  roomGradient: {
    borderRadius: 16,
    padding: 8,
    flexDirection: "row",
    elevation: 2,
  },

  roomImage: {
    width: 85,
    height: 95,
    borderRadius: 14,
    backgroundColor: "#EEE",
  },

  roomContent: {
    flex: 1,
    marginLeft: 10,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roomTitle: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    fontFamily: "Poppins-SemiBold",
  },

  facilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },

  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },

  facilityText: {
    marginLeft: 3,
    fontSize: 11,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },

  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },

  amenityText: {
    marginLeft: 4,
    fontSize: 10,
    color: "#444",
    fontFamily: "Poppins-Medium",
  },

  priceRow: {
    marginTop: 2,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  oldPrice: {
    color: "#999",
    textDecorationLine: "line-through",
    fontSize: 11,
    marginRight: 6,
    fontFamily: "Poppins-Regular",
  },

  priceText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
  },

  perNight: {
    fontSize: 11,
    color: "#777",
    marginLeft: 4,
    marginBottom: 2,
    fontFamily: "Poppins-Regular",
  },

  discountBadge: {
    backgroundColor: "#E8F8EE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  discountText: {
    color: "#1B9C57",
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
  },

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  bookNowText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },

  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  viewDetailsText: {
    color: colors.primary,
    fontSize: 13,
    marginRight: 4,
    fontFamily: "Poppins-SemiBold",
  },
});