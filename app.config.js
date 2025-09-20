import 'dotenv/config';

export default {
  expo: {
    name: "FarmWise",
    slug: "farmwise",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    extra: {
        ocrApiKey: process.env.OCR_API_KEY,
        openRouterApiKey: process.env.OPENROUTER_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY
    }
  }
};