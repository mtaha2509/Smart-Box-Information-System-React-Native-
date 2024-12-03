import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Added useNavigation for navigation
import { SERVER_URL } from '../env';

const OrdersPage = () => {
  const route = useRoute();
  const navigation = useNavigation(); // To navigate to OTP screen
  const { userId } = route.params; // Get userId from navigation params

  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Fetch orders from the server
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/users/getuserorders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Send userId to get orders
      });

      const data = await response.json();

      if (response.ok) {
        // Filter orders based on their status
        const pending = data.filter(order => order.status === 'initial_state');
        const completed = data.filter(order => order.status === 'finalized');

        setPendingOrders(pending);
        setCompletedOrders(completed);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const updateOrderStatus = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location');
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/users/updateorderstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxId: selectedOrder.box_id,
          location: selectedLocation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Order status updated');
        // Close modal and re-fetch orders
        setShowModal(false);
        setSelectedLocation('');
        fetchOrders(); // Re-fetch orders after update
      } else {
        Alert.alert('Error', data.message || 'Failed to update order status');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the order status');
      console.error(error);
    }
  };

  const handleOrderReceived = async (order) => {
    // Confirm with the user before receiving the order
    Alert.alert(
      'Receive Order',
      'Do you want to receive this order?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Generate OTP
              const response = await fetch(`${SERVER_URL}/api/users/generateotp`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const data = await response.json();

              if (response.ok && data.otp) {
                // Show OTP to the user
                Alert.alert('OTP', `Your OTP is: ${data.otp}`, [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to OTP entry screen, passing OTP
                      navigation.navigate('EnterOTP', { otp: data.otp, boxId: order.box_id });
                    },
                  },
                ]);
              } else {
                Alert.alert('Error', 'Failed to generate OTP');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while generating OTP');
              console.error(error);
            }
          },
        },
        {
          text: 'No',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Pending Orders</Text>
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={styles.orderCard}
              onPress={() => {
                setSelectedOrder(order);
                setShowModal(true);
              }}
            >
              <Text style={styles.orderText}>Order ID: {order._id}</Text>
              <Text style={styles.orderText}>Box ID: {order.box_id}</Text>
              <Text style={styles.orderText}>Size: {order.size}</Text>
              <Text style={styles.orderText}>Status: {order.status}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noOrders}>No pending orders</Text>
        )}

        <Text style={styles.heading}>Completed Orders</Text>
        {completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={styles.orderCard}
              onPress={() => handleOrderReceived(order)} // Handle order receipt
            >
              <Text style={styles.orderText}>Order ID: {order._id}</Text>
              <Text style={styles.orderText}>Box ID: {order.box_id}</Text>
              <Text style={styles.orderText}>Size: {order.size}</Text>
              <Text style={styles.orderText}>Status: {order.status}</Text>
              <Text style={styles.orderText}>Location: {order.location}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noOrders}>No completed orders</Text>
        )}
      </ScrollView>

      {/* Modal for selecting location */}
      {showModal && (
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeading}>Select Location</Text>
              {['askari X', 'gulberg', 'johar town', 'faisal town', 'DHA phase 6'].map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.modalButton,
                    selectedLocation === location && styles.selectedLocation, // Apply special style for selected location
                  ]}
                  onPress={() => {
                    setSelectedLocation(location);
                  }}
                >
                  <Text style={styles.modalButtonText}>{location}</Text>
                </TouchableOpacity>
              ))}
              <Button title="Update Order" onPress={updateOrderStatus} />
              <View style={{ marginTop: 10 }}>
                <Button title="Cancel" onPress={() => setShowModal(false)} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
  noOrders: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginVertical: 5,
    width

: '100%',
  },
  selectedLocation: {
    backgroundColor: '#dcdcdc', // Darker background for selected location
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default OrdersPage;