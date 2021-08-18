import Vue from 'vue'
import Vuex from 'vuex'

import { pokeApi } from '../services/pokeApi'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Data
    allPokemons: null,
    pokemonDetails: null,
    location: [],
    evolutionChainUrl: null,
    evolutionDetails: null,
    evolution: [],
    // Pagination
    currentPage: 1,
    offset: 0,
    limit: 6,
    next: null,
    previous: null,
    // Loadings
    pokemonLoading: true,
    locationLoading: true,
    evolutionLoading: true,
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
    setPokemonEvolution(state, payload) {
      state.evolution.push(payload)
    },
    clearPokemonEvolution(state, _payload) {
      state.evolution = []
    },
    setEvolutionChainUrl(state, payload) {
      state.evolutionChainUrl = payload
    },
    setEvolutionDetails(state, payload) {
      state.evolutionDetails = payload
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
    setEvolutionLoading(state, payload) {
      state.evolutionLoading = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    getAllPokemons({ commit }, params) {
      commit("setLoading", true)

      pokeApi('/pokemon/', {
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
    getPokemonDetails({ commit }, { pokeName, evolution }) {
      if(evolution === false) {
        commit("setPokemonLoading", true)
      }
      pokeApi(`/pokemon/${pokeName}`)
      .then(({ data }) => {
        if(evolution === false) {
          commit("setPokemonDetails", data)
        } else {
          commit("setPokemonEvolution", data)
        }
      })
      .finally(() => {
        commit("setPokemonLoading", false)
      })
    },
    getPokemonLocation({ commit }, pokeID) {
      commit("setLocationLoading", true)

      pokeApi(`/pokemon/${pokeID}/encounters`)
      .then(({ data }) => {
        commit("setLocationDetails", data)
      })
      .finally(() => {
        commit("setLocationLoading", false)
      })
    },
    getPokemonEvolutionChainUrl({ commit }, pokeID) {
      commit("setEvolutionLoading", true)

      pokeApi(`/pokemon-species/${pokeID}/`)
      .then(({ data: { evolution_chain } }) => {
        commit("setEvolutionChainUrl", evolution_chain)
      })
    },
    getPokemonEvolutionChain({ commit }, evolution_chain) {
      pokeApi(evolution_chain)
      .then(({ data: { chain } }) => {
        commit("setEvolutionDetails", chain)
      })
      .finally(() => {
        commit("setEvolutionLoading", false)
      })
    }
  }
})
