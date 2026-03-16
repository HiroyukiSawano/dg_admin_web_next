<template>
  <el-card>
    <template #header>
      <div class="el-card__title">{{ $t(route.meta.title) }}</div>
    </template>
    <el-form ref="formsRef" :model="forms" label-width="auto"
      :label-position="useSystemStore().device === 'mobile' ? 'top' : 'right'">
      <el-row :gutter="24">
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.sblsh', locales)" prop="code">
            <el-input v-model="forms.code" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.zzlb', locales)" prop="organization_type">
            <el-input v-model="forms.organization_type" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item :label="$translate('ec.f.g.f.l.zzjgmc', locales)" prop="organization_name">
            <el-input v-model="forms.organization_name" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.frzzbh', locales)" prop="legal_code">
            <el-input v-model="forms.legal_code" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.wtdlr', locales)" prop="agent_people">
            <el-input v-model="forms.agent_people" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.wtdlrzjlx', locales)" prop="agent_card">
            <el-input v-model="forms.agent_card" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.wtdlrzlxsj', locales)" prop="agent_telephone">
            <el-input v-model="forms.agent_telephone" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item :label="$translate('ec.f.g.f.l.wtdlrzqx', locales)" prop="agent_permission">
            <el-input v-model="forms.agent_permission" type="textarea" :rows="3" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.wtqx', locales)" prop="agent_limit">
            <el-input v-model="forms.agent_limit" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item :label="$translate('ec.f.g.f.l.fddbr', locales)" prop="legal_people">
            <el-input v-model="forms.legal_people" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label=" ">
            <el-button type="primary" @click="handleFormInit">{{ $translate('ec.f.g.f.b.text.dataFill', locales)
              }}</el-button>
            <el-button @click="handleFormdReset">{{ $translate('ec.f.g.f.b.text.dataReset', locales) }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script setup>

import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/modules/systemStore'
defineOptions({ name: 'formGrid' })
const route = useRoute()
const { proxy } = getCurrentInstance()
const locales = {
  en: {
    'ec.f.g.f.l.sblsh': 'Apply Serial Code',
    'ec.f.g.f.c.sblsh': '0215010023332363',

    'ec.f.g.f.l.zzlb': 'Organization Type',
    'ec.f.g.f.c.zzlb': 'Legal entities and unincorporated organizations',

    'ec.f.g.f.l.zzjgmc': 'Organization Name',
    'ec.f.g.f.c.zzjgmc': 'Shandong Jingbo New Energy Holdings Development Co., Ltd. Qingdao No. 381 Gas Station',

    'ec.f.g.f.l.frzzbh': 'Corporate License Number',
    'ec.f.g.f.c.frzzbh': '91370211MA3PFYJX0Y',

    'ec.f.g.f.l.wtdlr': 'Entrusted Agent',
    'ec.f.g.f.c.wtdlr': 'Mingming Wang',

    'ec.f.g.f.l.wtdlrzjlx': 'Entrusted Agent Certificate Type',
    'ec.f.g.f.c.wtdlrzjlx': 'ID Card',

    'ec.f.g.f.l.wtdlrzlxsj': 'Entrusted Agent Phone',
    'ec.f.g.f.c.wtdlrzlxsj': '17661635389',

    'ec.f.g.f.l.wtdlrzqx': 'Entrusted Agent Authorization',
    'ec.f.g.f.c.wtdlrzqx': 'Acting as an agent to submit, correct, and supplement application materials, signing for relevant legal documents, accepting inquiries from symbolic approval authorities, and responding to them. Acting as an agent to facilitate and fulfill other rights and obligations related to this matter',

    'ec.f.g.f.l.wtqx': 'Entrusted Limit',
    'ec.f.g.f.c.wtqx': 'From May 28, 2022 to June 5, 2022, until the completion of the handling of this government service matter',

    'ec.f.g.f.l.fddbr': 'Legal Person',
    'ec.f.g.f.c.fddbr': 'Guozhong Wang',

    'ec.f.g.f.b.text.dataFill': 'Data Fill',
    'ec.f.g.f.b.text.dataReset': 'Data Reset',
  },
  'zh-CN': {
    'ec.f.g.f.l.sblsh': '申办流水号',
    'ec.f.g.f.c.sblsh': '0215010023332363',

    'ec.f.g.f.l.zzlb': '组织类别',
    'ec.f.g.f.c.zzlb': '法人及非法人组织',

    'ec.f.g.f.l.zzjgmc': '组织计构名称',
    'ec.f.g.f.c.zzjgmc': '山东京博新能源控股发展有限公司青岛第三百八十一加油站',

    'ec.f.g.f.l.frzzbh': '法人证照编号',
    'ec.f.g.f.c.frzzbh': '91370211MA3PFYJX0Y',

    'ec.f.g.f.l.wtdlr': '委托代理人',
    'ec.f.g.f.c.wtdlr': '王明明',

    'ec.f.g.f.l.wtdlrzjlx': '委托代理人证件类型',
    'ec.f.g.f.c.wtdlrzjlx': '身份证',

    'ec.f.g.f.l.wtdlrzlxsj': '委托代理人联系手机',
    'ec.f.g.f.c.wtdlrzlxsj': '17661635389',

    'ec.f.g.f.l.wtdlrzqx': '委托代理人权限',
    'ec.f.g.f.c.wtdlrzqx': '代理提交、更正、补充申请材料代为签收相关法律文书代为接受象征审批机关有关事宜的询问并予以答复代为行便、履行与本事项相关的其他权力和义务。',

    'ec.f.g.f.l.wtqx': '委托期限',
    'ec.f.g.f.c.wtqx': '自2022-05-28至2022-06-05该政务服务事项办理完结止',

    'ec.f.g.f.l.fddbr': '法定代表人',
    'ec.f.g.f.c.fddbr': '王国中',

    'ec.f.g.f.b.text.dataFill': '数据填充',
    'ec.f.g.f.b.text.dataReset': '数据重置',
  },
}
const forms = ref({
  code: '',
  organization_type: '',
  organization_name: '',
  legal_people: '',
  legal_code: '',
  agent_people: '',
  agent_card: '',
  agent_telephone: '',
  agent_permission: '',
  agent_limit: '',
})
const formsRef = ref(null)
const handleFormdReset = () => {
  formsRef.value && formsRef.value.resetFields()
}
const handleFormInit = () => {
  forms.value.code = computed(() => proxy.$translate('ec.f.g.f.c.sblsh', locales))
  forms.value.organization_type = computed(() => proxy.$translate('ec.f.g.f.c.zzlb', locales))
  forms.value.organization_name = computed(() => proxy.$translate('ec.f.g.f.c.zzjgmc', locales))
  forms.value.legal_people = computed(() => proxy.$translate('ec.f.g.f.c.fddbr', locales))
  forms.value.legal_code = computed(() => proxy.$translate('ec.f.g.f.c.frzzbh', locales))
  forms.value.agent_people = computed(() => proxy.$translate('ec.f.g.f.c.wtdlr', locales))
  forms.value.agent_card = computed(() => proxy.$translate('ec.f.g.f.c.wtdlrzjlx', locales))
  forms.value.agent_telephone = computed(() => proxy.$translate('ec.f.g.f.c.wtdlrzlxsj', locales))
  forms.value.agent_permission = computed(() => proxy.$translate('ec.f.g.f.c.wtdlrzqx', locales))
  forms.value.agent_limit = computed(() => proxy.$translate('ec.f.g.f.c.wtqx', locales))
}


onMounted(() => {
  handleFormInit()
})
</script>
<style lang="scss" scoped>
.el-card {
  .el-card__title {
    font-weight: var(--el-font-weight-primary);
  }
}
</style>
