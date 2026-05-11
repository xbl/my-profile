<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import resumeMarkdown from '../../../src-profile/谢保龙简历.md?raw'

marked.setOptions({ breaks: true })

const html = computed(() => {
  const raw = marked(resumeMarkdown, { async: false })
  return DOMPurify.sanitize(raw)
})
</script>

<template>
  <article class="resume" v-html="html" />
</template>

<style scoped>
.resume {
  max-width: 52rem;
  margin: 0 auto;
}

.resume :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.resume :deep(h2) {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--color-border);
}

.resume :deep(h3) {
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.resume :deep(h4) {
  font-size: 0.98rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.35rem;
}

.resume :deep(p),
.resume :deep(li) {
  font-size: 0.95rem;
  line-height: 1.65;
}

.resume :deep(ul) {
  margin: 0.5rem 0 0.75rem 0;
  padding-left: 1.25rem;
}

.resume :deep(li + li) {
  margin-top: 0.25rem;
}

.resume :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 1.25rem 0;
}

.resume :deep(strong) {
  font-weight: 600;
}

@media print {
  .resume :deep(h2) {
    break-after: avoid;
  }
}
</style>
