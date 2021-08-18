<template>
  <div class="home">
    <section class="poke-description">
      <div class="screen">
        <div v-if="!!pokemonLoading">
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
        <img v-else :src="pokemonDetails && pokemonDetails.sprites.front_default" alt="pokemon">
      </div>

      <div class="poke-info">
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
        <div class="info evolution modal-trigger" href="#modal1">
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
  </div>
</template>

<script>
  import EvolutionModal from '@/components/EvolutionModal.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'Home',
    components: {
      EvolutionModal
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
      nextPage() {
        if ( this.currentPage > 0 ) {
          this.$store.commit("managePage", "nextPage")
        }
      },
      previousPage() {
        if (this.currentPage > 1) {
          this.$store.commit("managePage", "previousPage")
        }
      },
      getPokemonDetails(pokeName) {
        this.$store.dispatch("getPokemonDetails", {pokeName: pokeName, evolution: false})
      }
    },
    mounted() {
      this.$store.dispatch("getAllPokemons", {offset: this.offset, limit: this.limit})

      M.Modal.init(document.querySelectorAll('.modal'))
    },
    watch: {
      allPokemons: function(_a, _o) {
        this.$store.dispatch("getPokemonDetails", {pokeName: this.allPokemons[0].name, evolution: false})
      },
      pokemonDetails: function(_a, _o) {
        this.$store.dispatch("getPokemonLocation", this.pokemonDetails.id)
        this.$store.dispatch("getPokemonEvolutionChainUrl", this.pokemonDetails.id)
      },
      evolutionChainUrl: function(_a, _o) {
        this.$store.dispatch("getPokemonEvolutionChain", this.evolutionChainUrl)
      },
      offset: function(_a, _o) {
        this.$store.dispatch("getAllPokemons", {offset: this.offset, limit: this.limit})
      },
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    background-image: url("../assets/pokedex.png");
    background-position: bottom left;
    background-size: cover;
    
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    .poke-description {
      height: 80vh;
      width: 30vw;
      border: 5px double #eee;
      border-radius: 0.625rem;
      background-image: linear-gradient(to bottom right, rgba(56, 56, 56, 0.808), rgba(163, 48, 48, 0.637) 100%);
      margin-left: 10rem;

      .screen {
        border: 5px double #eee;
        border-radius: 0.9rem;
        height: 35%;
        background-color: rgba(15, 94, 158, 0.329);
        background-image: url('../assets/fondo.png');
        background-size: cover;
        background-position: center;
        
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 20rem;
          animation: to-up 1.5s, fadeIn 1.5s;
        }
      }

      .poke-info {
        padding: 0.7rem;
        height: 65%;

        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        .info {
          color: rgb(51, 51, 51);
          font-size: 23px;
          border: 5px ridge #eee;
          border-radius: 0.625rem;
          height: 16%;
          padding-left: 1rem;

          background-color: rgb(219, 219, 219);
          text-transform: capitalize;

          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 0.5rem;

          p {
            margin: 0;
            white-space: nowrap;                  
            overflow: hidden;
            text-overflow: ellipsis;
            width: 95%;
            font-size: 18px;
          }
        }

        .info.evolution {
          justify-content: center;
          border: 5px ridge rgb(156, 156, 156);
          background-image: linear-gradient(to bottom right, rgba(189, 153, 35, 0.808), rgba(163, 65, 48, 0.637) 100%);
          color: #eee;
          animation: decrease 0.5s;

          &:hover {
            cursor: pointer;
            animation: grow 0.7s;
            transform: scale(1.08)
          }
        }
      }
    }

    .poke-list {
      height: 80vh;
      width: 30vw;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .poke-item {
        height: 11vh;
        border-radius: 10px 90% / 20px 25em 30px 35em;
        border: 5px double #eee;
        background-image: linear-gradient(to bottom right, rgba(56, 56, 56, 0.808), rgba(163, 48, 48, 0.637) 100%);
        
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 2rem;
        padding-left: 4rem;

        animation: decrease 0.5s;

        &:hover {
          cursor: pointer;
          animation: grow 0.7s;
          transform: scale(1.08)
        }

        .pokeball {
          height: 4rem;
        }

        h3 {
          margin: 0;
          width: 65%;
          text-transform: capitalize;
          white-space: nowrap;                  
          overflow: hidden;
          text-overflow: ellipsis;
          color: #eee;
        }
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;

      .material-icons {
        font-size: 8rem;
        background: -webkit-linear-gradient(rgba(255, 255, 255, 0.808), rgba(173, 17, 17, 0.637));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &:hover {
          cursor: pointer;
        }
      }

      .material-icons.back {
        transform: scaleX(-1);
      }

      .disabled {
        background: -webkit-linear-gradient(rgba(255, 255, 255, 0.308), rgba(199, 199, 199, 0));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &:hover {
          cursor: default;
          user-select: none;
        }
      }
    }
  }

  @media only screen and (max-width: 1200px) {
    .home {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 3rem;
      padding-bottom: 2rem;

      .poke-description {
        height: 50vw;
        width: 80vw;
        margin-left: 0;

        .poke-info {
          .info {
            font-size: 17px;

            p {
              width: 100%;
              font-size: 14px;
            }
          }
        }
      }

      .poke-list {
        height: 30vh;
        width: 100%;

        align-items: center;
        justify-content: center;

        flex-direction: row;
        flex-wrap: wrap;

        .poke-item {
          height: 5rem;
          width: 30%;
          padding-left: 3rem;

          .pokeball {
            height: 3rem;
          }

          h3 {
            font-size: 2.3rem;
          }
        }
      }

      .pagination {
        .material-icons {
          font-size: 5rem;
        }
      }
    }
  }

  @media only screen and (max-width: 730px) {
    .home {
      .poke-description {
        height: 100vw;
      }
      .poke-list {
        .poke-item {
          height: 8vh;
          padding-left: 1rem;
          justify-content: center;

          .pokeball {
            display: none;
          }

          h3 {
            font-size: 2rem;
            width: none;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 550px) {
    .home {
      .poke-description {
        height: 140vw;
      }

      .poke-list {
        .poke-item {
          padding: 0;
          h3 {
            font-size: 1.4rem;
          }
        }
      }
    }
  }


  @media only screen and (max-height: 570px) {
    .home {
      .poke-description {
        height: 120vw;
      }
    }
  }

  @keyframes to-up {
    from {
      transform: translateX(5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
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

</style>
