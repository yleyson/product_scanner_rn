import { createContext, useEffect, useState } from 'react';
import User from '../Classes/User';
import { Base64 } from 'js-base64';
import { Alert } from "react-native";

export const UserContext = createContext();

const apiUrl = 'http://proj10.ruppin-tech.co.il/api/Users?pass=';

const apiRegister = 'http://proj10.ruppin-tech.co.il/api/AddUser';


export default function UserContextProvider({ children }) {

    const [user, SetUser] = useState(null)
    const [productList, setProductList] = useState([])
    const [productDict, setProductDict] = useState({})
    const [imageLIst, setImageLIst] = useState(null)
    const [firstLoad, setFirstLoad] = useState(false)

    const ShowDialog = () => {
        Alert.alert(
            "פרטים שגויים",
            "הפרטים שהזנתה אינם נכונים",
            [
                { text: "OK" }
            ]
        );
    }

    const UserExsists = () => {
        Alert.alert(
            "משתמש קיים",
            "המשתמש שהזנתה כבר קיים במערכת",
            [
                { text: "OK" }
            ]
        );
    }

    const UserSuccess = () => {
        Alert.alert(
            "ברוך הבא למערכת",
            "פרטייך נקלטו בהצלחה",
            [
                { text: "OK" }
            ]
        );
    }

    const ValidMail = (email) => {
        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        return emailRegex.test(email)
    }

    const WrongEmail = () => {
        Alert.alert(
            "מייל שגוי",
            "המייל שרשמתה אינו תקין",
            [
                { text: "OK" }
            ]
        );
    }

    const SignUpIn = (userName, email, password) => {
        debugger
        const signPass = Base64.encode(password)
        const signUser = userName
        const signMail = email
        if (!ValidMail(signMail)) {
            WrongEmail()
            return
        }
        let user = {
            pass: signPass,
            user_name: signUser,
            user_mail: signMail,
        }
        //  let newuser = new User(signPass, signUser, signMail)
        console.log(user);
        fetch(apiRegister, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                // 'Content-Type': 'multipart/form-data',
                // 'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                debugger
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (res.ok) {
                    UserSuccess()
                    return res.json()
                }
                else {
                    UserExsists()
                    return null;
                }

            })
            .then(
                (result) => {
                    console.log("result", result);
                    console.log("result-id",);
                },
                (error) => {

                    console.log(apiUrl + email);
                    console.log("err GET=", error);
                });

    }


    const LoginIn = (email, password) => {
        if (email == "" && password == "") {
            Alert.alert(
                "שדות ריקים",
                "עלייך למלא את השדות ",
                [
                    { text: "OK" }
                ]
            );
            return
        }
        const UserMail = email
        const UserPass = Base64.encode(password)
        fetch(apiUrl + UserPass + "&user_mail=" + UserMail, {
            method: 'GET',
            // body: JSON.stringify(UserById),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (res.ok) {
                    return res.json()
                }
                else
                    return null;

            })
            .then(
                (result) => {
                    console.log("result", result);
                    debugger
                    if (result == null) {
                        ShowDialog()
                        return
                    }
                    SetUser(result)
                },
                (error) => {

                    console.log(apiUrl + email);
                    console.log("err GET=", error);
                });
    }


    return (
        <UserContext.Provider value={{
            user, SetUser, LoginIn, SignUpIn, setProductList,
            setProductDict, productList, productDict, imageLIst, setImageLIst, firstLoad, setFirstLoad
        }}>
            {children}
        </UserContext.Provider>
    )


}
