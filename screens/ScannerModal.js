import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { useDonationContext } from "../contexts/DonationContext";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SuccessMessage = ({ visible }) =>
  visible ? (
    <View style={styles.successMessage}>
      <AntDesign name="checkcircle" size={24} color="white" />
      <Text style={styles.successText}>Success</Text>
    </View>
  ) : null;

const ErrorMessage = ({ visible, message }) =>
  visible ? (
    <View style={styles.errorText}>
      <AntDesign name="exclamationcircle" size={24} color="white" />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  ) : null;

export default function ModalScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const { donationForm, setDonationForm, addDonation } = useDonationContext();
  const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
  const [showScannedInputs, setShowScannedInputs] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [touchedScreen, setTouchedScreen] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!touchedScreen) {
        Keyboard.dismiss();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [touchedScreen]);

  // const handleSubmit = async () => {
  //   try {
  //     Keyboard.dismiss();

  //     // Perform form validation
  //     if (
  //       !donationForm.scannedLot ||
  //       !donationForm.scannedExp ||
  //       !donationForm.scannedGtin
  //     ) {
  //       throw new Error("You must scan the required Barcode fields.");
  //     }

  //     // Add donation
  //     await addDonation();

  //     // Clear form fields only if submission is successful
  //     setDonationForm({
  //       name: "",
  //       presentation: "",
  //       form: "",
  //       laboratory: "",
  //       scannedLot: "",
  //       scannedExp: "",
  //       scannedGtin: "",
  //     });

  //     // Display success message
  //     setSuccessVisible(true);

  //     // Hide the success message after 2 seconds
  //     setTimeout(() => {
  //       setSuccessVisible(false);
  //     }, 2000);
  //   } catch (error) {
  //     if (error.message === "Failed to add donation") {
  //       setErrorMessage("Failed to add donation.");
  //     } else {
  //       setErrorMessage(error.message); // Handle other types of errors
  //     }
  //     setErrorVisible(true);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();

      // Perform form validation
      if (
        !donationForm.scannedLot ||
        !donationForm.scannedExp ||
        !donationForm.scannedGtin
      ) {
        throw new Error("You must scan the required Barcode fields.");
      }

      // Add timestamp to the donation
      const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format

      // Add donation with timestamp
      await addDonation({ ...donationForm, timestamp });

      // Clear form fields only if submission is successful
      setDonationForm({
        name: "",
        presentation: "",
        form: "",
        laboratory: "",
        scannedLot: "",
        scannedExp: "",
        scannedGtin: "",
      });

      // Display success message
      setSuccessVisible(true);

      // Hide the success message after 2 seconds
      setTimeout(() => {
        setSuccessVisible(false);
      }, 2000);
    } catch (error) {
      if (error.message === "Failed to add donation") {
        setErrorMessage("Failed to add donation.");
      } else {
        setErrorMessage(error.message); // Handle other types of errors
      }
      setErrorVisible(true);
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
    try {
      // Remove unwanted characters from the scanned data
      const cleanData = data.replace(/[^0-9A-Za-z↔]/g, "");

      // Extracting GTIN, LOT, and EXP from the cleaned scanned data
      const scannedGtin = cleanData.substring(1, 16);
      let scannedLot = cleanData.substring(16, 21); // Extracting 5-digit LOT value
      let scannedExp = cleanData.substring(21);

      // Manipulating the scanned LOT and EXP values
      scannedLot = scannedLot.substring(2) + scannedExp.substring(0, 2); // Remove first 2 digits from LOT and add first 2 digits from EXP
      scannedExp = scannedExp.substring(2); // Remove first 2 digits from EXP

      // Log individual scanned values
      console.log("Scanned GTIN:", scannedGtin);
      console.log("Scanned LOT:", scannedLot);
      console.log("Scanned EXP:", scannedExp);

      // Update state with the assigned data parts
      setDonationForm({ ...donationForm, scannedGtin, scannedLot, scannedExp });

      console.log("Scanned data:", cleanData); // Logging scanned data

      // Close the scan modal after scanning
      setScanBarcodeVisible(false);
    } catch (error) {
      // Logging error if any occurs during parsing scanned data
      console.error("Error parsing scanned data:", error);
      // Handle error, such as displaying an error message to the user
    }
    setShowScannedInputs(true);
  };

  const handleScanBarcode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setScanBarcodeVisible(true);
    } else {
      console.log("Camera permission denied");
    }
  };

  const handleCloseBarcodeModal = () => {
    setScanBarcodeVisible(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleZoomIn = () => {
    setZoom(zoom + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom > 0) {
      setZoom(zoom - 0.1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.inputsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                value={donationForm.name}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, name: text })
                }
                placeholder="Name"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === "name" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Presentation:</Text>
              <TextInput
                value={donationForm.presentation}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, presentation: text })
                }
                placeholder="Presentation"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === "presentation" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("presentation")}
                onBlur={handleBlur}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Form:</Text>
              <TextInput
                value={donationForm.form}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, form: text })
                }
                placeholder="Form"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === "form" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("form")}
                onBlur={handleBlur}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Laboratory:</Text>
              <TextInput
                value={donationForm.laboratory}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, laboratory: text })
                }
                placeholder="Laboratory"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === "laboratory" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("laboratory")}
                onBlur={handleBlur}
              />
            </View>

            {/* Conditionally Render the Scanned QR inputs after obtaining the data */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LOT#:</Text>
              {showScannedInputs && (
                <TextInput
                  value={donationForm.scannedLot}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, scannedLot: text })
                  }
                  placeholder="Scanned Lot#"
                  placeholderTextColor="#999"
                  style={styles.input}
                  editable={false}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EXP:</Text>
              {showScannedInputs && (
                <TextInput
                  value={donationForm.scannedExp}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, scannedExp: text })
                  }
                  placeholder="Scanned Exp"
                  placeholderTextColor="#999"
                  style={styles.input}
                  editable={false}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GTIN:</Text>
              {showScannedInputs && (
                <TextInput
                  value={donationForm.scannedGtin}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, scannedGtin: text })
                  }
                  placeholder="Scanned Gtin"
                  placeholderTextColor="#999"
                  style={styles.input}
                  editable={false}
                />
              )}
            </View>

            <SuccessMessage visible={successVisible} />

            <View style={styles.errorTextContainer}>
              <ErrorMessage visible={errorVisible} message={errorMessage} />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <MaterialCommunityIcons
        name="qrcode-scan"
        size={windowWidth * 0.1}
        style={styles.scanIcon}
        onPress={handleScanBarcode}
      />

      <Modal visible={scanBarcodeVisible} animationType="slide">
        <View style={styles.container}>
          <Camera
            style={[styles.camera, { width: windowWidth }]}
            type={type}
            zoom={zoom}
            autoFocus="on"
            onBarCodeScanned={handleBarcodeScanned}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseBarcodeModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <StatusBar
        backgroundColor={Platform.OS === "ios" ? "white" : "transparent"}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "#222831",
    position: "relative",
    padding: 10,
  },
  inputsContainer: {},
  input: {
    color: "#0096FF",
    height: windowHeight * 0.05,
    width: windowWidth * 0.8,
    marginVertical: windowHeight * 0.01,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#000",
    padding: 10,
  },
  placeholder: {
    color: "#999",
  },
  inputFocused: {
    borderColor: "#0096FF",
  },

  inputGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
    // marginBottom: 5,
  },
  label: {
    color: "#000",
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessage: {
    backgroundColor: "#00a651",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  successText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorTextContainer: {
    alignItems: "center",
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginLeft: 5,
    marginTop: 5,
  },
  closeButton: {
    position: "absolute",
    top: windowHeight * 0.05,
    right: windowWidth * 0.05,
    zIndex: 1,
  },
  scanIcon: {
    position: "absolute",
    color: "#00ffc0",
    bottom: windowHeight * 0.05,
    right: windowWidth * 0.1,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#00ffc0",
    fontWeight: "bold",
  },

  submitButton: {
    position: "absolute",
    bottom: -50,
    left: 100,
    zIndex: 1,
    backgroundColor: "#0096FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // zoomButton: {
  //   backgroundColor: "#0096FF",
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 5,
  //   marginVertical: 5,
  // },
  // zoomButtonText: {
  //   position:"absolute",
  //   bottom:70,
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  camera: {
    width: "100%",
    height: "100%",
  },
});
