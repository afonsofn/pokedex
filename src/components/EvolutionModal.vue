<template>
  <div id="modal1" class="modal">
    <div v-if="evolutionOrdered.length === 0">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="modal-content">
      <template v-for="(evol, index) in evolutionOrdered">
        <div v-bind:key="index" class="evolution-chain">
          <img :src="evol.sprites.front_default" alt="pokemon">
          <p>{{ evol.name }}</p>
        </div>
      </template>
    </div>
    <div class="modal-footer">
      <a class="modal-close waves-effect waves-light white-text btn-flat">close</a>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'evolutionModal',
    props: {
      evolution: Object
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
      evolutionChain: state => state.evolution
    }),
    methods: {
      mountEvolutionChain() {
        this.evolutions.firstEvolution = this.evolution.species.name

        if(this.evolution.evolves_to.length > 0) {
          this.evolutions.secondEvolution = this.evolution.evolves_to[0].species.name

          this.evolution.evolves_to[0].evolves_to.map(obj => {
            this.evolutions.thirdEvolution = this.evolution.evolves_to[0].evolves_to[0].species.name
          })
        }

        this.$store.commit("clearPokemonEvolution")

        Object.values(this.evolutions).map(evolution => {
          if(evolution) {
            this.$store.dispatch("getPokemonDetails", {pokeName: evolution, evolution: true})
          }
        })
      },
      orderingEvolutionChain() {
        Object.values(this.evolutions).map(evolName => {
          if(evolName) {
            this.evolutionOrdered.push(this.evolutionChain.find(evol => evol.name === evolName))
          }
        })
      },
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
      evolution: function(_a, _o) {
        this.resetState()
        this.mountEvolutionChain()
      },
      evolutionChain: function(_a, _o) {
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

<style lang="scss" scoped>
  .modal {
    border: 5px double #eee;
    background-image: linear-gradient(to bottom right, rgba(146, 146, 146, 0.808), rgba(17, 44, 119, 0.897) 100%);

    width: 80%;
    .modal-content{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5rem;

      .evolution-chain {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        animation: decrease 0.5s;

        &:hover {
          animation: grow 0.7s;
          transform: scale(1.08)
        }

        img {
          height: 15rem;
        }

        p {
          margin: 0;
          color: #eee;
          font-size: 2rem;
          text-transform: capitalize;
        }
        
      }
    }

     @keyframes grow {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.08);
    }
  }

  @keyframes decrease {
    from {
      transform: scale(1.08);
    }
    to {
      transform: scale(1);
    }
  }

    .modal-footer {
      background: transparent;
    }
  }

  @media only screen and (max-width: 700px) {
    .modal {
      height: 100%;

      .modal-content {
        flex-direction: column;
        gap: 1rem;
      }
    }
  }
</style>

