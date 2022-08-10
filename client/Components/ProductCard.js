import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import IngredientModal from './IngredientModal';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../Context/UserContext';
import { AddImage } from '../Fetchs'


import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';


let result = null
let image_to_show
export default function ProductCard({ item, Delete, product, index }) {
    const { productDict, setProductDict, imageLIst, setImageLIst, setProductList, productList } = useContext(UserContext);
    const [image, setImage] = useState(product.product_image)

    const [uploadSql, setUploadSql] = useState(false)

    useEffect(async () => {
        if (uploadSql) {
            let json = { image: image, id: product.id_prod }
            await AddImage(json)
        }
        setUploadSql(false)

    }, [image])


    const pickImage = async (id) => {
        // No permissions request is necessary for launching the image library
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });



        if (!result.cancelled) {


            let resize_image = await compress_image(result.uri)
            console.log(resize_image);
            setProductList(current =>
                current.map(obj => {
                    if (obj.id_prod === product.id_prod) {
                        return { ...obj, product_image: resize_image };
                    }
                    return obj;
                }),
            );


        }

    };

    const uploadImage = async (blobFile) => {

        const sotrageRef = ref(storage, `images/${product.id_prod}+${new Date()}`); //LINE A
        const uploadTask = uploadBytesResumable(sotrageRef, blobFile); //LINE B
        uploadTask.on(
            "state_changed", null,
            (error) => console.log(error),

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { //LINE C
                    console.log("File available at", downloadURL);
                    setImage(downloadURL)


                    return downloadURL
                });
            }

        );
    }




    const imageUpload = async (imgUri, picName) => {

        let picName_str = `${picName}`
        let urlAPI = "http://proj10.ruppin-tech.co.il/uploadpicture/";
        let dataI = new FormData();
        dataI.append('image', {
            uri: imgUri,
            name: picName_str,
            type: 'image/jpg'
        });


        const config = {
            method: 'POST',
            body: dataI,
            headers: { "Content-Type": "multipart/form-data" },
        }
        console.log("dfdfdf", dataI);

        await fetch(urlAPI, config)
            .then((res) => {
                console.log(res.status)
                if (res.status == 201) { return res.json(); }
                else { return "err"; }
            })
            .then((responseData) => {
                if (responseData != "err") {
                    console.log(responseData)

                    let imageNameWithGUID = responseData.substring(responseData.indexOf('h'), responseData.indexOf('!'))

                    console.log("here7here7here7here7", imageNameWithGUID)

                    setProductList(current =>
                        current.map(obj => {
                            if (obj.id_prod === product.id_prod) {
                                return { ...obj, product_image: imageNameWithGUID + '.jpeg' };
                            }
                            return obj;
                        }),
                    );

                    console.log("img uploaded successfully!");
                }
                else { alert('error uploding ...'); }
            })
            .catch(err => { alert('err upload= ' + err); });


    }

    const compress_image = async (uri) => {
        const manipResult = await manipulateAsync(
            uri,
            [{ resize: { width: 640, height: 480 } }],
            { compress: 0.7, format: SaveFormat.JPEG }
        );
        //    console.log(manipResult)
        return manipResult.uri;
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
                style={{ flex: 1, width: 200, height: 300 }}

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


