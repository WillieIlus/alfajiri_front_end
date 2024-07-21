<template>
  <div>
    <div v-if="editor" class="flex flex-wrap gap-2 mb-4">
      <UButton icon="i-heroicons-bold" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }" />
      <UButton icon="i-heroicons-italic" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }" />
      <UButton icon="i-heroicons-bars-3-bottom-left" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" />
      <UButton color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        H1
      </UButton>
      <UButton color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        H3
      </UButton>
      <UButton color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        H4
      </UButton>
      <UButton icon="i-heroicons-list-bullet" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }" />
      <UButton icon="i-heroicons-bars-3" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }" />
      <UButton icon="i-heroicons-chat-bubble-bottom-center-text" color="primary" :ui="{ rounded: 'rounded-full' }"
        variant="ghost" @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }" />
      <UButton icon="i-heroicons-minus" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().setHorizontalRule().run()" />
      <UButton icon="i-heroicons-arrow-down-on-square-stack" color="primary" :ui="{ rounded: 'rounded-full' }"
        variant="ghost" @click="editor.chain().focus().setHardBreak().run()" />
      <UButton icon="i-heroicons-arrow-uturn-left" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" />
      <UButton icon="i-heroicons-arrow-uturn-right" color="primary" :ui="{ rounded: 'rounded-full' }" variant="ghost"
        @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" />
    </div>
    <div class="relative">
        <TiptapEditorContent :editor="editor" class="
        relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus-within:outline-none border-0
        rounded-md
        placeholder-gray-400 dark:placeholder-gray-500
        shadow-sm
        bg-white dark:bg-gray-900 text-gray-900 dark:text-white
        ring-1 ring-inset ring-gray-300 dark:ring-gray-700
        focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400
        min-h-[100px]
      " />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { onBeforeUnmount, watch, unref } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import TiptapStarterKit from '@tiptap/starter-kit'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue || "",
  extensions: [TiptapStarterKit],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (newValue) => {
    const editorInstance = unref(editor)
    if (editorInstance && newValue !== editorInstance.getHTML()) {
      editorInstance.commands.setContent(newValue || '', false)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>
