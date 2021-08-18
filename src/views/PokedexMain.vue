<template>
  <main class="pokedex-main">
    <section class="poke-description">
      <header class="screen">
        <div v-if="!!pokemonLoading">
          <Loading />
        </div>

        <img v-else :src="pokemonDetails && pokemonDetails.sprites.front_default" alt="pokemon">
      </header>

      <div class="poke-infos">
        <div class="info">
          name: {{ pokemonDetails && pokemonDetails.name }}
        </div>

        <div class="info">
          type: <p>{{ pokemonDetails && pokemonDetails.types.map(type => type.type.name.toUpperCase()).join(', ') }}</p>
        </div>

        <div class="info">
          abilities: <p>{{ pokemonDetails && pokemonDetails.abilities.map(ability => ability.ability.name.toUpperCase()).join(', ') }}</p>
        </div>

        <div class="info">
          locations: <p>{{ location.length !== 0 ? location.map(location_area => location_area.location_area.name.toUpperCase()).join(', ') : "UNKNOWN LOCATION"}}</p>
        </div>

        <div class="info">
          games: <p>{{ pokemonDetails && pokemonDetails.game_indices.map(version => version.version.name.toUpperCase()).join(', ') }}</p> 
        </div>

        <div class="info evolution modal-trigger" href="#modal_evolution">
          EVOLUTIONS
        </div>
      </div>
    </section>

    <section class="poke-list">
      <template v-for="(pokemon, index) in allPokemons">
        <div @click="getPokemonDetails(pokemon.name)" v-bind:key="index" class="poke-item">
          <img src="../assets/pokeball.png" alt="pokebola" class="pokeball" >
          <h3>{{ pokemon.name }}</h3>
        </div>
      </template>

      <div class="pagination">
        <i v-if="currentPage > 1" class="material-icons back" @click.prevent="previousPage">play_arrow</i>
        <i v-else class="material-icons back disabled" >play_arrow</i>

        <i v-if="next && currentPage > 0" class="material-icons" @click.prevent="nextPage">play_arrow</i>
        <i v-else class="material-icons disabled">chevron_right</i>
      </div>
    </section>

    <EvolutionModal :evolution="evolutionDetails" />
  </main>
</template>

<script>
  // Components
  import EvolutionModal from '@/components/EvolutionModal.vue'
  import Loading from '@/components/Loading.vue'
  // Utils
  import { mapState } from 'vuex'

  export default {
    name: 'PokedexMain',
    components: {
      EvolutionModal,
      Loading
    },
    computed: mapState({
      // Data
      allPokemons: state => state.allPokemons,
      pokemonDetails: state => state.pokemonDetails,
      location: state => state.location,
      evolutionChainUrl: state => state.evolutionChainUrl,
      evolutionDetails: state => state.evolutionDetails,
      // Pagination
      currentPage: state => state.currentPage,
      offset: state => state.offset,
      limit: state => state.limit,
      next: state => state.next,
      previous: state => state.previous,
      // Loadings
      pokemonLoading: state => state.pokemonLoading,
      locationLoading: state => state.locationLoading,
      evolutionLoading: state => state.evolutionLoading,
      loading: state => state.loading
    }),
    methods: {
      // Pagination Method
      nextPage() {
        if ( this.currentPage > 0 ) {
          this.$store.commit("managePage", "nextPage")
        }
      },
      // Pagination Method
      previousPage() {
        if (this.currentPage > 1) {
          this.$store.commit("managePage", "previousPage")
        }
      },
      // Request for Pokemon details 
      getPokemonDetails(pokeName) {
        this.$store.dispatch("getPokemonDetails", {pokeName: pokeName, evolution: false})
      }
    },
    mounted() {
      // Pagination request, get Pokemon names 
      this.$store.dispatch("getAllPokemons", {offset: this.offset, limit: this.limit})
      // Starting Modal
      M.Modal.init(document.querySelectorAll('.modal'))
    },
    watch: {
      // Get details of the first Pokemon from pagination
      allPokemons: function(_a, _o) {
        this.$store.dispatch("getPokemonDetails", {pokeName: this.allPokemons[0].name, evolution: false})
      },
      // Get location/ evolution info.
      pokemonDetails: function(_a, _o) {
        this.$store.dispatch("getPokemonLocation", this.pokemonDetails.id)
        this.$store.dispatch("getPokemonEvolutionChainUrl", this.pokemonDetails.id)
      },
      // Get evolutionChain.
      evolutionChainUrl: function(_a, _o) {
        this.$store.dispatch("getPokemonEvolutionChain", this.evolutionChainUrl)
      },
      offset: function(_a, _o) {
        this.$store.dispatch("getAllPokemons", {offset: this.offset, limit: this.limit})
      },
    }
  }
</script>

<style src="@/styles/pokedex-main.scss" lang="scss" scoped />
