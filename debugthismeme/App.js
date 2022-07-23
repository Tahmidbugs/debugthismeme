import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Registration from "./screens/Registration";
import AccountSetUp from "./screens/AccountSetUp";
import LoginScreen from "./screens/LoginScreen";
import Home from "./screens/Home";
import CreatePost from "./screens/CreatePost";
import AuthNavigation from "./AuthNavigation";
export default function App() {
  return <AuthNavigation />;
}
