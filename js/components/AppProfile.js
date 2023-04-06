app.component('app-profile' , {
    //props: pasar las propiedades ya que el template las necesita.
    props: ['result', 'isFavorite'],
    methods: {
        //emitimos los métodos
        addFavorite(){
            this.$emit('add-favorite')
        },
        removeFavorite(){
            this.$emit('remove-favorite')
        },
    },
    template: 
    /* html */ `
    <div class="result">
                <!-- map.has(key)-->
                <!--Las propiedades computadas sirven para que no apliquemos lógicas inline, en este caso comparamos si es favorito o no el resultado -->
                <a v-if="isFavorite" href="#" class="result__toggle-favorite" @click="removeFavorite">Remove Favorite ❌</a>
                <a v-else href="#" class="result__toggle-favorite" @click="addFavorite">Add Favorite ⭐️</a>
                <h2 class="result__name">{{ result.name }}</h2>
                <!-- Dos formas de usa v-bind -->
                <img v-bind:src="result.avatar_url" :alt="result.name" class="result__avatar">
                <p class="result__bio">{{ result.bio }}
                    <br>
                    <a v-bind:href="result.blog" target="_blank" class="result__blog">{{ result.blog }}</a>
                </p>
            </div>
    
    
    `
})