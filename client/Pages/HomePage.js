import React, { useRef, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native';
import { IconButton, Colors, Button } from 'react-native-paper';




export default function HomePage({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.5)).current;


    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true
        }).start();
        Animated.sequence([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 0.5, useNativeDriver: true })
        ]).start();
    }, [])



    return (
        <View style={styles.container}>

            <Animated.View
                style={[
                    {
                        // Bind opacity to animated value
                        opacity: fadeAnim,
                    },
                ]}>
                <View style={styles.button_container}>
                    <IconButton
                        icon="camera"
                        color="#2986e2"
                        size={200}
                        onPress={() => navigation.navigate('מצלמה')}
                    />
                    <IconButton
                        icon="filter-variant"
                        color="#2986e2"
                        size={200}
                        onPress={() => navigation.navigate('אלרגיות')}
                    />
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button_container: {
    }
});

