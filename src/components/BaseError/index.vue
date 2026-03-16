<template>
  <div class="el-result">
    <el-row :gutter="16">
      <el-col :lg="{ span: 8, offset: 4 }">
        <div class="el-result__image">
          <component :is="components['Error' + code]" />
        </div>
      </el-col>
      <el-col :lg="8">
        <div class="el-result__icon">{{ code }}</div>
        <div class="el-result__title">
          <p>{{ title }}</p>
        </div>
        <!-- <div class="el-result__subtitle">
          <p>{{ description }}</p>
        </div> -->
        <div class="el-result__extra">
          <el-button type="primary" @click="router.push({ path: '/' })">{{ $t('ec.error.notice.button.text') }}</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { shallowReactive } from 'vue'
import { useRouter } from 'vue-router'
import Error403 from './Error403'
import Error404 from './Error404'
import Error500 from './Error500'
defineOptions({
  name: 'BaseError',
})
defineProps({
  code: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
})
const components = shallowReactive({ Error403, Error404, Error500 })
const router = useRouter()
</script>
<style lang="scss" scoped>
.el-row {
  width: 100%;
  .el-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media only screen and (min-width: 1200px) {
      align-items: flex-start;
      &.el-col-lg-offset-4 {
        align-items: flex-end;
      }
    }
  }
}

.el-result {
  height: 100%;
  background-color: var(--el-fill-color-blank);
  --el-result-padding: 0;
  --el-result-icon-font-size: 48px;
  --el-result-title-font-size: 14px;
  --el-result-title-margin-top: 16px;
  --el-result-extra-margin-top: 32px;
  .el-result__image {
    width: 100%;
    line-height: 1;
    width: 340px;
      height: 240px;
    > svg {
      width: 100%;
      height: 100%;
    }
  }
  .el-result__icon {
    font-size: var(--el-result-icon-font-size);
    font-weight: 600;
    line-height: 1;
  }
}
</style>
