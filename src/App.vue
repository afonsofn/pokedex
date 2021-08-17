<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  body, html, #app {
    margin: 0;
    padding: 0;
    font-family: 'Lexend Deca', sans-serif;
  }

  @media (max-width: 1500px) {
    html {
      font-size: 85%;
    }
  }

  @media (max-width: 1080px) {
    html {
      font-size: 80%;
    }
  }

  @media (max-width: 950px) {
    html {
      font-size: 70%;
    }
  }

  @media (max-width: 820px) {
    html {
      font-size: 60%;
    }
  }
</style>