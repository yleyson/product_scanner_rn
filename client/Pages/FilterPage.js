import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Avatar, Card, Switch } from 'react-native-paper';

import { UserContext } from '../Context/UserContext';


export default function FilterPage() {
    const { sensitivity, setSensitivity } = useContext(UserContext);

    const onToggleSwitch = (id) => {

        setSensitivity(current => (
            current.map(sens => {
                if (sens.id === id)
                    return { ...sens, select: !sens.select }
                return sens
            }
            )
        ));
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 30, marginTop: 10, textAlign: 'center' }}>אלרגיות</Text>

            <View style={{ flex: 1, paddingTop: 40, paddingRight: 50, paddingLeft: 50 }}>
                <FlatList
                    data={sensitivity}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Card.Title
                            style={{ backgroundColor: item.select ? '#d1d5db' : 'white', borderColor: 'gray', borderWidth: 0.5, marginBottom: 20, borderRadius: 20 }}
                            title={item.title}
                            left={(props) => <Avatar.Icon style={{ backgroundColor: 'blue' }} size={40} icon={item.icon} />}
                            right={(props) => <Switch thumbColor='blue' trackColor={{ true: 'white', false: 'grey' }} value={item.select} onValueChange={() => onToggleSwitch(item.id)} />}
                        />
                    )}
                />


            </View>
        </View>
    )
}


const styles = StyleSheet.create({

});

