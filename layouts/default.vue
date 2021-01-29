<template>
  <v-app dark>
    <v-app-bar dense color="#272727" app>
      <v-img
        :src="require('@/assets/brand/yoidore_logo_white.svg')"
        contain
        height="30"
        aspect-ratio="1"
      />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer dark>
      <v-col class="text-center" cols="12">
        <i>Stay Home, Stay Safe, and Stay Positive with Apex Legends!</i>
        <p>Made with ♥ by noribento.</p>
      </v-col>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
p,
i {
  font-family: 'Fira Sans';
}
</style>
