<script setup lang="ts">
import { computed } from 'vue'
import pptManifest from '@/config/ppt-manifest.json'
import { resume } from '@/data/resume'

const pptIcons = computed(() => pptManifest.icons)

function iconSrc(name: string | null | undefined): string {
  if (!name) return ''
  return `/ppt-assets/${name}`
}

function contactIconAt(index: number): string {
  const list = pptIcons.value.contact
  return iconSrc(list?.[index])
}

function skillIconAt(index: number): string {
  const list = pptIcons.value.skillSections
  return iconSrc(list?.[index])
}

const influenceIconSrc = computed(() => iconSrc(pptIcons.value.influence))
const headerWorkSrc = computed(() => iconSrc(pptIcons.value.headerWorkTeal))
const headerEarlySrc = computed(() => iconSrc(pptIcons.value.headerEarlyPurple))
const headerCertSrc = computed(() => iconSrc(pptIcons.value.headerCertPurple))

/** 无 PPT 图标资源时的占位（与 `public/ppt-assets` + `ppt-manifest` 对应顺序一致） */
const CONTACT_FALLBACK_ICONS = ['☎', '✉', '✹'] as const
const SKILL_HEADING_FALLBACK_ICONS = ['▣', '✣'] as const

function contactFallbackAt(index: number): string {
  return CONTACT_FALLBACK_ICONS[index] ?? '•'
}

function skillHeadingFallbackAt(index: number): string {
  return SKILL_HEADING_FALLBACK_ICONS[index] ?? '◆'
}

const printResume = () => window.print()
</script>

<template>
  <div class="resume-shell">
    <button class="print-button" type="button" @click="printResume">打印 / 导出 PDF</button>

    <section class="page page-cover">
      <div class="cover-corner" />
      <aside class="profile-panel">
        <div class="portrait-frame">
          <img :src="resume.portraitSrc" :alt="resume.portraitAlt" />
        </div>

        <h1>{{ resume.name }}</h1>
        <p class="headline">
          <span v-for="(line, hi) in resume.headlineLines" :key="'h' + hi">
            <br v-if="hi > 0" />
            {{ line }}
          </span>
        </p>
        <p class="summary">
          <span v-for="(line, si) in resume.summaryLines" :key="'s' + si">
            <br v-if="si > 0" />
            {{ line }}
          </span>
        </p>

        <ul class="contact-list">
          <li v-for="(item, ci) in resume.contactItems" :key="item.text">
            <span class="contact-icon">
              <img v-if="contactIconAt(ci)" class="contact-icon-img" :src="contactIconAt(ci)" alt="" />
              <span v-else class="contact-fallback">{{ contactFallbackAt(ci) }}</span>
            </span>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </aside>

      <main class="cover-main">
        <section v-for="(group, gi) in resume.skillGroups" :key="group.title" class="skill-block">
          <h2>
            <img
              v-if="skillIconAt(gi)"
              class="skill-heading-icon"
              :src="skillIconAt(gi)"
              alt=""
            />
            <span v-else class="skill-heading-fallback">{{ skillHeadingFallbackAt(gi) }}</span>
            {{ group.title }}
          </h2>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </section>
      </main>

      <section class="influence-block">
        <h2>
          <img v-if="influenceIconSrc" class="skill-heading-icon" :src="influenceIconSrc" alt="" />
          <span v-else class="skill-heading-fallback">⚑</span>
          影响力
        </h2>
        <ul>
          <li v-for="item in resume.influenceItems" :key="item">{{ item }}</li>
        </ul>
      </section>
      <span class="page-number">1</span>
    </section>

    <section class="page page-work">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>{{ resume.workSectionTitle }}</span>
      </header>
      <article v-for="item in resume.workExperiences.slice(0, 5)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">2</span>
    </section>

    <section class="page page-work">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>{{ resume.workSectionTitle }}</span>
      </header>
      <article v-for="item in resume.workExperiences.slice(5, 9)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">3</span>
    </section>

    <section class="page page-work compact">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>{{ resume.workSectionTitle }}</span>
      </header>
      <article v-for="item in resume.workExperiences.slice(9, 12)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">4</span>
    </section>

    <section class="page page-work compact">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>{{ resume.workSectionTitle }}</span>
      </header>
      <article v-for="item in resume.workExperiences.slice(12)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">5</span>
    </section>

    <section class="page page-work compact">
      <div class="decor decor-top" />
      <header class="page-header purple">
        <span class="header-icon">
          <img v-if="headerEarlySrc" class="header-icon-img" :src="headerEarlySrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>{{ resume.earlySectionTitle }}</span>
      </header>
      <article v-for="item in resume.earlyExperiences" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">6</span>
    </section>

    <section class="page page-certificates">
      <div class="decor decor-top" />
      <div class="decor decor-left" />
      <header class="page-header purple">
        <span class="header-icon">
          <img v-if="headerCertSrc" class="header-icon-img" :src="headerCertSrc" alt="" />
          <span v-else>♙</span>
        </span>
        <span>{{ resume.certificatesSectionTitle }}</span>
      </header>
      <div class="certificate-grid">
        <figure v-for="certificate in resume.certificateImages" :key="certificate.src" :class="certificate.className">
          <img :src="certificate.src" :alt="certificate.title" />
          <figcaption>{{ certificate.title }}</figcaption>
        </figure>
      </div>
      <span class="page-number">7</span>
    </section>
  </div>
