<template>
  <div class="home">
    <section class="poke-description"></section>
    <section class="poke-list">
      <div class="poke-item"></div>
      <div class="poke-item"></div>
      <div class="poke-item"></div>
      <div class="poke-item"></div>
      <div class="poke-item"></div>
      <div class="poke-item"></div>
      <div class="pagination">
        <i class="material-icons back">play_arrow</i>
        <i class="material-icons">play_arrow</i>
      </div>
    </section>
  </div>
</template>

<script>
import EvolutionModal from '@/components/EvolutionModal.vue'

export default {
  name: 'Home',
  components: {
    EvolutionModal
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
        &:hover {
          cursor: pointer;
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
      width: 80vw;
      margin-left: 0;
    }

    .poke-list {
      height: 50vh;
      width: 100%;

      align-items: center;
      justify-content: center;

      flex-direction: row;
      flex-wrap: wrap;

      .poke-item {
        width: 30%;
      }
    }
  }
}

</style>
