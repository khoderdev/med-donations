import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../misc/colors";



const DonationDetails = ({ donation, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalContainer} onPress={onClose}>
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Donation Details</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.LIGHT} />
                        </Pressable>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{donation.name}</Text>
                        <Text style={styles.label}>Presentation:</Text>
                        <Text style={styles.value}>{donation.presentation}</Text>
                        <Text style={styles.label}>Form:</Text>
                        <Text style={styles.value}>{donation.form}</Text>
                        <Text style={styles.label}>Laboratory:</Text>
                        <Text style={styles.value}>{donation.laboratory}</Text>
                        <Text style={styles.label}>LOT#:</Text>
                        <Text style={styles.value}>{donation.scannedLot}</Text>
                        <Text style={styles.label}>EXP:</Text>
                        <Text style={styles.value}>{donation.scannedExp}</Text>
                        <Text style={styles.label}>GTIN:</Text>
                        <Text style={styles.value}>{donation.scannedGtin}</Text>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        backgroundColor: colors.DARK,
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.PRIMARY,
    },
    detailsContainer: {
        alignItems: "flex-start",
        width: "100%",
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
        color: colors.GRAY,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: colors.LIGHT,
    },
});

export default DonationDetails;
