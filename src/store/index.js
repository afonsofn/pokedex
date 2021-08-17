import Vue from 'vue'
import Vuex from 'vuex'

import { pokeApi } from '../services/pokeApi'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Data
    allPokemons: null,
    pokemonDetails: null,
    location: null,
    // Pagination
    currentPage: 1,
    offset: 0,
    limit: 6,
    next: null,
    previous: null,
    // Loadings
    pokemonLoading: true,
    locationLoading: true,
    loading: true
  },
  mutations: {
    setAllPokemons(state, payload) {
      state.allPokemons = payload.results

      state.next = payload.next
      state.previous = payload.previous
    },
    setPokemonDetails(state, payload) {
      state.pokemonDetails = payload
    },
    setLocationDetails(state, payload) {
      state.location = payload
    },
    managePage(state, payload) {
      if (payload === "nextPage") {
        state.offset = state.offset + state.limit
        ++state.currentPage
      } else if (payload === "previousPage") {
        state.offset = state.offset - state.limit
        --state.currentPage
      }
    },
    setPokemonLoading(state, payload) {
      state.pokemonLoading = payload
    },
    setLocationLoading(state, payload) {
      state.locationLoading = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    getAllPokemons({ commit }, params) {
      commit("setLoading", true)

      pokeApi('/', {
        params: {
          offset: params.offset,
          limit: params.limit
        }
      })
      .then(({ data }) => {
        commit("setAllPokemons", data)
      })
      .finally(() => {
        commit("setLoading", false)
      })
    },
    getPokemonDetails({ commit }, pokeName) {
      commit("setPokemonLoading", true)

      pokeApi(`/${pokeName}`)
      .then(({ data }) => {
        commit("setPokemonDetails", data)
      })
      .finally(() => {
        commit("setPokemonLoading", false)
      })
    },
    getPokemonLocation({ commit }, pokeID) {
      commit("setLocationLoading", true)

      pokeApi(`/${pokeID}/encounters`)
      .then(({ data }) => {
        console.log(data);
        commit("setLocationDetails", data)
      })
      .finally(() => {
        commit("setLocationLoading", false)
      })
    }
  }
})
