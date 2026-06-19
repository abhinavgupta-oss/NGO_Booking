import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import CustomButton from "../../Component/formComponent/CustomButton";
import CustomInput from "../../Component/formComponent/CustomInput";
import CustomCalendar from "../../Component/formComponent/CustomCalendar";

interface Props {
  visible: boolean;
  onClose: () => void;
  profileData: any;
  onSave: (data: any) => void;
}

const ProfileUpdateModal = ({
  visible,
  onClose,
  profileData,
  onSave,
}: Props) => {
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    mobile: "",
    email: "",
    panNumber: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (profileData) {
      setForm({
        firstName: profileData?.firstName || "",
        middleName: profileData?.middleName || "",
        lastName: profileData?.lastName || "",
        dob: profileData?.dob || "",
        mobile: profileData?.mobile || "",
        email: profileData?.email || "",
        panNumber: profileData?.panNumber || "",
      });
    }
  }, [profileData]);

  const handleChange = (
    key: string,
    value: string,
  ) => {
    let updatedValue = value;

    if (key === "mobile") {
      updatedValue = value.replace(
        /[^0-9]/g,
        "",
      );
    }

    if (key === "panNumber") {
      updatedValue = value.toUpperCase();
    }

    setForm(prev => ({
      ...prev,
      [key]: updatedValue,
    }));

    validateField(key, updatedValue);
  };

  const validateField = (
    field: string,
    value: string,
  ) => {
    let error = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) {
          error = "Full Name is required";
        } else if (!/^[A-Za-z ]+$/.test(value.trim())) {
          error = "Only letters and spaces are allowed";
        } else if (value.trim().length > 45) {
          error = "Name must not exceed 45 characters";
        }
        break;

      case "middleName":
        if (!/^[A-Za-z ]+$/.test(value.trim())) {
          error = "Only letters and spaces are allowed";
        } else if (value.trim().length > 45) {
          error = "Name must not exceed 45 characters";
        }
        break;

      case "lastName":
        if (!/^[A-Za-z ]+$/.test(value.trim())) {
          error = "Only letters and spaces are allowed";
        } else if (value.trim().length > 45) {
          error = "Name must not exceed 45 characters";
        }
        break;

      case "mobile":
        if (!value.trim()) {
          error = "Mobile Number is required";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Enter valid 10 digit mobile number";
        }
        break;

      case "email":
        if (
          value &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          error = "Enter valid email address";
        }
        break;

      case "panNumber":
        if (
          value &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
            value.toUpperCase(),
          )
        ) {
          error = "Invalid PAN Number";
        }
        break;

      default:
        break;
    }

    setErrors((prev: any) => ({
      ...prev,
      [field]: error,
    }));

    return error;
  };

  const handleBlur = (
    field: keyof typeof form,
  ) => {
    validateField(field, form[field]);
  };

  const validate = () => {
    const validationErrors: any = {};

    const fieldsToValidate = [
      "firstName",
      "mobile",
      "email",
      "panNumber",
    ];

    fieldsToValidate.forEach(field => {
      const value =
        form[field as keyof typeof form];

      const error = validateField(
        field,
        value,
      );

      if (error) {
        validationErrors[field] = error;
      }
    });

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length ===
      0
    );
  };

  const submit = () => {
    if (!validate()) return;

    onSave(form);
  };

  const parseDate = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split('-');

    return new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>
                Update Profile
              </Text>

              <TouchableOpacity
                onPress={onClose}
              >
                <MaterialIcons
                  name="close"
                  size={25}
                  color="#111"
                />
              </TouchableOpacity>
            </View>

            <CustomInput
              label="First Name*"
              placeholder="Enter First Name"
              icon="person-outline"
              value={form.firstName}
              onChangeText={(text: string) =>
                handleChange("firstName", text)
              }
              onBlur={() =>
                handleBlur("firstName")
              }
            />

            {errors.firstName ? (
              <Text style={styles.errorText}>
                {errors.firstName}
              </Text>
            ) : null}

            <CustomInput
              label="Middle Name"
              placeholder="Enter Middle Name"
              icon="person-outline"
              value={form.middleName}
              onChangeText={(text: string) =>
                handleChange("middleName", text)
              }
            />
            {errors.middleName ? (
              <Text style={styles.errorText}>
                {errors.middleName}
              </Text>
            ) : null}

            <CustomInput
              label="Last Name"
              placeholder="Enter Last Name"
              icon="person-outline"
              value={form.lastName}
              onChangeText={(text: string) =>
                handleChange("lastName", text)
              }
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>
                {errors.lastName}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowBirthPicker(true)}
            >
              <View pointerEvents="none">

                <CustomInput
                  label="Date of Birth*"
                  placeholder="dd-mm-yyyy"
                  icon="calendar-today"
                  value={form.dob}
                  onChangeText={text =>
                    handleChange("dob", text)
                  }
                  editable={false}
                />

              </View>
            </TouchableOpacity>

            <CustomInput
              label="Mobile Number*"
              placeholder="Enter Mobile Number"
              icon="phone"
              keyboardType="number-pad"
              value={form.mobile}
              onChangeText={(text: string) =>
                handleChange("mobile", text)
              }
              onBlur={() =>
                handleBlur("mobile")
              }
            />

            {errors.mobile ? (
              <Text style={styles.errorText}>
                {errors.mobile}
              </Text>
            ) : null}

            <CustomInput
              label="Email"
              placeholder="Enter Email"
              icon="email"
              value={form.email}
              onChangeText={(text: string) =>
                handleChange("email", text)
              }
              onBlur={() =>
                handleBlur("email")
              }
            />

            {errors.email ? (
              <Text style={styles.errorText}>
                {errors.email}
              </Text>
            ) : null}

            <CustomInput
              label="PAN Number"
              placeholder="Enter PAN Number"
              icon="badge"
              value={form.panNumber}
              maxLength={10}
              autoCapitalize="characters"
              onChangeText={(text: string) =>
                handleChange("panNumber", text)
              }
              onBlur={() =>
                handleBlur("panNumber")
              }
            />

            {errors.panNumber ? (
              <Text style={styles.errorText}>
                {errors.panNumber}
              </Text>
            ) : null}

            <CustomButton
              title="Update Profile"
              onPress={submit}
              buttonStyle={styles.saveBtn}
            />

          </ScrollView>
          <CustomCalendar
            selectedDate={form.dob ? parseDate(form.dob) : parseDate("1/1/2001")}
            visible={showBirthPicker}
            maxDate={new Date()}
            onDateSelect={(date: string) => {
              handleChange("dob", date)
              setShowBirthPicker(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProfileUpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },

  container: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 20,
    maxHeight: "90%",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },

  label: {
    marginBottom: 6,
    marginTop: 10,
    fontFamily: "Poppins-Medium",
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#FFF",
  },

  error: {
    color: "#EF4444",
    marginTop: 4,
    fontSize: 12,
  },

  saveBtn: {
    marginTop: 25,
  },

  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  errorText: {
    color: "#E53935",
    fontSize: 11,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: "Poppins-Regular",
  },
});