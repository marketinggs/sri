import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import data from '../../data/data.json';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const colors = {
  primary: '#FFDB01',
  background: '#1D1D1D',
  text: '#FFFFFF',
  accent: '#453447',
  accent2: '#492B4B'
};

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();

  const categories = data.categories;
  const foods = data.foods.filter(f => !selectedCategory || f.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickEats</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={item => item.id}
        style={styles.categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryItem, selectedCategory === item.id && styles.categoryItemSelected]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Icon name={item.icon} size={24} color={colors.primary} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={foods}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.foodItem} onPress={() => navigation.navigate('Product', { id: item.id })}>
            <Image source={{ uri: item.image }} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDesc}>{item.description}</Text>
              <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20
  },
  categories: {
    marginBottom: 20
  },
  categoryItem: {
    backgroundColor: colors.accent,
    padding: 10,
    marginRight: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  categoryItemSelected: {
    backgroundColor: colors.accent2
  },
  categoryText: {
    color: colors.text,
    marginTop: 4
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden'
  },
  foodImage: {
    width: 100,
    height: 100
  },
  foodInfo: {
    flex: 1,
    padding: 10
  },
  foodName: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold'
  },
  foodDesc: {
    color: colors.text,
    marginTop: 4,
    marginBottom: 8
  },
  foodPrice: {
    color: colors.primary,
    fontWeight: '600'
  }
});
