const API = "https://api.github.com/users/"

const requestMaxTimeMs = 3000

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
        if (savedFavorites?.length) {
            //La interrogación indica si existe o no la propiedad y en caso de que no, no arrojará un error sino que retornará un valor nulo.
            const favorites = new Map(savedFavorites.map(favorite => [favorite.login, favorite]))
            //asociamos la constante con la propiedad de la instancia.
            this.favorites = favorites
        }
    },

    //propiedades computadas
    computed: {
        isFavorite() {
            return this.favorites.has(this.result.login)
        },

        //función para que únicamente nos devuelva el valor del mapa
        allFavorites() {
            return Array.from(this.favorites.values())
        }
    },

    methods: {
        async doSearch() {
            this.result = this.error = null

            //Esto lo hacemos para que no esté constantemente haciendo la misma petición http cuando nos encontramos como favoritos y nos volvemos a buscar.
            const foundInFavorites = this.favorites.get(this.search)

            const shouldRequestAgain = (() => {
                if (!!foundInFavorites) {
                    const { lastRequest } = foundInFavorites;
                    return (
                        new Date().getTime() - new Date(lastRequest).getTime() >
                        requestMaxTimeMs
                    );
                }
                return false;
            })(); // IIFE

            //la doble interrogación fuerza a la constante a ser evaluada como boolean, un casteo a boolean.
            if (!!foundInFavorites && !shouldRequestAgain) {
                console.log('Found and we use the cached version')
                return (this.result = foundInFavorites)
            }
            //si obtenemos un return, salimos de la función y no usamos el try/catch

            await this.doRequest()
            if (foundInFavorites) foundInFavorites.lastRequest = new Date();
        },

        async doRequest() {
            try {
                console.log('Not found or cached version is too old')
                //Reactividad en dos sentidos: podemos modificar el valor de la variable search desde el cuadro de búsqueda o desde la devtools de vue
                //con fetch solicitamos datos via http (Axios) y sustituye a XMLHttpRequest
                this.result = this.error = null;
                const response = await fetch(API + this.search)

                if (!response.ok) throw new Error('User Not Found') //el ok lo sacamos de la respuesta, será false si el usuario no existe
                //console.log(response) de aquí sacamos la propiedad ok en false cuando se produce un error de no encontrado.
                //la respuesta la tenemos que interpretar en formato json
                const data = await response.json()
                console.log(data)
                this.result = data

            } catch (error) {
                this.error = error
            } finally {
                this.search = null //limpiamos la caja de búsqueda
            }
        },

        addFavorite() {
            this.result.lastRequestTime = Date.now() //existe un problema con la no repetición de peticiones http, y es que si hacemos cambios en nuestra cuenta
            //como avatar, descripción, etc, nunca obtendremos esos datos actualizados. Así que vamos a generar un temporizador y se hará una nueva petición pasado
            //ese tiempo.
            this.favorites.set(this.result.login, this.result)
            //Añadimos como key el login del ususario y como value, el objeto con todos los parámetros del user (Map)
            this.updateStorage()
        },

        removeFavorite() {
            this.favorites.delete(this.result.login)
            //Borramos por el login
            this.updateStorage()
        },

        showFavorite(favorite) {
            this.result = favorite

        },


        checkFavorite(id) {
            return this.result?.login === id
        },

        updateStorage() {
            //convertimos la estructura nativa en un string JSON y lo guardamos en el local storage del navegador (persistencia)
            window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
        }
    }
})

const mountedApp = app.mount('#app')

