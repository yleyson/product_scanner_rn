

const google_api = async (imgBase64) => {
    console.log("dfgdfgfdgdf")

    const text_result = await fetch('https://google-text-api.herokuapp.com/api/google_text', {
        method: 'POST',
        body: JSON.stringify({ text: imgBase64 }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
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
                return result
            },
            (error) => {

                console.log("err GET=", error);
                return null
            });

    return text_result

};



const getIngExplansion = async (ing_list) => {
    const ing_explansion = await fetch('https://ingredients-data-api.herokuapp.com/get_ingredients', {
        method: 'POST',
        body: JSON.stringify(ing_list),
        headers: new Headers({
            //   'Content-Type': 'application/json; charset=UTF-8',
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
                return result
            },
            (error) => {

                console.log("err GET=", error);
                return { result: null }
            });

    return ing_explansion;
}

const apiFavorites = 'http://proj10.ruppin-tech.co.il/api/Favorites/'

const apiIngs = 'http://proj10.ruppin-tech.co.il/api/GetIngredientsInfo/'




const GetAllFavorites = async (user_id) => {

    const favorites_list = await fetch(apiFavorites + user_id, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
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
                console.log("GetAllFavorites = ", result);
                return result
            },
            (error) => {
                console.log("err GET=", error);
            });

    return favorites_list
};


const GetIngsFromFavorites = async (product_id) => {

    const ing_arr = await fetch(apiIngs + product_id, {
        method: 'GET',
        // body: JSON.stringify(UserById),
        headers: new Headers({
            //   'Content-Type': 'application/json; charset=UTF-8',
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
                debugger
                console.log("GetIngs", result)
                return result

            },
            (error) => {
                console.log("err GET=", error);
            });

    return ing_arr

}

const ingDescApi = 'http://proj10.ruppin-tech.co.il/api/GetIngDesc/'


const GedtIngDesc = async (ing_name) => {

    const ing_desc = await fetch(ingDescApi + ing_name, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
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
                console.log("get ind desc = ", result);
                return result
            },
            (error) => {
                console.log("err GET=", error);
            });

    return ing_desc
};


const savePorudctApi = 'http://proj10.ruppin-tech.co.il/api/AddProduct'


const SaveProductToUser = async (product) => {

    const new_product = await fetch(savePorudctApi, {
        method: 'Post',
        body: JSON.stringify(product),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
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
                console.log("new_product = ", result);
                return result
            },
            (error) => {
                console.log("err GET=", error);
            });

    return new_product
};

const getLastProductApi = 'http://proj10.ruppin-tech.co.il/api/GetLastProduct/'

const GetLastProduct = async (user_id) => {

    const last_product = await fetch(getLastProductApi + user_id, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
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
                console.log("get last product  = ", result);
                return result
            },
            (error) => {
                console.log("err GET=", error);
            });

    return last_product
};


const addImageApi = 'http://proj10.ruppin-tech.co.il/api/AddImage/'


const AddImage = async (image) => {

    const new_image = await fetch(addImageApi, {
        method: 'Post',
        body: JSON.stringify(image),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
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
                console.log("addImageApi = ", result);
                return result
            },
            (error) => {
                console.log("err GET=", error);
            });

    return new_image
};


const apiDelete = 'http://proj10.ruppin-tech.co.il/api/DeleteProduct?product='

const DeleteProduct = async (product) => {
    const num = await fetch(apiDelete + product, {
        method: 'DELETE',
        //body: JSON.stringify({id:7}),
        headers: new Headers({
            'accept': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        })
    })
        .then(res => {
            console.log('res=', res.status);
            return res.json()
        })
        .then(
            (result) => {
                console.log("fetch POST= ", result);
            },
            (error) => {
                console.log("err post=", error);
            })
    return num
};




export { google_api, getIngExplansion, GetAllFavorites, GetIngsFromFavorites, GedtIngDesc, SaveProductToUser, GetLastProduct, AddImage, DeleteProduct };