import React, { useState, useEffect, useContext } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginPage from '../Pages/LoginPage';
import { UserContext } from '../Context/UserContext';
import SignUp from '../Pages/SignUp';

const apiUrl = 'http://proj10.ruppin-tech.co.il/api/Users?pass=';

const LoginModal = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [signUpVisible, setSignUpVisible] = useState(false);
    const [text, setText] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [userName, setUserName] = useState("");

    // const [user, setUser] = useState("");
    const { SignUpIn } = useContext(UserContext);
    const { LoginIn } = useContext(UserContext);
    const { user, SetUser } = useContext(UserContext);


    const changeState=()=>{
        setSignUpVisible(true)
        setModalVisible(false)
    }

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <LoginPage setVisibleProp={changeState}  setEmailProp={(emailInput) => setEmail(emailInput)} setPassProp={(passInput) => setPass(passInput)} />
                                <Button style={styles.buttonClose} mode="contained" color="black"
                                    onPress={() => { LoginIn(email, pass); setModalVisible(!modalVisible) }}>התחבר</Button>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableOpacity>
            </Modal>


            <Modal
                animationType="fade"
                transparent={true}
                visible={signUpVisible}
                onRequestClose={() => {
                    setSignUpVisible(!signUpVisible);
                }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPressOut={() => setSignUpVisible(!signUpVisible)}
                >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <SignUp setUserNameProp={(userNameInput)=>setUserName(userNameInput)} setEmailProp={(emailInput) => setEmail(emailInput)} setPassProp={(passInput) => setPass(passInput)} />
                                <Button style={styles.buttonClose} mode="contained" color="black"
                                    onPress={() => { SignUpIn(userName,email,pass); setSignUpVisible(!signUpVisible) }}>הרשם</Button>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableOpacity>
            </Modal>

            
            {user===null?<Button onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>התחבר</Button>:null}
            </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

});

export default LoginModal;