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
    evolution: [],
    evolutionChain: null,
    evolutionUrl: null,
    // Pagination
    currentPage: 1,
    offset: 0,
    limit: 6,
    next: null,
    previous: null,
    // Loadings
    pokemonLoading: true,
    loading: true
  },
  mutations: {
    // Data
    setPokemonsPagination(state, payload) {
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
    // Evolution Data
    setEvolutionUrl(state, payload) {
      state.evolutionUrl = payload
    },
    setEvolutionChain(state, payload) {
      state.evolutionChain = payload
    },
    setPokemonEvolutionDetails(state, payload) {
      state.evolution.push(payload)
    },
    clearPokemonEvolution(state, _payload) {
      state.evolution = []
    },
    // Pagination
    managePage(state, payload) {
      if (payload === "nextPage") {
        state.offset = state.offset + state.limit
        ++state.currentPage
      } else if (payload === "previousPage") {
        state.offset = state.offset - state.limit
        --state.currentPage
      }
    },
    // Loadings
    setPokemonLoading(state, payload) {
      state.pokemonLoading = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    // Get Pokemons names
    getPokemonsPagination({ commit }, params) {
      commit("setLoading", true)

      pokeApi('/pokemon/', {
        params: {
          offset: params.offset,
          limit: params.limit
        }
      })
      .then(({ data }) => {
        commit("setPokemonsPagination", data)
      })
      .catch(_error => {
        M.toast({html: 'Ops, something went wrong, try again.'})
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
          commit("setPokemonEvolutionDetails", data)
        }
      })
      .catch(_error => {
        M.toast({html: 'Ops, something went wrong, try again.'})
      })
      .finally(() => {
        commit("setPokemonLoading", false)
      })
    },
    getPokemonLocation({ commit }, pokeID) {
      pokeApi(`/pokemon/${pokeID}/encounters`)
      .then(({ data }) => {
        commit("setLocationDetails", data)
      })
      .catch(_error => {
        M.toast({html: 'Ops, something went wrong, try again.'})
      })
    },
    getPokemonEvolutionUrl({ commit }, pokeID) {
      pokeApi(`/pokemon-species/${pokeID}/`)
      .then(({ data: { evolution_chain } }) => {
        commit("setEvolutionUrl", evolution_chain)
      })
      .catch(_error => {
        M.toast({html: 'Ops, something went wrong, try again.'})
      })
    },
    getPokemonEvolutionChain({ commit }, evolution_chain) {
      pokeApi(evolution_chain)
      .then(({ data: { chain } }) => {
        commit("setEvolutionChain", chain)
      })
      .catch(_error => {
        M.toast({html: 'Ops, something went wrong, try again.'})
      })
    }
  }
})
