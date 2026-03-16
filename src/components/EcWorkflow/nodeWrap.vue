<template>
	<promoter v-if="modelValue.type==0" v-model="modelValue"></promoter>

	<approver v-if="modelValue.type==1" v-model="modelValue"></approver>

	<send v-if="modelValue.type==2" v-model="modelValue"></send>

	<branch v-if="modelValue.type==4" v-model="modelValue">
		<template v-slot="slot">
			<node-wrap v-if="slot.node" v-model="slot.node.childNode"></node-wrap>
		</template>
	</branch>

	<node-wrap v-if="modelValue.childNode" v-model="modelValue.childNode"></node-wrap>

</template>

<script setup>
import approver from './nodes/approver.vue'
import promoter from './nodes/promoter.vue'
import branch from './nodes/branch.vue'
import send from './nodes/send.vue'

const modelValue = defineModel({
  type: Object,
  default: () => {}
})
</script>
