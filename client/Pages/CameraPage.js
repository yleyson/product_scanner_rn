import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Avatar } from 'react-native-paper';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import AddIngModal from '../Components/AddIngModal';
import { google_api, getIngExplansion, GedtIngDesc, SaveProductToUser, GetLastProduct, GetIngsFromFavorites } from '../Fetchs'
import SaveProductModal from '../Components/SaveProductModal';
import LottieView from 'lottie-react-native';
import loading_anim from '../assets/loading_animation.json'
import { UserContext } from '../Context/UserContext';
import alergic_x from '../assets/alregic_x.png'


let ing_to_put = {}
let current_ing = ""
let ing_list_ocr
let tempDict = {}
let last_product_to_add
let changeProductUserLIst = false

export default function CameraPage() {

    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [imageData, setImageData] = useState(null);// image to send google api
    const [image, setImage] = useState(null); //  image uri to show on screen
    const [type, setType] = useState(Camera.Constants.Type.back); // flip camera back or front
    const isFocused = useIsFocused();
    const [text, setText] = useState(""); // ingredient text 
    const [screen, setScreen] = useState("camera"); // move between the screen camera or image or the ingredients data
    const [loadingAnim, setLoadingAnim] = useState(false); // loading animation

    const [textArr, setTextArr] = useState(null); // array of all ingredients dictionary keys to show on screen
    const [textArrTEmp, setTextArrTemp] = useState(null); // array of other ingredients  to select  when ingredient description not found

    const [textDict, setTextDict] = useState(null); //dictionary of all ingredients 

    const [alergic_flag, setAlergic_flag] = useState(false); // alergic flag

    const { user, setProductList, productList, productDict,
        setProductDict, firstLoad, sensitivity
    } = useContext(UserContext);


    //camera
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    //set the screen to image screen
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

    // add new ingredient to user product list
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
            setAlergic_flag(false)
            setImage(data.uri)
            setImageData(data)
        }
    }




    //function that get ingredients data
    const getData = async () => {

        setAlergic_flag(false)

        setLoadingAnim(true)
        console.log("img")

        // get the text from image
        const text_from_img = await google_api(imageData.base64)
        console.log('====================================');
        console.log(str);
        console.log('====================================');
        console.log(text_from_img)


        if (text_from_img === null) {
            Alert.alert("שגיאה בסריקת מוצר סרוק שוב או צלם יותר טוב")
            setScreen("image")
            setLoadingAnim(false)
            return
        }

        // check for alergic 
        let filterCheck = await FilterProduct(text_from_img)

        //if alergic was found show message and return
        if (filterCheck["bool"]) {
            setLoadingAnim(false)
            Alert.alert(`אל תאכל את זה, מכיל ${filterCheck["text"]}`)
            setAlergic_flag(true)
            return

        }

        //extract only the ingredients from text
        ing_list_ocr = await GetIngredientsFromText(text_from_img)

        //if ingredients wasnt found show message and return
        if (ing_list_ocr === null) {
            setLoadingAnim(false)
            Alert.alert("שגיאה בסריקת מוצר סרוק שוב או צלם יותר טוב")
            return
        }

        //check if there is ingredients that has allready in the databse
        await checkIFIngExist()

        //send the ingredients list to web scrapping api that return the descrption for each ingredient
        const ing_exp = await getIngExplansion(ing_list_ocr)

        if (ing_exp === null) {
            setLoadingAnim(false)
            Alert.alert("שגיאה בסריקת מוצר סרוק שוב או צלם יותר טוב")
            return
        }

        console.log("sdfdsfsdfsdf" + ing_exp)

        //concat the ingredients from the data base if there is to the ingredients dictionary
        let new_ing_exp = tempDict !== {} ? { ...tempDict, ...ing_exp } : ing_exp

        setText("")
        setTextDict(new_ing_exp)
        setScreen("ingredients")
        setLoadingAnim(false)
    };


    //function that check if there is any alergic that was selected in the ingredients
    const FilterProduct = async (text_from_img) => {
        console.log("enterrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        const alephBet = 'אבגדהוזחטיכלמנסעפצקרשתךףםןץ' // string to check if the alergic word is a whole word and not substring

        //loop throw all sensitivity list
        for (const item of sensitivity) {

            // if sensitivity was selected
            if (item.select === true) {

                // index of the alergic title if exist
                let index = text_from_img.indexOf(item.title)
                //check if the title exist and if its not a substring
                if (index != -1 && !alephBet.includes(text_from_img[index - 1])
                    && !alephBet.includes(text_from_img[index + item.title.length])) {
                    return { bool: true, text: item.title }
                }

                //check all the other options of the alergic throw loop
                else if (item.sens.some(str => {
                    let index = text_from_img.indexOf(str)

                    if (index != -1 && !alephBet.includes(text_from_img[index - 1])
                        && !alephBet.includes(text_from_img[index + str.length])) {
                        console.log('enter', text_from_img[index], index);

                        return true

                    }
                })) {
                    return { bool: true, text: item.title }
                }


            }
        }

        return { bool: false, text: "" }
    }

    //function that extract only the ingredients from text
    const GetIngredientsFromText = (text) => {
        console.log('test')
        //  console.log(text)


        let ing_index_start = text.indexOf("רכיבים")

        console.log(ing_index_start)
        // if the word רכיבים not found return
        if (ing_index_start === -1) {
            return null
        }
        //get the first ingredients list index
        ing_index_start += 7

        //will be the last index of the ingriendets list
        let ing_index_end = text[text.length - 1];


        // loop the go throw all the text from ing_index_start to get the last index witch is '.'
        for (let i = ing_index_start; i < text.length; i++) {
            //check if the dot is not a decimal dot
            if (text[i] == '.' && isNaN(text[i - 1])) {
                ing_index_end = i;
                console.log("dotttttt" + text[i])
                break;
            }
        }

        text = text.substring(ing_index_start, ing_index_end) // substring the text to the ingredients list only
        text = text.trim() // remove space around
        text = text.replace(/\n/g, " "); //replace newlines/line breaks with spaces 
        text = text.replace(/ *\([^)]*\) */g, "") //Remove text between parentheses
        text = text.replace(',,', ',')
        let arr = text.split(',').map(element => element.trim()); //Split String and Trim 

        console.log(arr)

        return arr

    }

    //function that check if the ingredient exist in the data base
    const checkIFIngExist = async () => {
        let temp_arr = ing_list_ocr //temp array of ingredients array list
        let ing_dict = {}

        //loop over the ingredients list 
        for (const str of ing_list_ocr) {
            console.log(str)
            let ing_json = await isIngredientInDataBase(str) // get 
            console.log("descccc", str)
            //if ingredient description exist , add ingredient to dictionary
            if (ing_json !== null) {
                ing_dict[ing_json.ingredient] = ing_json
                console.log('====================================');
                console.log(ing_dict[ing_json.ingredient]);
                console.log('====================================');

                temp_arr = temp_arr.filter(name => name !== str) //remove the ingredient from the temp array
            }
        }
        ing_list_ocr = temp_arr // ingredients array list without the ingredients that exist in the data base
        tempDict = ing_dict // save the ingredients dictionary of the ingredients that exist in the data base
        console.log("new arr", temp_arr)

        console.log("ing_dict", ing_dict)


    }




    //function that show ingredient description from the list options to ingredient that wanst found

    const getIngToReplaceDesc = async (ing) => {

        let ing_json = await isIngredientInDataBase(ing) // get 

        // if the ingredient doesnt exist in the data base then 
        //send the ingredient to web scrapping api
        ing_to_put = ing_json === null ? (await getIngExplansion([ing]))[ing] : ing_json
        console.log("getIngToReplaceDesc", ing_to_put)
        if (ing_to_put != null)
            setText(ing_to_put.description)
    }

    //function that return ingredient if exist in data base
    const isIngredientInDataBase = async (ing) => {
        let desc = await GedtIngDesc(ing); // GET request that return the ingredient description if exist
        console.log("fdgdfgdfg", desc)
        //create ing_json if ingredient exist in the data base
        let ing_json = desc === null ? null :
            {
                "ingredient": ing,
                "found": true,
                "description": desc,
                "maybe": null
            }

        console.log(ing_json)

        return ing_json
    }


    //function that add ingredient manually by the user
    const addIngredient = async (ing) => {
        let ing_json = await isIngredientInDataBase(ing) // get 

        // if the ingredient doesnt exist in the data base then 
        //send the ingredient to web scrapping api
        let ing_to_add = ing_json === null ? (await getIngExplansion([ing]))[ing] : ing_json
        console.log("ing_to_add", ing_to_add)
        //add ingredient to dictionary 
        setTextDict(prevState => ({
            ...prevState,
            [ing]: ing_to_add
        }));
    }



    //function that sort the array list from small to large(the amount of characters)
    const sortIngArr = () => {

        let sort_arr = Object.keys(textDict).sort((a, b) => a.length - b.length)
        setTextArr(sort_arr)
    }


    //function that replace the ingredient that wasnt found description for him with selected one
    const replaceIng = () => {

        let tempDict = textDict // temp dictionary
        tempDict[ing_to_put.ingredient] = ing_to_put // add the selected ingredient to temp dictionary
        delete tempDict[current_ing]; // delete the ingredient that wasnt found description for him
        //add selected ingredient to dictionary
        setTextDict(() => ({
            ...tempDict
        }));

    }

    //function that delete selected ingredient from dictionary
    const deleteIngredient = () => {
        let tempDict = textDict
        delete tempDict[current_ing];
        setTextDict(() => ({
            ...tempDict
        }));

    }

    //function that save the product to the user favorite in the data base
    const saveProduct = async (prod_name, prod_category = "") => {

        //checking if there ingredient without description if there is than return
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


        //list of the ingredients
        let ing_list = []
        textArr.map((ing_name) => {
            let ing = { name: ing_name, description: textDict[ing_name].description }
            ing_list = [...ing_list, ing]
        })

        console.log('====================================');
        console.log("ing_list", ing_list);
        console.log('====================================');

        //create json of the product
        let product = {
            user_id: user.id,
            name: prod_name,
            category: prod_category,
            ingridentities: ing_list
        }

        console.log(product)

        //post fetch which send the product to the data base
        await SaveProductToUser(product)

        //checking if the user was allready go to his user page if he does than the product add to his favorite list 

        if (firstLoad) {
            changeProductUserLIst = true
            last_product_to_add = await GetLastProduct(user.id)
            setProductDict(() => ({
                ...productDict,
                [last_product_to_add.id_prod]: { name: product["name"], ing_list: product["ingridentities"] }
            }));

        }

    }


    return (
        <View style={{ flex: 1 }}>
            <View style={styles.camera_container}>

                {
                    // **********************camera*************************************************
                    screen === "camera" ?
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

                        // **********************image*************************************************
                        : screen === "image" ?
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                {
                                    loadingAnim ? // show loading animation when waiting to gett the data
                                        <View style={{
                                            backgroundColor: 'white', paddingTop: 20, marginBottom: 20, flexDirection: 'row',
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
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
                                    height: loadingAnim || alergic_flag ? '80%' : '100%', // when animation loading or alergic warning show image is 80%
                                    resizeMode: 'contain',
                                }} />

                                {alergic_flag ? // show alergic warning if there is
                                    <Avatar.Icon style={{
                                        backgroundColor: 'transparent', position: 'absolute',
                                        left: -250,
                                        top: -160,
                                    }} color='red' size={900} icon={alergic_x} />
                                    :
                                    null}
                            </View>

                            // **********************data*************************************************
                            :
                            <View style={{
                                backgroundColor: 'white', borderColor: 'black', borderWidth: 1, alignSelf: 'center',
                                padding: 10, borderRadius: 20, minWidth: 250, margin: 20
                            }}>
                                {
                                    text != "" ? // if there description of ingredient to show
                                        <View>

                                            <ScrollView style={{ marginBottom: 10 }}>
                                                <Text style={{ fontSize: 20 }}>{text}</Text>
                                            </ScrollView>

                                            <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                                {textArrTEmp != null ? // if the ingredient is an selected option to repalce
                                                    <Button mode="contained" color="black"
                                                        onPress={() => { replaceIng(); setTextArrTemp(null) }}>
                                                        החלף רכיב</Button>
                                                    :
                                                    <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                        style={{ marginBottom: 20 }}>מחק רכיב</Button>
                                                }
                                                <Button style={{ marginTop: 10 }} mode="contained" color="black"
                                                    onPress={() => { setText("") }}>סגור</Button>
                                            </View>

                                        </View>

                                        :

                                        <View >
                                            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                                                {
                                                    // 2 options titels one for the ingredients show one to options to ingredient that wanst found
                                                    textArrTEmp != null ?
                                                        <Text style={{ textAlign: 'center', fontSize: 30, marginBottom: 10 }}>האם התכוונת ל...</Text>
                                                        :
                                                        <Text style={{ fontSize: 30, textAlign: 'center', marginBottom: 10 }}>רכיבים</Text>
                                                }
                                            </View>

                                            <ScrollView contentContainerStyle={{
                                                marginTop: 20,
                                                justifyContent: 'space-evenly',
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                            }}>
                                                {//show or the ingredients or the options to selected for ingredient that wasnt found
                                                    (textArrTEmp != null ? textArrTEmp : textArr).map((item, index) => {
                                                        return (
                                                            <Button icon={textArrTEmp === null && textDict[`${item}`].found === false ?
                                                                () => (
                                                                    <MaterialCommunityIcons name="cancel" size={20} color="red" />//wasnt found
                                                                )
                                                                :
                                                                () => (
                                                                    <MaterialCommunityIcons name="check-circle-outline" size={20} color="green" />//found
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
                                                                    // if ingredient found show text 
                                                                    textArrTEmp === null && textDict[`${item}`].found ?
                                                                        (
                                                                            current_ing = item, // save the current ingredient in global variable
                                                                            setText(textDict[`${item}`].description)

                                                                        )
                                                                        :
                                                                        //if ingredient wasnt found show options to select or replace ingredient
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

                                            {//show buttons when selcetd option lis show
                                                textArrTEmp !== null ?
                                                    <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                                        <Button mode="contained" color="red" onPress={() => deleteIngredient()}
                                                            style={{ marginBottom: 30 }}>מחק רכיב</Button>
                                                        <Button mode="contained" color="black"
                                                            onPress={() => { setTextArrTemp(null) }}>חזור לשאר הרכיבים</Button>
                                                    </View>
                                                    :
                                                    null
                                            }
                                        </View>
                                }
                            </View>

                }

            </View>

            <View style={{ backgroundColor: 'black' }} //**************** buttons controls  *************************** 
            >
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

                {textDict != null ? // in case there is not ingredients data to show user cannot save product or add new ingredient
                    <View style={styles.button_container}>
                        <SaveProductModal saveProduct={(name, category) => saveProduct(name, category)} />
                        <AddIngModal addIng={(ing) => addIngredient(ing)} />
                    </View>
                    :
                    <View style={styles.button_container}>
                        <Button color='white' mode="contained"
                            onPress={() => Alert.alert("מוצר לא נסרק")}>שמור מוצר</Button>
                        <Button color='white' mode="contained"
                            onPress={() => Alert.alert("מוצר לא נסרק")}>הוסף רכיב ידני</Button>
                    </View>

                }
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



