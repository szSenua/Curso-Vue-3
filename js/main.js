const API = "https://api.github.com/users/"



//instancia de Vue
const app = Vue.createApp({
    data() {
        return {
            search: ''
        }
    },

    methods: {
        async doSearch(){
            //Reactividad en dos sentidos: podemos modificar el valor de la variable search desde el cuadro de búsqueda o desde la devtools de vue
            const response = await fetch(API + this.search)
            //la respuesta la tenemos que interpretar en formato json
            const data = await response.json() 
            console.log(data)
        }
    }
})

