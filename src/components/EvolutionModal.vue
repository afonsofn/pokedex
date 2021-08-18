<template>
  <div id="modal_evolution" class="modal">
    <div v-if="evolutionOrdered.length === 0" class="loading-wrapper">
      <Loading />
    </div>

    <main v-else class="modal-content">
      <template v-for="(evol, index) in evolutionOrdered">
        <div v-bind:key="index" class="evolution-chain">
          <img :src="evol.sprites.front_default" alt="pokemon">
          <p>{{ evol.name }}</p>
        </div>
      </template>
    </main>

    <footer class="modal-footer">
      <a class="modal-close waves-effect waves-light white-text btn-flat">close</a>
    </footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Loading from './Loading.vue' 

  export default {
    name: 'evolutionModal',
    props: {
      evolution: Object
    },
    components: {
      Loading
    },
    data() {
      return {
        evolutions: {
          firstEvolution: null,
          secondEvolution: null,
          thirdEvolution: null
        },
        evolutionOrdered: [],
        timer: null
      }
    },
    computed: mapState({
      evolutionChainDetails: state => state.evolution
    }),
    methods: {
      // Geting evolutions Details
      mountEvolutionChain() {
        // Seting evolution names
        this.evolutions.firstEvolution = this.evolution.species.name

        if(this.evolution.evolves_to.length > 0) {
          this.evolutions.secondEvolution = this.evolution.evolves_to[0].species.name

          this.evolution.evolves_to[0].evolves_to.map(obj => {
            this.evolutions.thirdEvolution = this.evolution.evolves_to[0].evolves_to[0].species.name
          })
        }

        // Removing other evolutions
        this.$store.commit("clearPokemonEvolution")

        // Request for each evolution with names previously set
        Object.values(this.evolutions).map(evolution => {
          if(evolution) {
            this.$store.dispatch("getPokemonDetails", {pokeName: evolution, evolution: true})
          }
        })
      },
      // Orders evolutions if the requests are resolved out of order
      orderingEvolutionChain() {
        Object.values(this.evolutions).map(evolName => {
          if(evolName) {
            this.evolutionOrdered.push(this.evolutionChainDetails.find(evol => evol.name === evolName))
          }
        })
      },
      // Restart data()
      resetState() {
        this.evolutions = {
          firstEvolution: null,
          secondEvolution: null,
          thirdEvolution: null
        }
        this.evolutionOrdered = []
      }
    },
    watch: {
      // Every time get a new prop
      evolution: function(_a, _o) {
        this.resetState()
        this.mountEvolutionChain()
      },
      // Debounce to call orderingEvolutionChain function after requests.
      evolutionChainDetails: function(_a, _o) {
        if(this.timer !== null) {
          clearTimeout(this.timer)
        }

        this.timer = setTimeout(() => {
          this.orderingEvolutionChain()
        }, 1000);
      }
    }
  }
</script>

<style src="@/styles/evolution-modal.scss" lang="scss" scoped />
