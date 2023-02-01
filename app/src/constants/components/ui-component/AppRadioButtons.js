import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function AppRadioButtons({PROP, style, value, ...rest}) {
  return (
    <View style={style}>
      {PROP.map(res => {
        return (
          <View
            key={res.key}
            style={[
              styles.container,
              rest?.container,
              //   {flexDirection: flexDirection},
            ]}>
            <TouchableOpacity
              style={[styles.radioCircle, rest?.radioCircle]}
              onPress={() => {
                rest?.onChange(res);
              }}>
              {value === res.key && (
                <View style={[styles.selectedRb, rest?.selectedRb]} />
              )}
            </TouchableOpacity>
            <Text style={[styles.radioText, rest?.radioText]}>{res.text}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',

    // justifyContent: "space-between",
  },
  radioText: {
    // marginRight: 35,
    fontSize: 14,
    marginLeft: 10,
    color: '#000',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'black',
  },
});
