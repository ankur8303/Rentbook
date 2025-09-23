import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../screens/LoginScreen";
import PDPScreen from "../screens/PDPScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
export type RootStackParamList = {
    Login: undefined;
    PDP: undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = ({ token }: { token: string | null }) => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                < Stack.Navigator initialRouteName={token ? "PDP" : "Login"} screenOptions={{ headerShown: false }
                }>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="PDP" component={PDPScreen} />
                </Stack.Navigator >
            </NavigationContainer>

        </SafeAreaProvider>

    )
}
export default RootNavigator;