</template>

<style scoped>
:global(:root) {
  --resume-teal: #073f4d;
  --resume-green: #6fa27b;
  --resume-purple: #685386;
  --resume-ink: #111111;
  --resume-muted: #e9eef0;
}

.resume-shell {
  min-height: 100vh;
  padding: 28px 16px 48px;
  background:
    radial-gradient(circle at 12% 8%, rgba(7, 63, 77, 0.08), transparent 28rem),
    #eef2f4;
}

.print-button {
  position: sticky;
  top: 16px;
  z-index: 10;
  display: block;
  margin: 0 auto 20px;
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  color: #fff;
  background: var(--resume-teal);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(7, 63, 77, 0.18);
}

.page {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 24px;
  overflow: hidden;
  color: var(--resume-ink);
  background: #fff;
  box-shadow: 0 16px 45px rgba(20, 32, 40, 0.16);
  break-after: page;
  page-break-after: always;
  font-family: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page::after {
  content: '';
  position: absolute;
  right: -58px;
  bottom: -58px;
  width: 170px;
  height: 170px;
  border-radius: 999px;
  background: var(--resume-muted);
  z-index: 0;
}

.page-cover {
  display: grid;
  grid-template-columns: 42% 58%;
  grid-template-rows: auto 1fr;
  padding: 15mm 16mm 12mm;
  column-gap: 14mm;
}

.cover-corner {
  position: absolute;
  top: 0;
  left: 0;
  width: 42mm;
  height: 45mm;
  background: var(--resume-teal);
}

.page-cover::before {
  content: '';
  position: absolute;
  top: -26mm;
  right: -24mm;
  width: 62mm;
  height: 62mm;
  border-radius: 999px;
  background: var(--resume-muted);
}

.profile-panel,
.cover-main,
.influence-block,
.page-header,
.experience-item,
.certificate-grid {
  position: relative;
  z-index: 1;
}

.portrait-frame {
  width: 54mm;
  height: 54mm;
  margin: -1mm auto 6mm;
  overflow: hidden;
  border: 1.6mm solid var(--resume-teal);
  border-radius: 999px;
  background: #fff;
}

.portrait-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 18%;
}

.profile-panel h1 {
  margin: 0 0 2mm;
  text-align: center;
  font-size: 25pt;
  font-weight: 900;
  line-height: 1.05;
}

.headline {
  margin: 0 0 5mm;
  color: var(--resume-teal);
  font-size: 13.4pt;
  font-weight: 900;
  line-height: 1.28;
}

.summary {
  margin: 0 0 5mm;
  font-size: 11.2pt;
  font-weight: 500;
  line-height: 1.28;
  text-align: justify;
}

.contact-list {
  display: grid;
  gap: 3mm;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11.3pt;
}

.contact-list li {
  display: grid;
  grid-template-columns: 8mm 1fr;
  align-items: center;
  gap: 4mm;
}

.contact-icon {
  display: grid;
  width: 8mm;
  height: 8mm;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  background: var(--resume-teal);
  font-size: 10pt;
  font-weight: 700;
  overflow: hidden;
}

.contact-icon-img {
  width: 68%;
  height: 68%;
  object-fit: contain;
}

.contact-fallback {
  font-size: 10pt;
  line-height: 1;
}

.skill-heading-icon {
  width: 1.15em;
  height: 1.15em;
  object-fit: contain;
  flex-shrink: 0;
}

.skill-heading-fallback {
  display: inline-block;
  min-width: 1em;
}

.page-header .header-icon img.header-icon-img {
  width: 1em;
  height: 1em;
  object-fit: contain;
  display: block;
}

.skill-block + .skill-block {
  margin-top: 8mm;
}

.skill-block h2,
.influence-block h2,
.page-header {
  display: inline-flex;
  align-items: center;
  gap: 4mm;
  min-width: 58mm;
  margin: 0 0 5mm;
  padding: 2.2mm 6mm;
  color: #fff;
  background: var(--resume-green);
  font-size: 13.5pt;
  font-weight: 700;
  line-height: 1;
}

.skill-block ul,
.influence-block ul,
.experience-item ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.skill-block li,
.influence-block li,
.experience-item li {
  position: relative;
  padding-left: 6mm;
  font-weight: 500;
}

