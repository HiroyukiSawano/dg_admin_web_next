<template>
  <div>
    <el-row :gutter="16">
      <el-col :lg="12">
        <el-card header="MP4视频点播">
          <ec-player src="https://www.runoob.com/try/demo_source/movie.mp4" :options="{ poster: '#', pip: true }" autoplay />
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card header="HlS(m3u8)直播推流">
          <el-row :gutter="1">
            <el-col :span="12">
              <ec-player src="https://gcalic.v.myalicdn.com/gc/taishan02_1/index.m3u8?contentid=2820180516001" live />
            </el-col>
            <el-col :span="12">
              <ec-player src="https://gcalic.v.myalicdn.com/gc/yxhcnh_1/index.m3u8?contentid=2820180516001" live />
            </el-col>
          </el-row>
          <el-row :gutter="1" style="margin-top: 1px;">
            <el-col :span="12">
              <ec-player src="https://gcalic.v.myalicdn.com/gc/ljgcwglytylxs_1/index.m3u8?contentid=2820180516001" live />
            </el-col>
            <el-col :span="12">
              <ec-player src="https://gcalic.v.myalicdn.com/gc/hsxhdxg_1/index.m3u8?contentid=2820180516001" live />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import EcPlayer from '@/components/EcPlayer'
defineOptions({ name: 'vabPlayer' })
</script>
<style lang="scss" scoped>
</style>
