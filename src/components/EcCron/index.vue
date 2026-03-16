<template>
  <el-input v-model="defaultValue" v-bind="$attrs">
    <template #append>
      <el-dropdown placement="top" @command="handleShortcuts">
        <el-button icon="ri-arrow-down-s-line"></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="0 * * * * ?">每分钟</el-dropdown-item>
            <el-dropdown-item command="0 0 * * * ?">每小时</el-dropdown-item>
            <el-dropdown-item command="0 0 0 * * ?">每天零点</el-dropdown-item>
            <el-dropdown-item command="0 0 0 1 * ?">每月一号零点</el-dropdown-item>
            <el-dropdown-item command="0 0 0 L * ?">每月最后一天零点</el-dropdown-item>
            <el-dropdown-item command="0 0 0 ? * 1">每周星期日零点</el-dropdown-item>
            <el-dropdown-item v-for="(item, index) in shortcuts" :key="item.value" :divided="index == 0"
              :command="item.value">{{ item.text }}</el-dropdown-item>
            <el-dropdown-item icon="ri-add-line" divided command="custom">自定义</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-input>

  <el-dialog v-model="visible" title="规则生成器" :width="640" destroy-on-close append-to-body>
    <el-tabs>
      <el-tab-pane>
        <template #label>
          <label>秒</label>
          <span>{{ value_second }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.second.type">
              <el-radio-button label="任意值" :value="0" />
              <el-radio-button label="范围" :value="1" />
              <el-radio-button label="间隔" :value="2" />
              <el-radio-button label="指定" :value="3" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.second.type === 1" label="范围">
            <el-input-number v-model="values.second.range.start" :min="0" :max="59" controls-position="right" />
            <span>至</span>
            <el-input-number v-model="values.second.range.end" :min="0" :max="59" controls-position="right" />
          </el-form-item>
          <el-form-item v-if="values.second.type === 2" label="间隔">
            <el-input-number v-model="values.second.loop.start" :min="0" :max="59" controls-position="right" />
            秒开始，每
            <el-input-number v-model="values.second.loop.end" :min="0" :max="59" controls-position="right" />
            秒执行一次
          </el-form-item>
          <el-form-item v-if="values.second.type === 3" label="指定">
            <el-select v-model="values.second.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.second" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <label>分钟</label>
          <span>{{ value_minute }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.minute.type">
              <el-radio-button :value="0" label="任意值" />
              <el-radio-button :value="1" label="范围" />
              <el-radio-button :value="2" label="间隔" />
              <el-radio-button :value="3" label="指定" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.minute.type === 1" label="范围">
            <el-input-number v-model="values.minute.range.start" :min="0" :max="59" controls-position="right" />
            <span>至</span>
            <el-input-number v-model="values.minute.range.end" :min="0" :max="59" controls-position="right" />
          </el-form-item>
          <el-form-item v-if="values.minute.type === 2" label="间隔">
            <el-input-number v-model="values.minute.loop.start" :min="0" :max="59" controls-position="right" />
            分钟开始，每
            <el-input-number v-model="values.minute.loop.end" :min="0" :max="59" controls-position="right" />
            分钟执行一次
          </el-form-item>
          <el-form-item v-if="values.minute.type === 3" label="指定">
            <el-select v-model="values.minute.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.minute" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <label>小时</label>
          <span>{{ value_hour }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.hour.type">
              <el-radio-button :value="0" label="任意值" />
              <el-radio-button :value="1" label="范围" />
              <el-radio-button :value="2" label="间隔" />
              <el-radio-button :value="3" label="指定" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.hour.type === 1" label="范围">
            <el-input-number v-model="values.hour.range.start" :min="0" :max="23" controls-position="right" />
            <span>至</span>
            <el-input-number v-model="values.hour.range.end" :min="0" :max="23" controls-position="right" />
          </el-form-item>
          <el-form-item v-if="values.hour.type === 2" label="间隔">
            <el-input-number v-model="values.hour.loop.start" :min="0" :max="23" controls-position="right" />
            小时开始，每
            <el-input-number v-model="values.hour.loop.end" :min="0" :max="23" controls-position="right" />
            小时执行一次
          </el-form-item>
          <el-form-item v-if="values.hour.type === 3" label="指定">
            <el-select v-model="values.hour.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.hour" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <label>日</label>
          <span>{{ value_day }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.day.type">
              <el-radio-button :value="0" label="任意值" />
              <el-radio-button :value="1" label="范围" />
              <el-radio-button :value="2" label="间隔" />
              <el-radio-button :value="3" label="指定" />
              <el-radio-button :value="4" label="本月最后一天" />
              <el-radio-button :value="5" label="不指定" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.day.type === 1" label="范围">
            <el-input-number v-model="values.day.range.start" :min="1" :max="31" controls-position="right" />
            <span>至</span>
            <el-input-number v-model="values.day.range.end" :min="1" :max="31" controls-position="right" />
          </el-form-item>
          <el-form-item v-if="values.day.type === 2" label="间隔">
            <el-input-number v-model="values.day.loop.start" :min="1" :max="31" controls-position="right" />
            号开始，每
            <el-input-number v-model="values.day.loop.end" :min="1" :max="31" controls-position="right" />
            天执行一次
          </el-form-item>
          <el-form-item v-if="values.day.type === 3" label="指定">
            <el-select v-model="values.day.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.day" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <label>月</label>
          <span>{{ value_month }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.month.type">
              <el-radio-button :value="0" label="任意值" />
              <el-radio-button :value="1" label="范围" />
              <el-radio-button :value="2" label="间隔" />
              <el-radio-button :value="3" label="指定" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.month.type === 1" label="范围">
            <el-input-number v-model="values.month.range.start" :min="1" :max="12" controls-position="right" />
            <span>至</span>
            <el-input-number v-model="values.month.range.end" :min="1" :max="12" controls-position="right" />
          </el-form-item>
          <el-form-item v-if="values.month.type === 2" label="间隔">
            <el-input-number v-model="values.month.loop.start" :min="1" :max="12" controls-position="right" />
            月开始，每
            <el-input-number v-model="values.month.loop.end" :min="1" :max="12" controls-position="right" />
            月执行一次
          </el-form-item>
          <el-form-item v-if="values.month.type === 3" label="指定">
            <el-select v-model="values.month.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.month" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <label>周</label>
          <span>{{ value_week }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.week.type">
              <el-radio-button :value="0" label="任意值" />
              <el-radio-button :value="1" label="范围" />
              <el-radio-button :value="2" label="间隔" />
              <el-radio-button :value="3" label="指定" />
              <el-radio-button :value="4" label="本月最后一周" />
              <el-radio-button :value="5" label="不指定" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.week.type === 1" label="范围">
            <el-select v-model="values.week.range.start">
              <el-option v-for="(item, index) in datas.week" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <span>至</span>
            <el-select v-model="values.week.range.end">
              <el-option v-for="(item, index) in datas.week" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="values.week.type === 2" label="间隔">
            第
            <el-input-number v-model="values.week.loop.start" :min="1" :max="4" controls-position="right" />
            周的星期
            <el-select v-model="values.week.loop.end">
              <el-option v-for="(item, index) in datas.week" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            执行一次
          </el-form-item>
          <el-form-item v-if="values.week.type === 3" label="指定">
            <el-select v-model="values.week.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.week" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="values.week.type === 4" label="最后一周">
            <el-select v-model="values.week.last">
              <el-option v-for="(item, index) in datas.week" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <label>年</label>
          <span>{{ value_year }}</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="类型">
            <el-radio-group v-model="values.year.type">
              <el-radio-button :value="-1" label="忽略" />
              <el-radio-button :value="0" label="任意值" />
              <el-radio-button :value="1" label="范围" />
              <el-radio-button :value="2" label="间隔" />
              <el-radio-button :value="3" label="指定" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="values.year.type === 1" label="范围">
            <el-input-number v-model="values.year.range.start" controls-position="right" />
            <span>至</span>
            <el-input-number v-model="values.year.range.end" controls-position="right" />
          </el-form-item>
          <el-form-item v-if="values.year.type === 2" label="间隔">
            <el-input-number v-model="values.year.loop.start" controls-position="right" />
            年开始，每
            <el-input-number v-model="values.year.loop.end" :min="1" controls-position="right" />
            年执行一次
          </el-form-item>
          <el-form-item v-if="values.year.type === 3" label="指定">
            <el-select v-model="values.year.appoint" multiple placeholder="请选择指定数值" style="width: 100%">
              <el-option v-for="(item, index) in datas.year" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 认</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
defineOptions({
  name: 'EcChat',
})
const props = defineProps({
  modelValue: { type: String, default: '* * * * * ?' },
  shortcuts: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])
const getYear = () => {
  let v = []
  let y = new Date().getFullYear()
  for (let i = 0; i < 11; i++) {
    v.push(y + i)
  }
  return v
}
const defaultValue = ref('')
const visible = ref(false)
const values = ref({
  second: {
    type: 0,
    range: {
      start: 1,
      end: 2,
    },
    loop: {
      start: 0,
      end: 1,
    },
    appoint: [],
  },
  minute: {
    type: 0,
    range: {
      start: 1,
      end: 2,
    },
    loop: {
      start: 0,
      end: 1,
    },
    appoint: [],
  },
  hour: {
    type: 0,
    range: {
      start: 1,
      end: 2,
    },
    loop: {
      start: 0,
      end: 1,
    },
    appoint: [],
  },
  day: {
    type: 0,
    range: {
      start: 1,
      end: 2,
    },
    loop: {
      start: 1,
      end: 1,
    },
    appoint: [],
  },
  month: {
    type: 0,
    range: {
      start: 1,
      end: 2,
    },
    loop: {
      start: 1,
      end: 1,
    },
    appoint: [],
  },
  week: {
    type: 5,
    range: {
      start: 2,
      end: 3,
    },
    loop: {
      start: 0,
      end: 2,
    },
    last: 2,
    appoint: [],
  },
  year: {
    type: -1,
    range: {
      start: getYear()[0],
      end: getYear()[1],
    },
    loop: {
      start: getYear()[0],
      end: 1,
    },
    appoint: [],
  },
})
const datas = ref({
  second: [0, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
  minute: [0, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
  hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  day: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  week: [
    {
      value: 1,
      label: '周日',
    },
    {
      value: 2,
      label: '周一',
    },
    {
      value: 3,
      label: '周二',
    },
    {
      value: 4,
      label: '周三',
    },
    {
      value: 5,
      label: '周四',
    },
    {
      value: 6,
      label: '周五',
    },
    {
      value: 7,
      label: '周六',
    },
  ],
  year: getYear(),
})
watch(() => values.value.week.type, (val) => {
  if (val !== 5) {
    values.value.day.type = 5
  }
})

watch(() => values.value.day.type, (val) => {
  if (val !== 5) {
    values.value.week.type = 5
  }
})

watch(() => props.modelValue, (newVal) => {
  defaultValue.value = newVal
})
const value_second = computed(() => {
  let v = values.value.second
  if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})

const value_minute = computed(() => {
  let v = values.value.minute
  if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_hour = computed(() => {
  let v = values.value.hour
  if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_day = computed(() => {
  let v = values.value.day
  if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else if (v.type === 4) {
    return 'L'
  } else if (v.type === 5) {
    return '?'
  } else {
    return '*'
  }
})
const value_week = computed(() => {
  let v = values.value.week
  if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.end + '#' + v.loop.start
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else if (v.type === 4) {
    return v.last + 'L'
  } else if (v.type === 5) {
    return '?'
  } else {
    return '*'
  }
})
const value_month = computed(() => {
  let v = values.value.month
  if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_year = computed(() => {
  let v = values.value.year
  if (v.type === -1) {
    return ''
  } else if (v.type === 0) {
    return '*'
  } else if (v.type === 1) {
    return v.range.start + '-' + v.range.end
  } else if (v.type === 2) {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type === 3) {
    return v.appoint.length > 0 ? v.appoint.join(',') : ''
  } else {
    return ''
  }
})
const handleShortcuts = (command) => {
  if (command === 'custom') {
    open()
  } else {
    defaultValue.value = command
    emit('update:modelValue', defaultValue.value)
  }
}
const open = () => {
  set()
  visible.value = true
}

const set = () => {
  defaultValue.value = props.modelValue
  let arr = (props.modelValue || '* * * * * ?').split(' ')
  //简单检查
  if (arr.length < 6) {
    ElMessage.warning('表达式错误，已转换为默认表达式')
    arr = '* * * * * ?'.split(' ')
  }

  //秒
  if (arr[0] === '*') {
    values.value.second.type = 0
  } else if (arr[0].includes('-')) {
    values.value.second.type = 1
    values.value.second.range.start = Number(arr[0].split('-')[0])
    values.value.second.range.end = Number(arr[0].split('-')[1])
  } else if (arr[0].includes('/')) {
    values.value.second.type = 2
    values.value.second.loop.start = Number(arr[0].split('/')[0])
    values.value.second.loop.end = Number(arr[0].split('/')[1])
  } else {
    values.value.second.type = 3
    values.value.second.appoint = arr[0].split(',')
  }
  if (arr[1] === '*') {
    values.value.minute.type = 0
  } else if (arr[1].includes('-')) {
    values.value.minute.type = 1
    values.value.minute.range.start = Number(arr[1].split('-')[0])
    values.value.minute.range.end = Number(arr[1].split('-')[1])
  } else if (arr[1].includes('/')) {
    values.value.minute.type = 2
    values.value.minute.loop.start = Number(arr[1].split('/')[0])
    values.value.minute.loop.end = Number(arr[1].split('/')[1])
  } else {
    values.value.minute.type = 3
    values.value.minute.appoint = arr[1].split(',')
  }
  //小时
  if (arr[2] === '*') {
    values.value.hour.type = 0
  } else if (arr[2].includes('-')) {
    values.value.hour.type = 1
    values.value.hour.range.start = Number(arr[2].split('-')[0])
    values.value.hour.range.end = Number(arr[2].split('-')[1])
  } else if (arr[2].includes('/')) {
    values.value.hour.type = 2
    values.value.hour.loop.start = Number(arr[2].split('/')[0])
    values.value.hour.loop.end = Number(arr[2].split('/')[1])
  } else {
    values.value.hour.type = 3
    values.value.hour.appoint = arr[2].split(',')
  }
  //日
  if (arr[3] === '*') {
    values.value.day.type = 0
  } else if (arr[3] === 'L') {
    values.value.day.type = 4
  } else if (arr[3] === '?') {
    values.value.day.type = 5
  } else if (arr[3].includes('-')) {
    values.value.day.type = 1
    values.value.day.range.start = Number(arr[3].split('-')[0])
    values.value.day.range.end = Number(arr[3].split('-')[1])
  } else if (arr[3].includes('/')) {
    values.value.day.type = 2
    values.value.day.loop.start = Number(arr[3].split('/')[0])
    values.value.day.loop.end = Number(arr[3].split('/')[1])
  } else {
    values.value.day.type = 3
    values.value.day.appoint = arr[3].split(',')
  }
  //月
  if (arr[4] === '*') {
    values.value.month.type = 0
  } else if (arr[4].includes('-')) {
    values.value.month.type = 1
    values.value.month.range.start = Number(arr[4].split('-')[0])
    values.value.month.range.end = Number(arr[4].split('-')[1])
  } else if (arr[4].includes('/')) {
    values.value.month.type = 2
    values.value.month.loop.start = Number(arr[4].split('/')[0])
    values.value.month.loop.end = Number(arr[4].split('/')[1])
  } else {
    values.value.month.type = 3
    values.value.month.appoint = arr[4].split(',')
  }
  //周
  if (arr[5] === '*') {
    values.value.week.type = 0
  } else if (arr[5] === '?') {
    values.value.week.type = 5
  } else if (arr[5].includes('-')) {
    values.value.week.type = 1
    values.value.week.range.start = arr[5].split('-')[0]
    values.value.week.range.end = arr[5].split('-')[1]
  } else if (arr[5].includes('#')) {
    values.value.week.type = 2
    values.value.week.loop.start = Number(arr[5].split('#')[1])
    values.value.week.loop.end = arr[5].split('#')[0]
  } else if (arr[5].includes('L')) {
    values.value.week.type = 4
    values.value.week.last = arr[5].split('L')[0]
  } else {
    values.value.week.type = 3
    values.value.week.appoint = arr[5].split(',')
  }
  //年
  if (!arr[6]) {
    values.value.year.type = -1
  } else if (arr[6] === '*') {
    values.value.year.type = 0
  } else if (arr[6].includes('-')) {
    values.value.year.type = 1
    values.value.year.range.start = Number(arr[6].split('-')[0])
    values.value.year.range.end = Number(arr[6].split('-')[1])
  } else if (arr[6].includes('/')) {
    values.value.year.type = 2
    values.value.year.loop.start = Number(arr[6].split('/')[1])
    values.value.year.loop.end = Number(arr[6].split('/')[0])
  } else {
    values.value.year.type = 3
    values.value.year.appoint = arr[6].split(',')
  }
}

const submit = () => {
  let year = value_year.value ? ' ' + value_year.value : ''
  defaultValue.value = value_second.value + ' ' + value_minute.value + ' ' + value_hour.value + ' ' + value_day.value + ' ' + value_month.value + ' ' + value_week.value + year
  emit('update:modelValue', defaultValue.value)
  visible.value = false
}
onMounted(() => {
  defaultValue.value = props.modelValue
})
</script>

<style lang="scss" scoped>
.el-tabs {
  --el-tabs-header-height: auto;
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }
  :deep(.el-tabs__item) {
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    padding-bottom: 16px;
    line-height: 1;
    label {
      margin-bottom: 8px;
    }
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      flex: 1;
      width: 100%;
      padding: 8px 16px;
      background-color: var(--el-color-primary-light-9);
      border-radius: var(--el-border-radius-base);
      font-size: var(--el-font-size-extra-small);
    }
    &.is-active {
      span {
        background-color: var(--el-color-primary);
        color: var(--el-color-white);
      }
    }
  }
}
:deep(.el-form) {
  .el-form-item {
    // margin-bottom: 16px;
    .el-form-item__label {
      // margin-bottom: 12px;
      // line-height: 1;
    }
    .el-form-item__content {
      flex-wrap: nowrap;
      white-space: nowrap;
    }
  }
  .el-select {
    // width: 100%;
  }
}
</style>
