import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import RoomDetail from './screens/RoomDetail';
import colors from './colors';

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <AuthenticatedUserContext.Provider value={{ user, setUser }}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};

function HomeStack() {
    return (
        <Stack.Navigator defaultScreenOptions={Home}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen 
                name='RoomDetail' 
                component={RoomDetail}
                options={{
                    title: 'Room Details',
                    headerTintColor: colors.primary
                }}
            />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
        </Stack.Navigator>
    );
}

function RootNavigator() {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(
            auth,
            async authenticatedUser => {
                authenticatedUser ? setUser(authenticatedUser) : setUser(null);
                setIsLoading(false);
            }
        );
        return unsubscribeAuth;
    }, [user]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <HomeStack /> : <AuthStack />}
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthenticatedUserProvider>
            <RootNavigator />
        </AuthenticatedUserProvider>
    );
}