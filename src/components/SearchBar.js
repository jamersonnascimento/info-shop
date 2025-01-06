import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ value, onChangeText }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="O que você procura?"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,  // Arredonda os cantos
    marginBottom: 16,
    marginTop: 45,
    marginRight: 75,
    marginLeft: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 8,
  },
});

export default SearchBar;



