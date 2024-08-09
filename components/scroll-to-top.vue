<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed bottom-4 right-4">
    <UButton  @click="scrollToTop"  icon="i-heroicons-arrow-small-up-20-solid" size="xl" color="primary" variant="solid"
    :ui="{ rounded: 'rounded-full' }" />
  </div>
</transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isVisible = ref(false);

const checkScroll = () => {
  // console.log('Scroll position:', window.scrollY);
  if (window.scrollY > 300) {
    isVisible.value = true;
  } else {
    isVisible.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  // Initial check in case the page is already scrolled
  checkScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Ensure the button is above other content */
.fixed {
  position: fixed;
  z-index: 1000;
}

/* Position classes */
.bottom-4 {
  bottom: 1rem;
}
.right-4 {
  right: 1rem;
}
</style>