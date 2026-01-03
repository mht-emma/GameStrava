import React, { useContext } from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={() => <Text>Login</Text>} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={() => <Text>Home</Text>} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
