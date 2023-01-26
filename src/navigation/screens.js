import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Demo from "../screens/Demo";
import Player from "../screens/Player";
import colors from '../constants/Colors';

const Drawer = createDrawerNavigator();

export default function Screens() {

    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Demo"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.PURPLE
                    },
                    headerTintColor: 'white',
                    animation: 'fade'
                }}
            >
                <Drawer.Screen name="Demo" component={Demo} />
                <Drawer.Screen name="Player" component={Player} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}