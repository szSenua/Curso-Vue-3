const API = "https://api.github.com/users/"



//instancia de Vue
const app = Vue.createApp({
    data() {
        return {
            search: null,
            result: null,
            error: null,
            favorites: new Map()
        }
    },

    methods: {
        async doSearch(){
            this.result = this.error = null
            try {
                //Reactividad en dos sentidos: podemos modificar el valor de la variable search desde el cuadro de búsqueda o desde la devtools de vue
                //con fetch solicitamos datos via http (Axios) y sustituye a XMLHttpRequest
            const response = await fetch(API + this.search)

            if(!response.ok) throw new Error('User Not Found') //el ok lo sacamos de la respuesta, será false si el usuario no existe
            //console.log(response) de aquí sacamos la propiedad ok en false cuando se produce un error de no encontrado.
            //la respuesta la tenemos que interpretar en formato json
            const data = await response.json() 
            console.log(data)
            this.result = data

            }catch(error){
                this.error = error
            } finally{
                this.search = null //limpiamos la caja de búsqueda
            }
        },

        addFavorite() {
            this.favorites.set(this.result.id, this.result)
        }
    }
})

const mountedApp = app.mount('#app')

