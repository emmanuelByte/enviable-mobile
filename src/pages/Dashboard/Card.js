import React, { Component } from 'react';
import {
  View,
  Text,

  Image,
  TouchableWithoutFeedback,

  StyleSheet,

} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import fonts from '../../config/fonts';


export default function Card({ action, images = { primary, secondary }, card_style, image_styles = [{}, {}], main_image, secondary_image, text }) {
  return (
    <TouchableWithoutFeedback
      onPress={action}>
      <ShadowView style={card_style}>
        <Image
          source={images.secondary}
          style={image_styles[0]}
        />
        <View style={styles.colImage}>
          <Image
            source={images.primary}
            style={image_styles[1]}
          />
        </View>
        <View style={styles.colContent}>
          <Text style={styles.contentText}>{text}</Text>
        </View>
      </ShadowView>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  colContent: {
     
    flexDirection: 'column',
  },
  colImage: {
    width: '35%',
    alignSelf: 'center',
  },
  contentText: {
    color: '#000',
    marginTop: 10,
    fontSize: 11,
    textAlign: 'center',
    fontFamily: fonts.poppins.regular
  }

})