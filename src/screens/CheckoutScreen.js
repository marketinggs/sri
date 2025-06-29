import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CartContext } from '../context/CartContext';

const colors = {
  primary: '#FFDB01',
  background: '#1D1D1D',
  text: '#FFFFFF',
  accent: '#453447'
};

export default function CheckoutScreen({ navigation }) {
  const { cartItems, clearCart } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleConfirm = () => {
    clearCart();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  total: {
    color: colors.text,
    fontSize: 20,
    marginBottom: 40
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold'
  }
});
