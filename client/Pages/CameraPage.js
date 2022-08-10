import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import AddIngModal from '../Components/AddIngModal';
import { google_api, getIngExplansion, GedtIngDesc, SaveProductToUser, GetLastProduct, GetIngsFromFavorites } from '../Fetchs'
import SaveProductModal from '../Components/SaveProductModal';
import LottieView from 'lottie-react-native';
import loading_anim from '../assets/loading_animation.json'
import { UserContext } from '../Context/UserContext';


let str = "רכיבים: קמח חיטה מלא (3.8%) (מכיל גלוטן), ממתיקים,"
str += "\n"
str += ",בוטנים, (איזומלט, מלטיטול, סוכרלוז), קמח שיבולת שועל מלא"
str += "\n"
str += ",עמילן תירס, סובין חיטה, קמח תירס,(מכיל גלוטן)"
str += "\n"
str += "סיבי עולש, מלח, חומר תפיחה (סודיום ביקרבונט), חומר"
str += "\n"
str += "מונע התגיישות (מגנזיום קרבונט), אבקת קקאו, מעכב"
str += "\n"
str += "חמצון (תערובת טוקופרולים),."

let ing_to_put = {}
let current_ing = ""
let ing_list_ocr
let tempDict = {}
let last_product_to_add
let changeProductUserLIst = false

