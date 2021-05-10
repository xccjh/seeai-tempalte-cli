<template>
 <div class="seeai-template-vue">
   seeai-template-vue
 </div>
</template>

<script lang='ts'>
  import { defineComponent, PropType } from 'vue'
  export default defineComponent({
    name: 'seeai-template-vue',
    props: {
      attr: {
        type: String as PropType<string>
      }
    }
  })
</script>

<style lang="scss">
  .seeai-template-vuen {

  }
</style>
