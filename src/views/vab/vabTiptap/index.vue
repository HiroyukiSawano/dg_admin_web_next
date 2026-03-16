<template>
  <div class="el-card" v-if="editor">
    <div class="el-card__header">
      <div class="tt-edit__toolbar">
        <el-tooltip content="Undo" :offset="6" :show-arrow="false">
          <el-button circle size="small" :disabled="!editor?.can().chain().focus().undo().run()" icon="ri-arrow-left-line" @click="editor?.chain().focus().undo().run()" />
        </el-tooltip>
        <el-tooltip content="Redo" :offset="6" :show-arrow="false">
          <el-button circle size="small" :disabled="!editor?.can().chain().focus().redo().run()" icon="ri-arrow-right-line" @click="editor?.chain().focus().redo().run()" />
        </el-tooltip>
        <el-tooltip content="Clear Format" :offset="6" :show-arrow="false">
          <el-button circle size="small" icon="ri-eraser-fill" @click="editor?.chain().focus().unsetAllMarks().run()" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip content="Bold" :offset="6" :show-arrow="false">
          <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor?.isActive('bold') }" icon="ri-bold" @click="editor?.chain().focus().toggleBold().run()" />
        </el-tooltip>
        <el-tooltip content="Italic" :offset="6" :show-arrow="false">
          <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor?.isActive('italic') }" icon="ri-italic" @click="editor?.chain().focus().toggleItalic().run()" />
        </el-tooltip>
        <el-tooltip content="Strike" :offset="6" :show-arrow="false">
          <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor?.isActive('strike') }" icon="ri-strikethrough-2" @click="editor?.chain().focus().toggleStrike().run()" />
        </el-tooltip>
        <el-tooltip content="Code" :offset="6" :show-arrow="false">
          <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor?.isActive('code') }" icon="ri-code-line" @click="editor?.chain().focus().toggleCode().run()" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-dropdown size="small" :show-arrow="false">
          <el-button circle size="small" icon="ri-font-size" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editor?.chain().focus().setParagraph().run()" :class="{ 'is-active': editor?.isActive('paragraph') }">正文</el-dropdown-item>
              <el-dropdown-item @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }">H1</el-dropdown-item>
              <el-dropdown-item @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }">H2</el-dropdown-item>
              <el-dropdown-item @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }">H3</el-dropdown-item>
              <el-dropdown-item @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 4 }) }">H4</el-dropdown-item>
              <el-dropdown-item @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 5 }) }">H5</el-dropdown-item>
              <el-dropdown-item @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 6 }) }">H6</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-divider direction="vertical" />
        <el-tooltip content="Bullet List" :offset="6" :show-arrow="false">
          <el-button circle size="small" @click="editor?.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor?.isActive('bulletList') }" icon="ri-list-unordered" />
        </el-tooltip>
        <el-tooltip content="Ordered List" :offset="6" :show-arrow="false">
          <el-button circle size="small" @click="editor?.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor?.isActive('orderedList') }" icon="ri-list-ordered" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip content="Code Block" :offset="6" :show-arrow="false">
          <el-button circle size="small" @click="editor?.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor?.isActive('codeBlock') }" icon="ri-code-box-line">
          </el-button>
        </el-tooltip>
        <el-tooltip content="Blockquote" :offset="6" :show-arrow="false">
          <el-button circle size="small" :class="{ 'is-active': editor?.isActive('blockquote') }" icon="ri-double-quotes-r" @click="editor?.chain().focus().toggleBlockquote().run()" />
        </el-tooltip>
        <el-tooltip content="Horizontal Rule" :offset="6" :show-arrow="false">
          <el-button circle size="small" @click="editor?.chain().focus().setHorizontalRule().run()" icon="ri-separator" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip content="Code Block" :offset="6" :show-arrow="false">
          <el-button circle size="small" icon="ri-font-color">
            <template #default>
              <el-color-picker :model-value="editor?.getAttributes('textStyle')?.color || '#303133'" @change="(color) => editor?.chain().focus().setColor(color).run()" />
            </template>
          </el-button>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-popover placement="bottom" :width="224" :offset="6">
          <template #reference>
            <el-button circle size="small" icon="ri-table-line" />
          </template>
          <template #default>
            <div class="tt-edit__table-grid" @mouseleave="handleTableReset">
              <dl v-for="(row, rowIndex) in tableData" :key="rowIndex">
                <dd v-for="(cell, colIndex) in row" :key="colIndex" :class="{ selected: isTableCellSelected(rowIndex, colIndex) }" @mouseover="handleTableSelect(rowIndex, colIndex)" @click="handleTableInsert"></dd>
              </dl>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="el-card__body">
      <bubble-menu :editor="editor">
        <div class="tt-edit__bubble-menu">

          <template v-if="is('table')">
            <el-dropdown size="small" :show-arrow="false">
              <el-button circle size="small" icon="ri-timeline-view" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editor?.chain().focus().setCellAttribute('align', 'left').run()">左对齐</el-dropdown-item>
                  <el-dropdown-item @click="editor?.chain().focus().setCellAttribute('align', 'center').run()">居中对齐</el-dropdown-item>
                  <el-dropdown-item @click="editor?.chain().focus().setCellAttribute('align', 'right').run()">右对齐</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-divider direction="vertical" />
            <el-tooltip content="Add Row Before" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().addRowBefore().run()" icon="ri-insert-row-top" />
            </el-tooltip>
            <el-tooltip content="Add Row After" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().addRowAfter().run()" icon="ri-insert-row-bottom" />
            </el-tooltip>
            <el-tooltip content="Add Column Before" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().addColumnBefore().run()" icon="ri-insert-column-left" />
            </el-tooltip>
            <el-tooltip content="Add Column After" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().addColumnAfter().run()" icon="ri-insert-column-right" />
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-tooltip content="Delete Row" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().deleteRow().run()" icon="ri-delete-row" />
            </el-tooltip>
            <el-tooltip content="Delete Column" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().deleteColumn().run()" icon="ri-delete-column" />
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-tooltip content="Merge Cells" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().mergeCells().run()" icon="ri-merge-cells-horizontal" />
            </el-tooltip>
            <el-tooltip content="Split Cell" :offset="6" :show-arrow="false">
              <el-button circle size="small" @click="editor?.chain().focus().splitCell().run()" icon="ri-split-cells-horizontal" />
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-color-picker size="small" :model-value="editor?.getAttributes('background')?.color || '#303133'" @change="(background) => editor?.chain().focus().setCellAttribute('background', background).run()" />
          </template>
          <template v-else>
            <el-tooltip content="Bold" :offset="6" :show-arrow="false">
              <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor?.isActive('bold') }" icon="ri-bold" @click="editor?.chain().focus().toggleBold().run()" />
            </el-tooltip>
            <el-tooltip content="Italic" :offset="6" :show-arrow="false">
              <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor?.isActive('italic') }" icon="ri-italic" @click="editor?.chain().focus().toggleItalic().run()" />
            </el-tooltip>
            <el-tooltip content="Strike" :offset="6" :show-arrow="false">
              <el-button circle size="small" :disabled="!editor?.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor?.isActive('strike') }" icon="ri-strikethrough-2" @click="editor?.chain().focus().toggleStrike().run()" />
            </el-tooltip>
          </template>
        </div>
      </bubble-menu>
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { ListItem } from '@tiptap/extension-list'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { TableCell, TableKit, TableHeader } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
defineOptions({
  value: 'vabTiptap',
})
const TableCellOptions = {
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element) => element.getAttribute('align') || null,
        renderHTML: ({ align }) => ({ align }),
      },
      background: {
        default: null,
        parseHTML: (element) => {
          const style = element.getAttribute('style') || ''
          const match = style.match(/background(?:-color)?:\s*([^;]+)/i)
          return match ? match[1].trim() : null
        },
        renderHTML: ({ background }) => {
          return background ? { style: `background-color: ${background}` } : {}
        },
      },
      color: {
        default: null,
        parseHTML: (element) => {
          const style = element.getAttribute('style') || ''
          const match = style.match(/(?<!background-)color:\s*([^;]+)/i)
          if (style.includes('background-color')) return null
          return match ? match[1].trim() : null
        },
        renderHTML: ({ color }) => {
          return color ? { style: `color: ${color}` } : {}
        },
      },
    }
  },
}
const editor = useEditor({
  extensions: [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit,
    TableKit.configure({
      table: {
        resizable: true,
        allowTableNodeSelection: true,
      },
      tableCell: false,
      tableHeader: false,
    }),
    TableHeader.extend(TableCellOptions),
    TableCell.extend(TableCellOptions),

  ],
  content: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
})
const is = (type) => {
  if (!editor.value) return false

  if (type === 'table') {
    const { selection } = editor.value.state
    return selection instanceof CellSelection
  }
  return editor.value.isActive(type)
}


