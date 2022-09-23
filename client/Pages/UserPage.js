import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import ProductCard from '../Components/ProductCard'
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../Context/UserContext';
import { GetAllFavorites, GetIngsFromFavorites, AddImage, DeleteProduct, firebase_api } from '../Fetchs'
import { Button } from 'react-native-paper';







export default function UserPage2() {

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

        console.log("productDictproductDictproductDictproductDict", productDict);
    }, [productDict])


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
            value.ing_list.push({ name: ing.Ing_Name, description: ing.descript })
        })

        return value
    }



    const UploadImagesFireBase = async () => {

        for (const product of productList) {
            console.log(product.product_image);
            if (product.product_image.indexOf('firebasestorage') === -1 && product.product_image !== "") {

                let dataI = new FormData();

                dataI.append('file', {
                    uri: product.product_image,
                    name: `${product.id_prod}+${new Date()}`,
                    type: 'image/jpg'
                })
                console.log(product.fire_base_image);
                console.log('dataIdataIdataIdataI', dataI);
                const url = await firebase_api(dataI)
                console.log("urlurlurlurl", url);
                await AddImage({ image: url, id: product.id_prod })
            }
        }

    }



    const Delete = async (id_prod) => {
        await DeleteProduct(id_prod);

        setProductList((prevProduct) => {
            return prevProduct.filter(product => product.id_prod != id_prod)
        })
        let tempDict = productDict
        delete tempDict[id_prod];
        setProductDict(() => ({
            ...tempDict
        }));

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