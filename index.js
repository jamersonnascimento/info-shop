//The index.js file is the entry point for your React Native application when using Expo. 
// It sets up the environment and registers the main application component.
import { registerRootComponent } from 'expo'; // Import function to register the root component

import App from './App'; // Import the main App component

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App); // Register the App component as the root component
