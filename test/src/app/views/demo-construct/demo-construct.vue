<template>
  <div class="demo-construct">
    <RedditOutlined style='font-size: 30px'/>
    <SyncOutlined spin style='font-size: 30px'/>
    <SmileOutlined :rotate="180" style='font-size: 30px'/>
    <HeartTwoTone twoToneColor="#eb2f96" style='font-size: 30px'/>
    <svg-icon icon='account-book' style='width: 30px;height: 30px;'></svg-icon>
    <svg-icon icon='aim' style='width: 30px;height: 30px;'></svg-icon>
    <a-divider />
    <h1>This is an demo-construct page --- {{myCountComputed}}(computed)</h1>
    <h1>This is an global store data change --- {{storeCount}}</h1>
    <h1>This is an local store data change --- {{localCount}} --- {{localMapCount}}(nameScoped mapState)</h1>
    <a-button @click='incrementGlobal()'>add global storeCount</a-button>
    <a-button @click='incrementLocal()'>add local storeCount</a-button>
    <a-button @click='toLogin()'>go-to-login</a-button>
    <hello-world></hello-world>
    <demo-children @change-count='changeMyCount' :my-count='myCount'></demo-children>
    <pre>
      {{envVar}}
    </pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref, computed, watch, watchEffect, reactive } from 'vue'
import { RouteLocationNormalized, Router, useRoute, useRouter } from 'vue-router'
import { useStore, createNamespacedHelpers } from 'vuex'
import HelloWorld from '@layout/HelloWorld.vue'
import { DemoChildren } from './components'
import { RedditOutlined, SyncOutlined, SmileOutlined, HeartTwoTone } from '@ant-design/icons-vue'
const { mapState } = createNamespacedHelpers('DemoConstructStore')

export default defineComponent({
  name: 'demo-construct',
  components: {
    HelloWorld,
    DemoChildren,
    RedditOutlined,
    SyncOutlined,
    SmileOutlined,
    HeartTwoTone
  },
  setup () {
    const instance = getCurrentInstance()
    if (instance) {
      console.log('全局属性:', instance.appContext.config.globalProperties)
    }
    const router: Router = useRouter()
    const route: RouteLocationNormalized = useRoute()
    const store = useStore()
    onMounted(() => {
      console.log('this:', instance)
      console.log('route.path:', route.path)
      console.log('route.fullPath:', route.fullPath)
      console.log('route.meta:', route.meta)
      console.log('route.params:', route.params)
      console.log('route.query:', route.query)
    })
    // 注意抽离hook
    const myCount = ref(2)
    const count = ref(0)
    const numbers = reactive([1, 2, 3, 4])
    const state = reactive({
      id: 1,
      attributes: {
        name: ''
      }
    })
    const changeMyCount = () => {
      myCount.value = myCount.value + 2
    }
    const toLogin = () => {
      router.push({
        name: 'login'
      })
    }
    const myCountComputed = computed(() => myCount.value * 2)
    const stop = watchEffect(async onInvalidate => {
      // // 异步api调用，返回一个操作对象
      // const apiCall = setInterval(() => {
      //   myCount.value = myCount.value + 2
      // }, 2000)
      // onInvalidate(() => {
      //   // 取消异步api的调用。
      //   clearInterval(apiCall)
      // })
    }, {
      flush: 'post'
    })
    setTimeout(() => {
      stop()
    }, 10000)
    // 直接侦听ref
    watch(count, (count, prevCount) => {
      console.log(count, prevCount)
    })
    // 侦听响应式对象,数组和对象是引用类型，如果没有副本 old 和 new 会是同一个值
    watch(
      () => [...numbers],
      (numbers, prevNumbers) => {
        console.log('侦听响应式对象', numbers, prevNumbers)
      })

    numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
    // 深度嵌套对象监听
    watch(
      () => state,
      (state, prevState) => {
        console.log(
          state.attributes.name,
          prevState.attributes.name
        )
      }, { deep: true }
    )
    // 侦听多个数据源
    watch([count, myCount], (newValues, prevValues) => {
      console.log('watch:', newValues, prevValues)
    })
    console.log('computed:', myCountComputed.value)
    return {
      envVar: process.env,
      toLogin,
      myCount,
      myCountComputed,
      changeMyCount,
      storeCount: computed(() => store.state.storeCount),
      localCount: computed(() => store.state.DemoConstructStore.localCount),
      incrementGlobal: () => store.commit('increment'),
      incrementLocal: () => store.commit('DemoConstructStore/demoConstructIncrement')
    }
  },
  computed: {
    ...mapState<{ localCount }>({
      localMapCount: (state) => {
        return state.localCount
      }
    })
  }
})
</script>
