const API = "https://api.github.com/users/"



//instancia de Vue
const app = Vue.createApp({
    data() {
        return {
            message: 'Hello Vue',
        }
    },

    methods: {
        async doSearch(){
            const response = await fetch(API + 'szSenua')
            //la respuesta la tenemos que interpretar en formato json
            const data = await response.json() 
            console.log(data)
        }
    }
})

