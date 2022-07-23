import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import Registration from "./screens/Registration";
import AccountSetUp from "./screens/AccountSetUp";
import CreatePost from "./screens/CreatePost";
import CreateMeme from "./screens/CreateMeme";
import EditTemplate from "./screens/EditTemplate";
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

export const SignedInStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName="AccountSetUp"
      >
        <Stack.Screen name="AccountSetUp" component={AccountSetUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="CreateMeme" component={CreateMeme} />
        <Stack.Screen name="EditTemplate" component={EditTemplate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const SignedOutStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName="Registration"
      >
        <Stack.Screen name="Registration" component={Registration} />

        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
