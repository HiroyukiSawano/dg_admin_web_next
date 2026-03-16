<template>
  <div>
    <el-row :gutter="16">
      <el-col :lg="12">
        <el-card header="拖拽标签">
          <VueDraggable v-model="listA" animation="150" ghostClass="ghost" group="national" target=".el-row" @update="onUpdate" @add="onAdd" @remove="onRemove">
            <el-row :gutter="16" class="el-button-group">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in listA" :key="item.id">
                <el-button>{{ item.text }}</el-button>
              </el-col>
            </el-row>
          </VueDraggable>
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card shadow="never" header="拖拽标签">
          <VueDraggable v-model="listB" animation="150" ghostClass="ghost" group="national" target=".el-row" @update="onUpdate" @add="onAdd" @remove="onRemove">
            <el-row :gutter="16" class="el-button-group">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in listB" :key="item.id">
                <el-button>{{ item.text }}</el-button>
              </el-col>
            </el-row>
          </VueDraggable>
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>
<script setup>
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
defineOptions({
  name: 'vabDraggable',
})
const listA = ref([
  { id: 'jgqdzomq-oi39-jmw0-wtgx-aulmln1651bi', text: '槭树' },
  { id: 'yvzncges-4mbc-j3az-2gx7-cb5plyr7g0jl', text: '五福花' },
  { id: 'nalt7izu-opy1-i68z-ows4-2fykf22cnz67', text: '番杏' },
  { id: 'umkmnah6-5hx8-4yvc-dd4h-n4z0apkp565n', text: '八角枫' },
  { id: 'tnslbrey-11fx-ovnw-0okv-emiq7o9338pj', text: '泽泻' },
  { id: 'uztgpf0r-fq34-mdh2-u488-kq9hv5n2upel', text: '苋' },
  { id: '94xdo1xm-emx4-6xbb-rwmd-2mfh1qhq192a', text: '石蒜' },
  { id: 'l49hsf9u-wmyu-0szg-q631-98m5jg84bmk5', text: '漆树' },
  { id: 'er6c7rjg-td85-6vyb-1jcz-uvk1re8yvpyb', text: '钩枝藤' },
  { id: 'x2mx9laf-9bxw-02k4-1a1p-o3trsflqeilx', text: '番荔枝' },
  { id: 's0a8ancn-cjbb-oa9f-0zly-x2ijocml4ozx', text: '夹竹桃' },
  { id: '9bzo6y08-y8ru-3ehp-jn7t-usb0gh13kygn', text: '水蕹' },
  { id: 'ydz0ddq6-oofo-p2vr-6wgx-x7e2bfpyu1bo', text: '假兰' },
  { id: 'sfx0oswy-medz-3d03-py9w-jvgd7v3b8nt4', text: '冬青' },
  { id: 'gludy8x3-jn4c-dw0p-cfvg-05g4wlefvmny', text: '天南星' },
  { id: '562wr533-kpmr-gge4-302d-kze42cnitnc4', text: '五加' },
  { id: 'wkfe9dr1-an0x-urnp-fk6s-464blo4962x6', text: '马兜铃' },
  { id: 'vxtgytc7-ha7a-el8f-950d-o3z77wjyqcpn', text: '地幔' },
  { id: 'is5ttiff-4xep-2bgt-bjjh-bvmm3gxrqc67', text: '爬山虎' },
])
const listB = ref([
  { id: '6eg3dd7e-6rob-kbtc-gxy2-1zxyv9vy70re', text: '花岗岩' },
  { id: 'p2dnnspq-e0yg-39qc-rqcy-di699c3m48pr', text: '碎屑岩' },
  { id: 'ynol50mt-0fui-ek2c-gwy4-80cyzpn04f2p', text: '可溶岩' },
  { id: '16a1u4y7-lpuk-i488-q8sc-h7nmrxt7m7aj', text: '黄土地' },
  { id: 'fkvs18nm-r8ta-q1sx-46b5-00e5aouhy1x8', text: '砂积' },
  { id: 't3i28am2-0jsf-0fs5-62q6-poxx7cw0muw5', text: '冰川刨蚀' },
  { id: 'rkxwgc0m-dwkr-e8cr-8uwi-fjhb22x1kzsg', text: '冰川堆积' },
  { id: 'iiugqp67-0wy3-p8ni-5kxl-79s318nrw3y4', text: '冰缘' },
  { id: 'jo8hdk3w-odq7-9oa8-qtel-yy0is03pqbdv', text: '海蚀' },
  { id: 'akxr10k4-3f68-09gk-trv1-nmrqjcguwkpx', text: '海积' },
  { id: '625i132k-2r0s-cylz-zl1b-q3hox656ucug', text: '珊瑚礁' },
  { id: 'meowdlxi-mtxz-xt1t-lw94-gmgu4cjeb5c8', text: '湖泊' },
  { id: 'x1x37rx5-rljc-yuwh-7ef2-l2e550ig80am', text: '高原' },
  { id: '0iskyixe-6e14-gs9j-2m9t-jjvjhqikma3o', text: '山地' },
  { id: 'lw909cte-s28z-dm9j-9sl0-iop9w4982v9c', text: '平原' },
  { id: '9x4s6ou2-731f-oxuk-zzst-hd0ba2f5rblw', text: '晶体' },
  { id: 'qclb027g-d1rc-f6wg-cjlp-nq3ymetnknma', text: '矿物' },
  { id: 't5uuqhax-gcq2-p1dm-4zln-oicre9uy0fxs', text: '磁地层' },
  { id: 'w4dnxwkb-pv8y-08q2-15sj-vh93izfjfk8s', text: '粘土' },
  { id: '6ssodx73-36f3-dkue-jbcv-dy7h3xxe7d2p', text: '冲积土' },
])
const onUpdate = () => {
  console.log('update')
}
const onAdd = () => {
  console.log('add')
}
const onRemove = () => {
  console.log('remove')
}
</script>

<style lang="scss" scoped>
.el-button-group {
  margin-top: -8px;
  margin-bottom: -8px;
  .el-button {
    --el-button-bg-color: var(--el-color-primary-light-9);
    --el-button-border-color: transparent;
    margin-top: 8px;
    margin-bottom: 8px;
    height: 64px;
    width: 100%;
    padding: 8px;
    white-space: wrap;
  }
  .ghost {
    .el-button {
      background: var(--el-color-primary);
      color: var(--el-color-white);
    }
  }
}

</style>