const tableData = Array.from({ length: 8 }, () => Array.from({ length: 10 }, () => ''))
const tableSelected = ref({ rows: 0, cols: 0 })

const isTableCellSelected = (rows, cols) => {
  return (tableSelected.value.rows && tableSelected.value.rows > rows && tableSelected.value.cols && tableSelected.value.cols > cols)
}
const handleTableSelect = (rows, cols) => {
  tableSelected.value.rows = rows + 1
  tableSelected.value.cols = cols + 1
}
const handleTableReset = () => {
  tableSelected.value.rows = 0
  tableSelected.value.cols = 0
}
const handleTableInsert = () => {
  const { rows, cols } = tableSelected.value
  if (rows === 0 || rows > 1000 || cols === 0 || cols > 30) return
  editor.value?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
}
</script>
<style lang="scss" scoped>
.tt-edit__toolbar {
  :deep(.el-button) {
    --el-button-border-color: transparent;
    --el-button-active-border-color: transparent;
    --el-button-hover-border-color: transparent;
    --el-button-disabled-border-color: transparent;
    position: relative;
    &.is-circle {
      border-radius: var(--el-border-radius-base);
    }
    .el-icon {
      transform: scale(1.3333);
    }

    .el-icon+span {
      margin-left: 0;
    }
    .el-color-picker {
      position: absolute;
      width: initial;
      inset: 0;

      .el-color-picker__color {
        border: 0;
        height: 3px;
        position: absolute;
        bottom: 13px;
        left: 5px;
        right: 5px;
        width: initial;
      }

      .el-color-picker__icon {
        display: none;
      }

      .el-color-picker__trigger {
        border: 0;
      }
    }
  }

  .el-button+.el-button {
    margin-left: 8px;
  }


}

