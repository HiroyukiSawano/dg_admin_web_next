<template>
  <el-descriptions title="Table row data" :column="2" border>
    <el-descriptions-item v-for="(val, key) in data" :key="key" :label="key" width="150px">{{ val }}</el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  data() {
    return {
      data: {
        id: '',
      },
    }
  },
  mounted() {},
  methods: {
    //注入数据
    setData(data) {
      this.data = data
    },
  },
}
</script>

<style></style>