.skill-block li::before,
.influence-block li::before,
.experience-item li::before {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--resume-green);
  font-weight: 900;
}

.skill-block li {
  margin-bottom: 1.8mm;
  font-size: 11.4pt;
  line-height: 1.25;
}

.skill-block li:first-child,
.skill-block li:nth-child(2),
.skill-block li:nth-child(3),
.skill-block li:nth-child(4),
.skill-block li:nth-child(5),
.skill-block li:nth-child(6) {
  font-weight: 700;
}

.influence-block {
  grid-column: 1 / -1;
  align-self: end;
  margin-top: 6mm;
}

.influence-block h2 {
  min-width: 60mm;
}

.influence-block li {
  margin-bottom: 1.5mm;
  font-size: 9.8pt;
  line-height: 1.26;
}

.page-work,
.page-certificates {
  padding: 15mm 16mm 14mm;
}

.decor {
  position: absolute;
  border-radius: 999px;
  background: var(--resume-muted);
  z-index: 0;
}

.decor-top {
  top: -30mm;
  right: -23mm;
  width: 62mm;
  height: 62mm;
}

.decor-left {
  left: -34mm;
  bottom: 20mm;
  width: 52mm;
  height: 52mm;
}

.page-header {
  min-width: 118mm;
  margin-bottom: 7mm;
  padding: 3.1mm 6mm;
  font-size: 14pt;
}

.page-header.teal {
  background: var(--resume-teal);
}

.page-header.purple {
  background: var(--resume-purple);
}

.header-icon {
  font-size: 14pt;
}

.experience-item {
  margin-bottom: 6mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.compact .experience-item {
  margin-bottom: 5.4mm;
}

.experience-item h3 {
  margin: 0 0 1mm;
  font-size: 13.1pt;
  font-weight: 900;
  line-height: 1.25;
}

.experience-item .meta,
.experience-item .result {
  margin: 0;
  font-size: 11.6pt;
  font-weight: 500;
  line-height: 1.38;
}

.experience-item .result {
  text-align: justify;
}

.experience-item ul {
  margin-top: 1.6mm;
}

.experience-item li {
  margin-bottom: 1.05mm;
  font-size: 10.8pt;
  line-height: 1.36;
}

.compact .experience-item li,
.compact .experience-item .meta,
.compact .experience-item .result {
  font-size: 10.7pt;
  line-height: 1.32;
}

.certificate-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4.5mm 6mm;
  align-items: start;
}

.certificate-grid figure {
  margin: 0;
  text-align: center;
  break-inside: avoid;
}

.certificate-grid img {
  width: 100%;
  max-height: 62mm;
  object-fit: contain;
}

.certificate-grid figcaption {
  margin-top: 2mm;
  font-size: 11pt;
  font-weight: 500;
  line-height: 1.25;
}

.certificate-grid figure:nth-child(3),
.certificate-grid figure:nth-child(4),
.certificate-grid figure:nth-child(5) {
  grid-column: auto;
}

.certificate-grid figure:nth-child(n + 3):not(.wide) img {
  max-height: 68mm;
}

.certificate-grid .wide {
  grid-column: span 1;
}

.certificate-grid .cover img {
  max-height: 58mm;
}

.certificate-grid figure:nth-child(3) {
  grid-column: 1 / 2;
}

.certificate-grid figure:nth-child(4) {
  grid-column: 2 / 3;
}

.certificate-grid figure:nth-child(5) {
  grid-column: 3 / 4;
}

.certificate-grid figure:nth-child(6) {
  grid-column: 1 / 3;
}

.certificate-grid figure:nth-child(6) img {
  max-height: 46mm;
}

.page-number {
  position: absolute;
  right: 7mm;
  bottom: 5mm;
  z-index: 2;
  font-size: 11pt;
  color: #111;
}

@media (max-width: 900px) {
  .page {
    width: min(100%, 210mm);
    min-height: auto;
  }

  .page-cover {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    row-gap: 10mm;
  }

  .influence-block {
    grid-column: auto;
  }
}

@page {
  size: A4;
  margin: 0;
}

@media print {
  :global(html),
  :global(body),
  :global(#app) {
    width: 210mm;
    margin: 0;
    background: #fff !important;
  }

  .resume-shell {
    padding: 0;
    background: #fff;
  }

  :global(.app-root) {
    min-height: auto;
    padding: 0 !important;
  }

  .print-button {
    display: none;
  }

  .page {
    width: 210mm;
    height: 296mm;
    min-height: 296mm;
    margin: 0;
    box-shadow: none;
    overflow: hidden;
    page-break-after: auto;
    break-after: auto;
  }

  .page-cover {
    display: grid;
    grid-template-columns: 42% 58%;
    grid-template-rows: auto 1fr;
    row-gap: 0;
  }

  .influence-block {
    grid-column: 1 / -1;
  }

  .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .page-certificates {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>
