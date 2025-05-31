# WowWao React Native App

## Technical Stack

- **React Native**: 0.73.10
- **React**: 18.2.0
- **Node.js**: 18+
- **Package Manager**: npm
- **UI Libraries**: Native Base 3.4.26, React Native Elements, React Native Paper
- **Navigation**: React Navigation 3.13.0
- **HTTP Client**: Axios 0.19.0
- **Chat**: React Native Gifted Chat 0.13.0
- **Animations**: React Native Reanimated 1.3.0, React Native Animatable
- **Storage**: AsyncStorage 1.5.0

## Key Features

- Social media posts with media support
- Real-time chat functionality
- Image/video/audio recording and playback
- User profiles and authentication
- Push notifications
- Location services
- File management

## Dependencies

### Core

```json
"react": "18.2.0"
"react-native": "0.73.10"
"native-base": "3.4.26"
"react-navigation": "3.13.0"
"axios": "0.19.0"
```

### Media & Files

```json
"expo-image-picker": "^8.1.0"
"react-native-image-picker": "^1.1.0"
"react-native-image-crop-picker": "^0.26.1"
"react-native-fast-image": "^7.0.2"
"react-native-video": "^5.0.2"
"react-native-sound": "^0.11.0"
"react-native-voice-recorder": "^1.0.2"
"react-native-fs": "^2.16.2"
```

### UI/UX

```json
"react-native-gesture-handler": "1.5.0"
"react-native-reanimated": "^1.3.0"
"react-native-animatable": "^1.3.3"
"react-native-elements": "^1.2.6"
"react-native-paper": "^2.16.0"
"react-native-modal": "^11.5.3"
```

### Utilities

```json
"@react-native-community/async-storage": "1.5.0"
"react-native-device-info": "^5.3.1"
"react-native-permissions": "^2.0.4"
"expo-location": "^8.1.0"
"moment": "^2.24.0"
```

## Configuration

### Babel (`babel.config.js`)

```javascript
module.exports = {
  presets: ["@react-native/babel-preset"],
};
```

### Metro (`metro.config.js`)

```javascript
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const config = {};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Setup

```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Start Metro
npm start

# Run app
npm run ios    # iOS
npm run android # Android
```

## Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run iOS app
- `npm run android` - Run Android app
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Permissions Required

- Camera
- Photo Library
- Microphone
- Location
- Storage

## Critical Updates Needed

- **React Navigation**: 3.x → 6.x (security risk)
- **Axios**: 0.19.0 → 1.x (security vulnerabilities)
- **Gesture Handler**: 1.5.0 → 2.x
- **Reanimated**: 1.3.0 → 3.x
