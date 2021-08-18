<template>
  <div id="modal1" class="modal">
    <div class="modal-content">
      <h4>Modal Header</h4>
      <p>{{ evolution }}</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'evolutionModal',
  props: {
    evolution: Object
  },
  data() {
    return {
      firstEvolution: null,
      secondEvolution: null,
      thirdEvolution: null
    }
  },
  methods: {
    mountEvolutionChain() {

      this.firstEvolution = this.evolution.species.name

      if(this.evolution.evolves_to.length > 0) {
        this.secondEvolution = this.evolution.evolves_to.map(evol => evol.species.name)
      }
      
    }
  },
  watch: {
    evolution: function(_a, _o) {
      this.mountEvolutionChain()
    }
  }
}
</script>

