// // components/BackgroundImage.tsx
// import React from "react";
// import { ImageBackground, StyleSheet } from "react-native";

// type BackgroundImageProps = {
//   source: any; // e.g. require('../assets/bg.png') or { uri: '...' }
//   children?: React.ReactNode;
// };

// const BackgroundImage: React.FC<BackgroundImageProps> = ({ source, children }) => {
//   return (
//     <ImageBackground source={source} style={styles.background} resizeMode="cover">
//       {children}
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
// });

// export default BackgroundImage;


// components/BackgroundImage.tsx
import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";

type BackgroundImageProps = {
  source: ImageSourcePropType;
  style?: object;
};

const BackgroundImage: React.FC<BackgroundImageProps> = ({ source, style }) => {
  return (
    <Image source={source} style={[styles.image, style]} resizeMode="contain" />
  );
};

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    bottom: 0,       // stick to bottom
    // right: 0,        // stick to right
    width: 350,      // keep natural size
    height: 350,
    right: -70,   // adjust this until it hugs the edge
  },
});

export default BackgroundImage;
