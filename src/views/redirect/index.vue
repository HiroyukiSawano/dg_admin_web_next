<template>
  <div></div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
defineOptions({
  name: 'Redirect',
})
const route = useRoute()
const router = useRouter()
const { params, query } = route
const { path } = params

router.replace({ path: '/' + path, query })

// onBeforeMount(() => {
//   setTimeout(() => {
//     history.back()
//   }, 500)
// })
</script>
<style lang="scss" scoped></style>
