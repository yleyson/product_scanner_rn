import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import IngredientModal from './IngredientModal';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../Context/UserContext';
import { AddImage } from '../Fetchs'


import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


let result = null
let image_to_show
export default function ProductCard({ item, Delete, product, index }) {
    const { productDict, setProductDict, imageLIst, setImageLIst, setProductList, productList } = useContext(UserContext);
    const [image, setImage] = useState(product.product_image)




    const pickImage = async (id) => {
        // No permissions request is necessary for launching the image library
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });



        if (!result.cancelled) {


            let resize_image = await compress_image(result.uri)
            console.log('resize_image', resize_image.image);
            console.log(resize_image);
            setProductList(current =>
                current.map(obj => {
                    if (obj.id_prod === product.id_prod) {
                        return { ...obj, product_image: resize_image.uri };
                    }
                    return obj;
                }),
            );


        }

    };



    const compress_image = async (uri) => {
        const manipResult = await manipulateAsync(
            uri,
            [{ resize: { width: 1000, height: 1050 } }],
            { compress: 0.7, format: SaveFormat.JPEG }
        );
        //    console.log(manipResult)
        return { image: manipResult, uri: manipResult.uri };
    };







    return (
        <Card style={styles.card_container}
            onPress={() => { pickImage(product.id_prod) }}>
            <Card.Content style={styles.title}>
                <Title>{item.name}</Title>
            </Card.Content>
            <Card.Cover
                source={product.product_image === "" ? require('../assets/image.jpg') :
                    { uri: product.product_image }
                }
                resizeMode={`cover`}
                style={{ height: 300, width: 250 }}
            />
            <Card.Actions style={styles.btn_container}>
                <IngredientModal ingredients={item.ing_list} />
                <Button color='black' onPress={() => Delete()}>מחיקה</Button>
            </Card.Actions>
        </Card>
    )

}




const styles = StyleSheet.create({
    card_container: {
        width: 300,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
    },
    title: {
        flex: 1,
        alignItems: 'center',
    },
    btn_container: {
        flex: 1,
        justifyContent: 'space-between',

    },
});


