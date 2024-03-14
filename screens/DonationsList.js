import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import { useDonationContext } from '../contexts/DonationContext';
import DonationDetails from './DonationDetails'; // Import your DonationDetails component

const Donation = () => {
  const { donations, fetchDonations } = useDonationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching donations...");
        await fetchDonations();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

  const handleDonationPress = (item) => {
    setSelectedDonation(item);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={donations}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDonationPress(item)}>
            <View style={styles.container}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Presentation: {item.presentation}</Text>
              <Text>Form: {item.form}</Text>
              <Text>Laboratory: {item.laboratory}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.PRIMARY]} 
          />
        }
      />
      {selectedDonation && (
        <DonationDetails
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },
  container: {
    backgroundColor: colors.PRIMARY,
    padding: 8,
    borderRadius: 10,
    marginVertical: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.LIGHT,
  },
});

export default Donation;