<template>
  <div class="demo-children">
    <h1>This is an demo-children page --- {{myCount}}(父子传值)</h1>
    <a-button @click='emitMsg()'>Add</a-button>
    <a-button>Default</a-button>
    <a-button type="primary">Primary</a-button>
    <a-button type="dashed">Dashed</a-button>
    <a-button type="danger">Danger</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'demo-children',
  props: {
    myCount: {
      type: Number as PropType<number>,
      default: 0,
      required: true
    }
  },
  emits: {
    changeCount: (payload) => {
      // validate payload by returning a boolean
      return true
    }
  },
  setup (props, { attrs, emit }) {
    const emitMsg = () => {
      emit('changeCount', '+')
    }
    return {
      emitMsg
    }
  }
})
</script>
