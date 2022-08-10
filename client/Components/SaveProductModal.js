import React, { useState, useContext } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { UserContext } from '../Context/UserContext';
import { Picker } from '@react-native-picker/picker';
import combo_list from '../ComboList';

const SaveProductModal = ({ saveProduct }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const { user } = useContext(UserContext);
    const [selectedCategory, setSelectedCategory] = useState("");

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
                    onPressOut={() => { setModalVisible(!modalVisible), setSelectedCategory("title") }
                    }
                >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column', }}>
                                    <TextInput
                                        style={{ height: 50 }}
                                        label="שם מוצר"
                                        value={name}
                                        onChangeText={text => setName(text)}
                                    />
                                    <View style={{ backgroundColor: '#e1e3e4', height: 50, borderRadius: 5 }}>
                                        <Picker

                                            style={{ height: 50, textDecorationLine: 'underline' }}
                                            selectedValue={selectedCategory}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setSelectedCategory(itemValue)

                                            }>
                                            <Picker.Item label="קטגוריה" color='#656769' enabled={false} value="tile" />
                                            {combo_list.map((item, index) => {
                                                return <Picker.Item key={index} label={item} value={item} />

                                            })}

                                        </Picker>
                                    </View>


                                    <Button style={styles.buttonClose} mode="contained" color="black"
                                        onPress={() => {

                                            if (name === "") {
                                                Alert.alert("חובה לרשום שם מוצר")

                                            }
                                            else if (selectedCategory === "" || selectedCategory === "title") {
                                                Alert.alert("חובה לבחור קטגוריה")
                                            }
                                            else {
                                                saveProduct(name, selectedCategory);
                                                setModalVisible(!modalVisible);
                                                setSelectedCategory("title");
                                            }
                                        }}>שמור</Button>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableOpacity>
            </Modal>
            <Button color='white' mode="contained"
                onPress={() => {
                    if (user === null) {
                        Alert.alert("חובה להתחבר כדי לשמור מוצר")
                    }
                    else
                        setModalVisible(true)
                }
                }
            >שמור מוצר</Button>
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
        width: 300,
        height: 300,
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

export default SaveProductModal;