.tt-edit__bubble-menu {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow);

  :deep() {
    .el-button {
      --el-button-border-color: transparent;
      --el-button-active-border-color: transparent;
      --el-button-hover-border-color: transparent;
      --el-button-disabled-border-color: transparent;
      position: relative;
      &.is-circle {
        border-radius: var(--el-border-radius-base);
      }
      .el-icon {
        transform: scale(1.3333);
      }

      .el-icon+span {
        margin-left: 0;
      }
    }

    .el-button+.el-button {
      margin-left: 8px;
    }
  }
}


.tt-edit__table-grid {
  dl,dt,dd {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  dl {
    display: flex;
    gap: 4px;
  }
  dd {
    width: 16px;
    height: 16px;
    // border: 1px solid var(--el-border-color);
    background-color: var(--el-fill-color-light);
    margin-bottom: 4px;
    cursor: pointer;
    &.selected {
      background-color: var(--el-color-primary-light-8);
    }
  }
}
</style>
<style lang="scss">

.tiptap.ProseMirror {
  &.ProseMirror-focused {
    outline: none;
  }
  p {
    margin: 0;
  }

  p:not(:first-child):not(td p):not(th p) {
    font-size: 1rem;
    // line-height: 1.6;
    // font-weight: 400;
    margin-top: 16px;
  }

  code {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
    border: 1px solid var(--el-border-color);
    font-size: .875em;
    // line-height: 1.4;
    border-radius: var(--el-border-radius-base);
    padding: .1em .2em;
  }

  blockquote {
    position: relative;
    padding: .375em 1em;
    margin: 1.5rem 0;

    &.is-empty::before,
    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      top: 0;
      height: 100%;
      width: .25em;
      background-color: var(--el-text-color-primary);
      content: "";
      border-radius: 0;
    }
  }

  pre {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
    border: 1px solid var(--el-border-color);
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    padding: 1em;
    font-size: 1rem;
    border-radius: var(--el-border-radius-base);

    code {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      border-radius: 0;
      -webkit-text-fill-color: inherit;
      color: inherit;
    }
  }
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1px solid var(--el-border-color);
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: var(--el-fill-color-light);
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: rgba(200, 200, 255, 0.25);
      content: '';
      inset: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: var(--el-color-primary);
      bottom: -1px;
      pointer-events: none;
      position: absolute;
      right: -1px;
      top: -1px;
      width: 3px;
    }
  }

  .tableWrapper {
    margin: 1.5rem 0;
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}
</style>
