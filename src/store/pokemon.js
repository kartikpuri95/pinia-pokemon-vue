import { defineStore } from 'pinia'

export const usePokemonStore = defineStore({
  id: 'pokemon',
  state: () => ({
    loading: false,
    error: null,
    pokemonList: [],
  }),
  actions: {
    async fetchRandomPokemon() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`)
        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon list')
        }
        const data = await response.json()
        const promises = data.results.map(async (result) => {
          const response = await fetch(result.url)
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokemon: ${result.name}`)
          }
          return response.json()
        })
        const pokemonList = await Promise.all(promises)
        this.pokemonList = pokemonList
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    hasPokemonList() {
      return this.pokemonList.length > 0
    }
  }
})
