<template>
  <!-- <el-card shadow="never" class="aboutTop">
    <div class="aboutTop-info">
      <img src="@/assets/images/logo.svg" />
      <h2>{{ packages.name }}</h2>
      <p>{{ packages.version }}</p>
    </div>
  </el-card> -->
  <el-card header="dependencies">
    <el-descriptions border :column="3">
      <el-descriptions-item v-for="(value, key) in packages.dependencies" :key="key" :label="key">{{ value }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
  <el-card header="devDependencies">
    <el-descriptions border :column="3">
      <el-descriptions-item v-for="(value, key) in packages.devDependencies" :key="key" :label="key">{{ value }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import packages from '../../../package.json'

export default {
  name: 'about',
  data() {
    return {
      packages,
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped>
.aboutTop {
  border: 0;
  background: linear-gradient(to right, #8e54e9, #4776e6);
  color: #fff;
}

.aboutTop-info {
  text-align: center;
}

.aboutTop-info img {
  width: 100px;
}

.aboutTop-info h2 {
  font-size: 26px;
  margin-top: 15px;
}

.aboutTop-info p {
  font-size: 16px;
  margin-top: 10px;
}
</style>
