const API = "https://api.github.com/users/"

//función de prueba buscar en github
async function doSearch(){
    const response = await fetch(API + 'szSenua')
    //la respuesta la tenemos que interpretar en formato json
    const data = await response.json() 
    console.log(data)
}

const app = Vue.createApp({
    data() {
        return {
            message: 'Hello Vue',
        }
    }
})

