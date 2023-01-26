import React, { useRef, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput, Dimensions, Animated, View } from 'react-native';
import colors from '../constants/Colors';
import { AgeAction } from '../redux/slices/user';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

function Demo({ navigation }) {

    const dispatch = useDispatch();

    const [age, setAge] = useState(null);

    const saveAge = () => dispatch(AgeAction(age));
    const savedAge = useSelector(state => state.user.age);

    const goAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const lottie = require('../assets/animations/rocket.json');

    const rocketStyle = {
        transform: [
            {
                translateY: goAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -400],
                })
            },
        ],
    };

    const onGo = () => {
        saveAge();
        if (age)
            animatationPromise().then(() => navigation.navigate('Player'))
        else
            startShake()
    }

    const animatationPromise = () => {
        return new Promise((resolve, reject) => {
            Animated.timing(goAnim, {
                toValue: 1,
                duration: 2500,
                useNativeDriver: true
            }).start(async () => {
                resolve()
            })
        })
    }

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    }

    return (
        <SafeAreaView style={styles.body}>
            {/* Rocket animation */}
            <Animated.View style={rocketStyle} >
                <AnimatedLottieView
                    style={styles.lottie}
                    source={lottie}
                    autoPlay
                    loop={true}
                />
            </Animated.View>
            {/* Get age from user or show his age */}
            {savedAge ?
                <View style={styles.notice_container} >
                    <Text style={styles.notice} >
                        {`It's awesome! You are ${savedAge} years old.`}
                    </Text>
                </View>
                :
                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={number => setAge(number)}
                        value={age}
                        placeholder='Enter your age'
                        placeholderTextColor={colors.PURPLE}
                        keyboardType='number-pad'
                    />
                </Animated.View>
            }
            {/* Submit button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => { onGo() }}
            >
                <Text style={styles.button_text} >
                    {savedAge ? 'Reset' : 'Go!'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
};

export default Demo;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    lottie: {
        width: width,
        height: width,
    },
    notice_container: {
        height: 60,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notice: {
        fontSize: 20,
        color: colors.RED,
        fontWeight: '600',
    },
    input: {
        width: width * .8,
        height: 60,
        fontWeight: '700',
        color: colors.RED,
        margin: 10,
        fontSize: 18,
        borderWidth: 1,
        borderColor: colors.PURPLE,
        borderRadius: 20,
        textAlign: 'center'
    },
    button: {
        width: width * .8,
        margin: 10,
        backgroundColor: colors.PURPLE,
        borderRadius: 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_text: {
        fontSize: 20,
        color: colors.RED,
        fontWeight: '800'
    }
})