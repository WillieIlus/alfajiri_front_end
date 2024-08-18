<template>
  <div class="bg-gray-100 dark:bg-gray-800 border-gray-500 dark:border-l-gray-900 border-2 p-2">
    <div v-if="editor" class="flex flex-wrap gap-2 mb-4">
      <UButton 
        icon="i-heroicons-bold" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleBold().run()" 
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }" 
      />
      <UButton 
        icon="i-heroicons-italic" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleItalic().run()" 
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }" 
      />
      <UButton 
        icon="i-heroicons-bars-3-bottom-left" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().setParagraph().run()" 
        :class="{ 'is-active': editor.isActive('paragraph') }" 
      />
      <UButton 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        H1
      </UButton>
      <UButton 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        H3
      </UButton>
      <UButton 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      >
        H4
      </UButton>
      <UButton 
        icon="i-heroicons-list-bullet" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }" 
      />
      <UButton 
        icon="i-heroicons-bars-3" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }" 
      />
      <UButton 
        icon="i-heroicons-chat-bubble-bottom-center-text" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }"
        variant="soft" 
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }" 
      />
      <UButton 
        icon="i-heroicons-minus" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().setHorizontalRule().run()" 
      />
      <UButton 
        icon="i-heroicons-arrow-down-on-square-stack" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }"
        variant="soft" 
        @click="editor.chain().focus().setHardBreak().run()" 
      />
      <UButton 
        icon="i-heroicons-arrow-uturn-left" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().undo().run()" 
        :disabled="!editor.can().chain().focus().undo().run()" 
      />
      <UButton 
        icon="i-heroicons-arrow-uturn-right" 
        color="primary" 
        :ui="{ rounded: 'rounded-full' }" 
        variant="soft"
        @click="editor.chain().focus().redo().run()" 
        :disabled="!editor.can().chain().focus().redo().run()" 
      />
    </div>
    <div class="relative">
      <EditorContent 
        :editor="editor" 
        class="disabled:cursor-not-allowed disabled:opacity-75 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, unref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue || "",
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Can you add some further context?',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
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

<style>
/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>