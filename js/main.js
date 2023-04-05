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

    //traemos la string con la información de los favoritos que hemos guardado, lo parseamos de una String a un objeto 
    created() {
        const savedFavorites = JSON.parse(window.localStorage.getItem('favorites'))

        //si savedFavorites contiene algo, creamos un nuevo mapa en el que devolvemos la id del usuario como key y todo lo demas como value.
        if(savedFavorites.length){
            const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
            //asociamos la constante con la propiedad de la instancia.
            this.favorites = favorites
        }
    },

    //propiedades computadas
    computed: {
        isFavorite(){
            return this.favorites.has(this.result.id)
        },

        //función para que únicamente nos devuelva el valor del mapa
        allFavorites(){
            return Array.from(this.favorites.values())
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
            //Añadimos como key el id del ususario y como value, el objeto con todos los parámetros del user (Map)
            this.updateStorage()
        },

        removeFavorite() {
            this.favorites.delete(this.result.id)
            //Borramos por el id
            this.updateStorage()
        },

        updateStorage(){
            //convertimos la estructura nativa en un string JSON y lo guardamos en el local storage del navegador (persistencia)
            window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
        }
    }
})

const mountedApp = app.mount('#app')

