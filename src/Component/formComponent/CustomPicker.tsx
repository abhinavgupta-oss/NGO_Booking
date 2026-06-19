import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { colors } from "../../utility/AppTheam";

interface PickerItem {
  [key: string]: any;
}

interface CustomPickerProps {
  data: PickerItem[];

  label?: string;

  // key show in UI
  displayKey: string;

  // key return in callback
  valueKey: string;

  placeholder?: string;

  // visible from parent
  visible: boolean;

  // close modal
  onClose: () => void;

  // return selected value
  onSelect: (
    value: any,
    item: PickerItem,
  ) => void;
}

const CustomPicker = ({
  data,
  displayKey,
  valueKey,
  placeholder = "Select",
  onSelect,
  visible,
  onClose,
}: CustomPickerProps) => {

  const handleSelect = (
    item: PickerItem,
  ) => {
    onSelect(item[valueKey], item);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      <View style={styles.overlay}>

        <View style={styles.modalContainer}>

          <Text style={styles.title}>
            {placeholder}
          </Text>

          <FlatList
            data={data}
            keyExtractor={(_, index) =>
              index.toString()
            }
            showsVerticalScrollIndicator={
              false
            }
            renderItem={({ item }) => (

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.itemButton}
                onPress={() =>
                  handleSelect(item)
                }
              >

                <Text style={styles.itemText}>
                  {item[displayKey]}
                </Text>

              </TouchableOpacity>

            )}
          />

          {/* CLOSE */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.closeButton}
            onPress={onClose}
          >

            <Text
              style={
                styles.closeButtonText
              }
            >
              Close
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </Modal>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
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

  title: {
    fontSize: 18,
    color: "#111",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },

  itemButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  itemText: {
    fontSize: 15,
    color: "#222",
    fontFamily: "Poppins-Regular",
  },

  closeButton: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },
});