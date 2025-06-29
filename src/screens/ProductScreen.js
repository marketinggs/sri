import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import data from '../../data/data.json';
import { CartContext } from '../context/CartContext';

const colors = {
  primary: '#FFDB01',
  background: '#1D1D1D',
  text: '#FFFFFF',
  accent: '#453447'
};

export default function ProductScreen() {
  const route = useRoute();
  const { addToCart } = useContext(CartContext);

  const product = data.foods.find(f => f.id === route.params.id);
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.desc}>{product.description}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={() => addToCart(product)}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: 20
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 20
  },
  name: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold'
  },
  desc: {
    color: colors.text,
    textAlign: 'center',
    marginVertical: 10
  },
  price: {
    color: colors.primary,
    fontSize: 20,
    marginBottom: 20
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
  },
  text: {
    color: colors.text
  }
});
