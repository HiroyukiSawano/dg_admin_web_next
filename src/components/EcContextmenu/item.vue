<template>
    <div class="ec-contextmenu-menu__item--divided" v-if="divided"></div>
    <div class="ec-contextmenu-menu-item" :class="disabled ? 'is-disabled' : ''" @click.stop="itemClick" @mouseenter="open($event)" @mouseleave="close($event)">
      <div class="ec-contextmenu-menu-item__prefix">
        <i class="ec-contextmenu-menu-item__icon" v-if="icon" :class="icon"></i>
      </div>
      <label class="ec-contextmenu-menu-item__label">{{ title }}</label>
      <span class="ec-contextmenu-menu-item__suffix">
        <i v-if="slots.default" class="ec-contextmenu-menu-item__arrow ri ri-arrow-right-s-line"></i>
        <template v-else>{{ suffix }}</template>
      </span>
      <div v-if="slots.default" class="ec-contextmenu-menu">
        <slot></slot>
      </div>
    </div>
</template>

<script setup>
import { inject, useSlots } from 'vue'

const slots = useSlots()
const props = defineProps({
  command: { type: String, default: '' },
  title: { type: String, default: '' },
  suffix: { type: String, default: '' },
  icon: { type: String, default: '' },
  divided: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const menuClick = inject('menuClick')

const itemClick = () => {
  if (slots.default || props.disabled) return
  menuClick(props.command)
}

const open = (e) => {
  const menu = e.target.querySelector('.ec-contextmenu-menu')
  if (!menu || props.disabled) return

  menu.style.display = 'block'
  const rect = menu.getBoundingClientRect()
  const { innerWidth: ww, innerHeight: wh } = window
  const { offsetHeight: mh, offsetWidth: mw } = menu

  if (rect.left + mw > ww) {
    menu.style.left = 'auto'
    menu.style.right = '100%'
  }
  if (rect.top + mh > wh) {
    menu.style.top = 'auto'
    menu.style.bottom = '0'
  }
}

const close = (e) => {
  const menu = e.target.querySelector('.ec-contextmenu-menu')
  if (!menu) return

  menu.removeAttribute('style')
  menu.style.display = 'none'
}
</script>

<style lang="scss" scoped>

</style>
