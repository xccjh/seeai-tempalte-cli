<template>
  <div class="login">
    <h1>This is an login page</h1>
    <h1>Welcome To Use SEEAI Template</h1>
    <div>
      <img :src='imgUrl' alt=''>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'login',
  setup () {
    return {
      imgUrl: require('@images/logo.png')
    }
  }
})
</script>
