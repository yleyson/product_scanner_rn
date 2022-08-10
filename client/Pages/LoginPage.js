import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function LoginPage(props) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");


    useEffect(() => {
        props.setEmailProp(email)

    }, [email])


    useEffect(() => {
        props.setPassProp(pass)

    }, [[pass]])


    const GoToSignUp=()=>{
        debugger
        console.log(true);
        props.setVisibleProp()
    }

    return (
        <View >
            <TextInput
                style={styles.input}
                label="מייל"
                value={email}
                onChangeText={text => setEmail(text)}
                right={<TextInput.Icon name="email" />}
            />
            <TextInput
                style={styles.input}
                label="סיסמה"
                value={pass}
                secureTextEntry
                onChangeText={text => setPass(text)}
                right={<TextInput.Icon name="eye" />}
            />
            <TouchableOpacity 
                style={styles.forgot_pass}
                onPress={()=>GoToSignUp()}>
                <Text>אין לך עוד משתמש? לחץ כאן</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    input: {
        width: 250,
        height: 50,
        marginBottom: 20

    },
    forgot_pass: {
        marginBottom: 20,

    }

})