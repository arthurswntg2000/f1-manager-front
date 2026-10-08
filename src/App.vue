// Criado (08/10/2026)
<script lang="ts" setup>

</script>

<template>
  <v-app>
    <v-main class="pa-0 ma-0">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
/* Remove margens e garante que a aplicação ocupe exatamente a altura total do navegador */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
</style>