export default function CameraPage({ navigation }) {

    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const isFocused = useIsFocused();
    const [text, setText] = useState("");
    const [screen, setScreen] = useState("camera");
    const [loadingAnim, setLoadingAnim] = useState(false);

    const [textArr, setTextArr] = useState(null);
    const [textArrTEmp, setTextArrTemp] = useState(null);

    const [textDict, setTextDict] = useState(null);

    const { user, setProductList, productList, productDict, setProductDict, firstLoad, setFirstLoad } = useContext(UserContext);


    //camera
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (image !== null)
            setScreen("image")
    }, [image])


    useEffect(() => {
        if (textDict !== null) {
            console.log("textDicttextDicttextDicttextDicttextDicttextDicttextDicttextDict")
            textArrTEmp != null ? setTextArrTemp(null) : setText("")
            sortIngArr()
        }
    }, [textDict])

    useEffect(() => {
        if (changeProductUserLIst) {
            changeProductUserLIst = false
            setProductList([...productList, last_product_to_add])
        }
    }, [productDict])



    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }



    const takePicture = async () => {
        setText("")
        if (camera) {
            const data = await camera.takePictureAsync({ base64: true })
            setImage(data.uri)
            setImageData(data)
        }
    }




    //ocr
    const getData = async () => {


        setLoadingAnim(true)
        console.log("img")


        const text_from_img = await google_api(imageData.base64)
        console.log(text_from_img)

        if (text_from_img === null) {
            Alert.alert("שגיאה בסריקת מוצר סרוק שוב או צלם יותר טוב")
            setLoadingAnim(false)
            return
        }

        ing_list_ocr = await GetIngredientsFromText(text_from_img)
        if (ing_list_ocr === null) {
            Alert.alert("שגיאה בסריקת מוצר סרוק שוב או צלם יותר טוב")
            setLoadingAnim(false)
            return
        }

        await checkIFIngExist()

        const ing_exp = await getIngExplansion(ing_list_ocr)

        if (ing_exp === null) {
            Alert.alert("שגיאה בסריקת מוצר סרוק שוב או צלם יותר טוב")
            setLoadingAnim(false)
            return
        }

        console.log("sdfdsfsdfsdf" + ing_exp)

        let new_ing_exp = tempDict !== {} ? { ...tempDict, ...ing_exp } : ing_exp

        setText("")
        setTextDict(new_ing_exp)
        setScreen("ingredients")
        setLoadingAnim(false)
    };

    const GetIngredientsFromText = (text) => {
        console.log('test')
        //  console.log(text)


        let ing_index_start = text.indexOf("רכיבים")
        console.log(ing_index_start)
        if (ing_index_start === -1) {
            return null
        }

        ing_index_start += 7

        let ing_index_end = text[text.length - 1];



        for (let i = ing_index_start; i < text.length; i++) {
            if (text[i] == '.' && isNaN(text[i - 1])) {
                ing_index_end = i;
                console.log("dotttttt" + text[i])
                break;
            }
        }

        text = text.substring(ing_index_start, ing_index_end)
        text = text.trim()
        text = text.replace(/\n/g, " "); //replace newlines/line breaks with spaces 
        text = text.replace(/ *\([^)]*\) */g, "") //Remove text between parentheses
        text = text.replace(',,', ',')
        let arr = text.split(',').map(element => element.trim()); //Split String and Trim 

        console.log(arr)

        return arr

    }

    const checkIFIngExist = async () => {
        let temp_arr = ing_list_ocr
        let ing_json = {}

        for (const str of ing_list_ocr) {
            console.log(str)
            let desc = await GedtIngDesc(str);
            console.log("descccc", desc)
            if (desc !== null) {
                ing_json[str] = {
                    "ingredient": str,
                    "found": true,
                    "description": desc,
                    "maybe": null
                }
                temp_arr = temp_arr.filter(name => name !== str)
            }
        }
        ing_list_ocr = temp_arr
        tempDict = ing_json
        console.log("new arr", temp_arr)

        console.log("ing_json", ing_json)


    }



    const getIngToReplaceDesc = async (ing) => {
        let ing_json = {}
        let desc = await GedtIngDesc(ing)
        if (desc !== null) {
            ing_json[ing] = {
                "ingredient": ing,
                "found": true,
                "description": desc,
                "maybe": null
            }
        }
        ing_to_put = desc === null ? (await getIngExplansion([ing]))[ing] : ing_json[ing]
        console.log("getIngToReplaceDesc", ing_to_put)
        setText(ing_to_put.description)
    }

    const sortIngArr = () => {

        let sort_arr = Object.keys(textDict).sort((a, b) => a.length - b.length)
        setTextArr(sort_arr)
    }

    const addIngredient = async (ing) => {
        let desc = await GedtIngDesc(ing);
        console.log("fdgdfgdfg", desc)
        let ing_json = desc === null ? null : {
            [ing]: {
                "ingredient": ing,
                "found": true,
                "description": desc,
                "maybe": null
            }
        }
        console.log(ing_json)


        let ing_to_add = ing_json === null ? await getIngExplansion([ing]) : ing_json
        console.log("ing_to_add", ing_to_add)

        ing_to_add = ing_to_add[ing]

        let tempDict = textDict
        tempDict[ing] = ing_to_add
        console.log(tempDict)
        setTextDict(prevState => ({
            ...prevState,
            [ing]: ing_to_add
        }));
    }


    const replaceIng = () => {

        let tempDict = textDict
        tempDict[ing_to_put.ingredient] = ing_to_put
        delete tempDict[current_ing];
        setTextDict(() => ({
            ...tempDict,
            [ing_to_put.ingredient]: ing_to_put
        }));

    }

    const deleteIngredient = () => {
        let tempDict = textDict
        delete tempDict[current_ing];
        setTextDict(() => ({
            ...tempDict
        }));

    }

    const saveProduct = async (prod_name, prod_category = "") => {

        let check_if_not_found = false
        textArr.map((ing_name) => {
            if (!textDict[ing_name].found) {
                check_if_not_found = true
                return
            }
        })
        if (check_if_not_found) {
            Alert.alert("קיים רכיב ללא הסבר מחק או החלף רכיב")
            return
        }


        let ing_list = []
        textArr.map((ing_name) => {
            let ing = { name: ing_name, description: textDict[ing_name].description }
            ing_list = [...ing_list, ing]
        })

        let product = {
            user_id: user.id,
            name: prod_name,
            category: prod_category,
            ingridentities: ing_list
        }

        console.log(product)

        await SaveProductToUser(product)

        if (firstLoad) {
            changeProductUserLIst = true
            last_product_to_add = await GetLastProduct(user.id)
            last_product_to_add["product_image"] = ""
            let ing_list_last_product = await GetIngsFromFavorites(last_product_to_add.id_prod)
            console.log("ing_list_last_product", ing_list_last_product);
            let value = await createDictValues(ing_list_last_product)
            console.log(value)
            setProductDict(() => ({
                ...productDict,
                [last_product_to_add.id_prod]: value
            }));

        }



    }

    const createDictValues = async (result) => {
        console.log("resulttttttttttttttttttttttttttttt", result)
        let value = { name: result[0].product_name, ing_list: [] }

        result.map((ing) => {
            value.ing_list.push({ name: ing.Ing_Name, desc: ing.descript })
        })

        return value
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={styles.camera_container}
            >
                {screen === "camera" ?
                    isFocused && <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixed_ratio}
                        type={type}
                    >
                        <View style={{ alignSelf: 'baseline' }}>
                            <MaterialIcons.Button size={30} name="flip-camera-ios" iconStyle={{ marginRight: 0 }} backgroundColor="black"
                                color="white" onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }} />
                        </View>
                    </Camera>
                    : screen === "image" ?
                        <View style={{ flex: 1 }}>
                            {
                                loadingAnim ?
                                    <View style={{ backgroundColor: 'white', paddingTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <LottieView
                                            resizeMode="cover"
                                            source={loading_anim}
                                            autoPlay
                                            style={{ height: 60 }}
                                            loop={true}
                                            enableMergePathsAndroidForKitKatAndAbove
                                        />
                                    </View>
                                    :
                                    null
                            }



                            <Image source={{ uri: image }} style={{
                                width: '100%',
                                height: loadingAnim ? '80%' : '100%',
                                resizeMode: 'contain',
                            }} />
                        </View>

                        :
                        <View style={{
                            backgroundColor: 'white', borderColor: 'black', borderWidth: 1, alignSelf: 'center',
                            padding: 10, borderRadius: 20, minWidth: 250, margin: 20
                        }}>
                            {
                                text != "" ?
                                    <View>
                                        <ScrollView style={{ marginBottom: 10 }}>
                                            <Text style={{ fontSize: 20 }}>{text}</Text>
                                        </ScrollView>


                                        <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                            {textArrTEmp != null ? <Button mode="contained" color="black"
                                                onPress={() => { replaceIng(); setTextArrTemp(null) }}>
                                                החלף רכיב</Button> : <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                    style={{ marginBottom: 20 }}>מחק רכיב</Button>
                                            }
                                            <Button style={{ marginTop: 10 }} mode="contained" color="black"
                                                onPress={() => { setText("") }}>סגור</Button>
                                        </View>

                                    </View>
                                    :
                                    <View >
                                        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                                            {textArrTEmp != null ?
                                                <Text style={{ textAlign: 'center', fontSize: 30, marginBottom: 10 }}>האם התכוונת ל...</Text> :
                                                <Text style={{ fontSize: 30, textAlign: 'center', marginBottom: 10 }}>רכיבים</Text>
                                            }
                                        </View>

                                        <ScrollView contentContainerStyle={{
                                            marginTop: 10,
                                            justifyContent: 'space-evenly',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                        }}>
                                            {(textArrTEmp != null ? textArrTEmp : textArr).map((item, index) => {
                                                return (
                                                    <Button icon={textArrTEmp === null && textDict[`${item}`].found === false ?
                                                        () => (
                                                            <MaterialCommunityIcons name="cancel" size={20} color="red" />
                                                        ) :
                                                        () => (
                                                            <MaterialCommunityIcons name="check-circle-outline" size={20} color="green" />
                                                        )}
                                                        style={{
                                                            marginRight: 2, marginBottom: 20, borderRadius: 20, borderWidth: 1,
                                                            borderColor: '#ccd6db', elevation: 3

                                                        }}
                                                        key={index}
                                                        color="#b0d1e3"
                                                        theme={{ colors: { primary: "#f00" } }}
                                                        labelStyle={{ color: "black", fontSize: 13, marginLeft: 4 }}
                                                        mode="contained" onPress={() => {
                                                            textArrTEmp === null && textDict[`${item}`].found ?
                                                                (
                                                                    current_ing = item,
                                                                    setText(textDict[`${item}`].description)

                                                                )
                                                                :
                                                                textArrTEmp != null ?
                                                                    getIngToReplaceDesc(item)
                                                                    :
                                                                    (
                                                                        current_ing = item,
                                                                        setTextArrTemp(textDict[`${item}`].maybe)
                                                                    )
                                                        }}>
                                                        {item}

                                                    </Button>
                                                )


                                            })
                                            }
                                        </ScrollView>



                                        {textArrTEmp !== null ? <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                            <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                style={{ marginBottom: 30 }}>מחק רכיב</Button>
                                            <Button mode="contained" color="black"
                                                onPress={() => { setTextArrTemp(null) }}>חזור לשאר הרכיבים</Button>
                                        </View> :
                                            null
                                        }

                                    </View>



                            }


                        </View>

                }

            </View>

            <View style={{ backgroundColor: 'black' }}>
                <View style={styles.button_camera_container}>
                    <Ionicons.Button size={40} name="camera" iconStyle={{ marginRight: 0 }} backgroundColor="black" color="white"
                        onPress={() => setScreen("camera")} />

                    <MaterialIcons.Button size={40} name="motion-photos-on" iconStyle={{ marginRight: 0 }} backgroundColor="black" color="white"
                        onPress={() => {
                            if (screen === "camera")
                                takePicture()
                        }
                        } />


                    <MaterialIcons.Button size={40} name="image-search" iconStyle={{ marginRight: 0 }} backgroundColor="black" color="white"
                        onPress={() => {
                            if (screen === "image") {
                                setTextArr(null); setTextDict(null); setTextArrTemp(null)
                                getData()
                            }
                            else if (textArr === null)
                                Alert.alert("אין רכיבים להצגה")
                            else
                                setScreen("ingredients")

                        }
                        } />



                </View>
                <View style={styles.button_container}>
                    {textDict != null ?
                        <SaveProductModal saveProduct={(name, category) => saveProduct(name, category)} />
                        :
                        <Button color='white' mode="contained"
                            onPress={() => Alert.alert("מוצר לא נסרק")}>שמור מוצר</Button>
                    }

                    <AddIngModal addIng={(ing) => addIngredient(ing)} />
                </View>
            </View>

        </View >

    )
}


const styles = StyleSheet.create({

    camera_container: {
        flex: 1,
    },
    fixed_ratio: {
        flex: 1,
    },
    button_camera_container: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
    },
    button_container: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
    },

})



