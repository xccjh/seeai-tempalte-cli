<template>
    <svg class="svg-icon" @click="$emit('click',$event)">
        <use :xlink:href="'#'+icon" />
    </svg>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'svg-icon',
  props: {
    icon: {
      type: String as PropType<string>
    }
  }
})
</script>

<style lang="scss">
.svg-icon {
    fill: currentColor;
    width: 16px;
    height: 16px;
    vertical-align: -0.125em;
}
</style>
