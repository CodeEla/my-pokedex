import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { View } from "react-native";

import store from "@redux/store";
import { RootStackParamList } from "@navigation/types";

import HomeScreen from "@screens/HomeScreen";
import DetailsScreen from "@screens/DetailsScreen";
import ScannerScreen from "@screens/ScannerScreen";
import TrainerScreen from "@screens/TrainerScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home" 
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="Trainer" component={TrainerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
}
