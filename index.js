// index.js (root)
import { registerRootComponent } from 'expo';
import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It ensures that whether you load the app in Expo Go or a native build, the App component is used.
registerRootComponent(App);
