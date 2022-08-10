import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import ProductCard from '../Components/ProductCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../Context/UserContext';
import { GetAllFavorites, GetIngsFromFavorites, AddImage, DeleteProduct } from '../Fetchs'
import { Button } from 'react-native-paper';
import { async } from '@firebase/util';

import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { initializeApp } from 'firebase/app';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


/*
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app)
*/

let iamge_list = false
let delete_image_flag = false

export default function UserPage2() {


    const [showCards, setShowCards] = useState(false)
    const [imageList, setImageList] = useState(null)
    const [deleteImage, setDeleteImage] = useState(null)


    const { user, productList, productDict, setProductDict, setProductList, firstLoad, setFirstLoad } = useContext(UserContext);

    useEffect(async () => {
        if (!firstLoad) {
            console.log("dfgdfgdfgdfgfdg");
            let product_list = await GetAllFavorites(user.id)
            if (product_list.length === 0) {
                setFirstLoad(true)
                return
            }
            console.log(product_list)
            setProductList(product_list)
        }
        console.log("dfgdfgdfgdfgfdg");
    }, [])

    useEffect(async () => {
        if (productList.length > 0 && !firstLoad) {
            console.log("dffffffffffffffffffffffffffffffffffffffffffffffffffff")
            await getAllIngData()
        }
    }, [productList])

    useEffect(async () => {
        if (productList.length > 0 && !firstLoad) {
            setFirstLoad(true)
        }
        if (delete_image_flag === true) {
            delete_image_flag = false
        }
        console.log("productDictproductDictproductDictproductDict", productDict);
    }, [productDict])


    useEffect(async () => {
        if (iamge_list === true) {
            await AddImage(imageList)
            console.log(iamge_list);
        }
    }, [imageList])


    useEffect(async () => {

    }, [deleteImage])



    const getAllIngData = async () => {
        console.log("productList", productList)
        let ing_list = []
        let value = {}
        let dictTemp = {}
        for (const product of productList) {
            ing_list = await GetIngsFromFavorites(product.id_prod)
            value = createDictValues(ing_list)
            dictTemp[product.id_prod] = value
        }
        console.log(dictTemp)
        console.log("ID:" + user.id);
        setProductDict(dictTemp)

    }

    const createDictValues = (result) => {
        let value = { name: result[0].product_name, ing_list: [] }
        result.map((ing) => {
            value.ing_list.push({ name: ing.Ing_Name, desc: ing.descript })
        })

        return value
    }



    const UploadImagesFireBase = async () => {

        iamge_list = true

        console.log("uploadSqluploadSqluploadSqluploadSql", uploadSql)
        for (const product of productList) {
            console.log(product.product_image);
            if (product.product_image.indexOf('firebasestorage') === -1 && product.product_image !== "") {
                const r = await fetch(product.product_image);
                const b = await r.blob();
                const url = await uploadImage(b, product.id_prod)
                console.log("urlurlurlurl", url);
            }
        }

    }

    const uploadSql = async () => {
        console.log(iamge_list);
        for (const image_sql of iamge_list) {
            console.log(image_sql);
        }
    }

    const uploadImage = async (blobFile, id_prod) => {

        const sotrageRef = ref(storage, `images/${id_prod}+${new Date()}`); //LINE A
        const uploadTask = uploadBytesResumable(sotrageRef, blobFile); //LINE B
        uploadTask.on(
            "state_changed", null,
            (error) => console.log(error),

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { //LINE C
                    console.log("File available at", downloadURL);
                    //  await AddImage({ image: downloadURL, id: id_prod })
                    setImageList(() => ({ image: downloadURL, id: id_prod }));
                    return downloadURL

                });
            }

        );

    }

    const Delete = async (id_prod) => {
        await DeleteProduct(id_prod);

        // delete_image_flag = true
        setProductList((prevProduct) => {
            return prevProduct.filter(product => product.id_prod != id_prod)
        })
        let tempDict = productDict
        delete tempDict[id_prod];
        setProductDict(() => ({
            ...tempDict
        }));

    }

    const DeleteFromStates = (id) => {
        setProductList((prevProduct) => {
            return prevProduct.filter(product => product.id_prod != id_prod)
        })
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}><Icon size={30} name="star" /> מועדפים</Text>
            {
                Object.keys(productDict).length > 0 ?
                    <View style={{ flex: 1, marginBottom: 10 }}>
                        <FlatList
                            style={{ marginBottom: 20 }}
                            data={productList}
                            keyExtractor={(item) => item.id_prod}
                            renderItem={({ item, index }) => (
                                <ProductCard index={index} product={item} item={productDict[item.id_prod]} Delete={() => Delete(item.id_prod)} />
                            )}
                        />
                        <View >
                            <Button mode="contained" color="black" onPress={() => { UploadImagesFireBase() }}>שמור תמונות</Button>
                        </View>
                    </View>
                    :
                    <Text style={{ fontSize: 20 }}>אין מוצרים להצגה</Text>

            }


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 10,

    },
    title: {
        fontSize: 25,
        marginTop: 10,
        marginBottom: 5
    }
});