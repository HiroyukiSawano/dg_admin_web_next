<template>
  <div class="el-page">
    <el-card>
      <template #header>
        <div class="el-card__title">{{ $translate('ec.home.feature.frame', locales) }}</div>
      </template>
      <p>{{ $translate('ec.home.feature.frameContent', locales) }}</p>
    </el-card>

    <el-card>
      <template #header>
        <div class="el-card__title">{{ $translate('ec.home.feature.principle', locales) }}</div>
      </template>
      <p>{{ $translate('ec.home.feature.principleContent', locales) }}</p>
    </el-card>
    <el-card>
      <template #header>
        <div class="el-card__title">{{ $translate('ec.home.market.agreement', locales) }}</div>
      </template>
      <div>
        <p>{{ $translate('ec.home.market.agreementContent', locales) }}</p>
      </div>
    </el-card>
    <el-card>
      <template #header>
        <div class="el-card__title">{{ $translate('ec.home.market.clearness', locales) }}</div>
      </template>
      <div>
        <p>{{ $translate('ec.home.market.clearnessContent', locales) }}</p>
      </div>
    </el-card>
    <el-card>
      <template #header>
        <div class="el-card__title">{{ $translate('ec.home.market.growth', locales) }}</div>
      </template>
      <div>
        <p>{{ $translate('ec.home.market.growthContent', locales) }}</p>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const locales = ref({
  en: {
    'ec.home.feature.frame': 'Frame',
    'ec.home.feature.frameContent': 'Based on years of product design and development experience in digital government. This system consists of design, development, components, tools, cases, etc. Users can quickly build consistent digital products according to specifications',
    'ec.home.feature.principle': 'Principle',
    'ec.home.feature.principleContent': 'Building products with its own brand characteristics and easy-to-use features on the basis of open source system, adhering to the values of consistency, clarity, and growth.',

    'ec.home.market.agreement': 'Consistent rules ensure overall coordination',
    'ec.home.market.agreementContent': 'Design system with standardized styles and highly consistent operating procedures can bring brand trust to users while reducing the cost of repeated learning.',
    'ec.home.market.clearness': 'Clear direction is also an improvement in efficiency',
    'ec.home.market.clearnessContent': 'Clear design system makes product operation intuitive and the process one-step; The information is conveyed clearly and with clear meaning, allowing users to quickly understand and make judgments in a very short period of time.',
    'ec.home.market.growth': 'Continuous growth direction is also visual evolution',
    'ec.home.market.growthContent': 'The growth of product functionality is accompanied by the evolution of user roles. Designers should take responsibility for the products they create and enhance the discoverability of functionality and value',
  },
  'zh-CN': {
    'ec.home.feature.frame': '框架',
    'ec.home.feature.frameContent': '基于数字政府多年的产品设计开发经验。该系统由设计、开发、组件、工具、案例等组成，用户可根据规范快速构建一致的数字产品',
    'ec.home.feature.principle': '原则',
    'ec.home.feature.principleContent': '在开源体系的基础上打造具有自身品牌特色且好用的产品，秉承一致、清晰、生长的价值观。',

    'ec.home.market.agreement': '一致的规则保证整体的协调',
    'ec.home.market.agreementContent': '样式规范、操作流程高度一致的设计体系，给用户带来品牌信赖感的同时，能够降低用户反复学习的成本。',
    'ec.home.market.clearness': '清晰的指向亦是效率的提升',
    'ec.home.market.clearnessContent': '清晰的设计体系使得产品操作直观，流程一步到位；信息传达清晰且表意明确，使用户在极短时间内快速理解进而做出判断。',
    'ec.home.market.growth': '不断生长指向亦是视觉进化',
    'ec.home.market.growthContent': '产品功能的增长与用户角色的演变相生相伴。设计者应为自己创造的产品负责，提升功能、价值的可发现性',
  },
})
</script>
<style lang="scss" scoped>
.el-card {
  .el-card__header {
    font-weight: var(--el-font-weight-primary);
  }
  .el-card__body {
    p {
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
