import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';

const colors = {
  primary: '#FFDB01',
  background: '#1D1D1D',
  text: '#FFFFFF',
  accent: '#453447',
  accent2: '#492B4B'
};

export default function CartScreen() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigation = useNavigation();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name} x{item.qty}</Text>
            <Text style={styles.price}>${(item.price * item.qty).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Cart is empty</Text>}
      />
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutText}>Checkout (${total.toFixed(2)})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6
  },
  name: {
    color: colors.text,
    flex: 1
  },
  price: {
    color: colors.primary,
    marginRight: 10
  },
  remove: {
    color: colors.accent2
  },
  empty: {
    color: colors.text,
    textAlign: 'center'
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10
  },
  checkoutText: {
    color: '#000',
    fontWeight: 'bold'
  }
});
