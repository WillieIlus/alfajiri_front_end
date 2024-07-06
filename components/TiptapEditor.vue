<template>
  <div>
    <div v-if="editor" class="flex flex-wrap gap-2 mb-4">
      <UButton icon="i-heroicons-bold" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }" />
      <UButton icon="i-heroicons-italic" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }" />
      <UButton icon="i-heroicons-bars-3-bottom-left" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }" />
      <UButton color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        H1
      </UButton>
      <UButton color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        H3
      </UButton>
      <UButton color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        H4
      </UButton>
      <UButton icon="i-heroicons-list-bullet" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }" />
      <UButton icon="i-heroicons-bars-3" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }" />
      <UButton icon="i-heroicons-chat-bubble-bottom-center-text" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"/>
      <UButton icon="i-heroicons-minus" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().setHorizontalRule().run()"/>
      <UButton icon="i-heroicons-arrow-down-on-square-stack" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().setHardBreak().run()"/>
      <UButton icon="i-heroicons-arrow-uturn-left" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()" />
      <UButton icon="i-heroicons-arrow-uturn-right" color="primary" :ui="{ rounded: 'rounded-full' }" variant="soft"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()" />
    </div>
    <TiptapEditorContent
      :editor="editor"
      class="editor-content"
      data-placeholder="Enter Description"
    />

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
  content: "",
  extensions: [TiptapStarterKit],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getHTML()) {
      editor.commands.setContent(newValue, false)
    }
  }
)

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>

<style>
.editor-content {
  position: relative;
  width: 100%;
  outline: none;
  border: 1px solid #d1d5db; /* Light gray border */
  border-radius: 0.375rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  background-color: white;
  color: #111827;
  min-height: 100px; /* Adjust as needed */
  overflow-y: auto;
}

.editor-content p {
  margin: 0;
}

.editor-content:focus {
  border-color: #3b82f6; /* Blue border on focus */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* Blue glow effect */
}

.editor-content:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

/* Dark mode placeholder */
.dark .editor-content:empty:before {
  color: #6b7280;
}

/* Dark mode styles */
.dark .editor-content {
  background-color: #111827;
  color: white;
  border-color: #374151;
}

.dark .editor-content:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
}
</style>