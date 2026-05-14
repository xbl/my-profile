<script setup lang="ts">
import { computed } from "vue";
import { resume } from "@/data/resume";
import type { ResumeContactItem, ResumeExperience } from "@/types/resume";

defineOptions({ name: "ResumeArtisticContent" });

const WORK_COVER = 1;
/** 与固定 A4 页高匹配；过大则打印裁切，过小则页内留白偏多 */
const WORK_CHUNK = 2;

function isExternalHttpHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function contactKind(item: ResumeContactItem): "tel" | "mail" | "web" | "other" {
  const h = item.href ?? "";
  if (h.startsWith("tel:")) return "tel";
  if (h.startsWith("mailto:")) return "mail";
  if (h.startsWith("http")) return "web";
  return "other";
}

function contactLabel(item: ResumeContactItem, index: number): string {
  switch (contactKind(item)) {
    case "tel":
      return "电话";
    case "mail":
      return "邮箱";
    case "web":
      return "链接";
    default:
      return index === 0 ? "联系" : "其他";
  }
}

function contactGlyph(item: ResumeContactItem): string {
  switch (contactKind(item)) {
    case "tel":
      return "☎";
    case "mail":
      return "✉";
    case "web":
      return "↗";
    default:
      return "◆";
  }
}

const workOnCover = computed(() => resume.workExperiences.slice(0, WORK_COVER));

const workChunks = computed(() => {
  const rest = resume.workExperiences.slice(WORK_COVER);
  const chunks: ResumeExperience[][] = [];
  for (let i = 0; i < rest.length; i += WORK_CHUNK) {
    chunks.push(rest.slice(i, i + WORK_CHUNK));
  }
  return chunks;
});

</script>

<template>
  <div class="artistic-root">
  <!-- 首页：顶贴边姓名+头像；全宽关于我；双栏经历+侧栏；全宽影响力 -->
  <section class="page page-artistic page-artistic--cover">
    <header class="artistic-hero">
      <div class="artistic-hero-text">
        <span class="artistic-hero-rule" aria-hidden="true" />
        <h1 class="artistic-name">{{ resume.name }}</h1>
        <p class="artistic-role">
          <span v-for="(line, hi) in resume.headlineLines" :key="'h' + hi">
            <br v-if="hi > 0" />
            {{ line }}
          </span>
        </p>
      </div>
      <figure class="artistic-portrait">
        <img :src="resume.portraitSrc" :alt="resume.portraitAlt" />
      </figure>
    </header>

    <div class="artistic-cover-body">
    <section class="artistic-about-full">
      <h2 class="artistic-bar">关于我</h2>
      <p class="artistic-about">
        <span v-for="(line, si) in resume.summaryLines" :key="'s' + si">
          <template v-if="si > 0"><br /></template>
          {{ line }}
        </span>
      </p>
    </section>

    <div class="artistic-grid">
      <div class="artistic-main">
        <section class="artistic-block">
          <h2 class="artistic-bar">工作经历</h2>
          <article v-for="item in workOnCover" :key="item.title" class="artistic-exp">
            <h3>{{ item.title }}</h3>
            <p class="artistic-exp-meta">
              {{ item.period }}<template v-if="item.role"> · {{ item.role }}</template>
            </p>
            <p v-if="item.result" class="artistic-exp-result">{{ item.result }}</p>
            <ul v-if="item.bullets.length" class="artistic-exp-bullets">
              <li v-for="b in item.bullets" :key="b">{{ b }}</li>
            </ul>
          </article>
        </section>
      </div>

      <aside class="artistic-side">
        <section class="artistic-block">
          <h2 class="artistic-bar artistic-bar--end">联系方式</h2>
          <ul class="artistic-contacts">
            <li v-for="(item, ci) in resume.contactItems" :key="item.text">
              <span class="artistic-contact-icon" aria-hidden="true">{{ contactGlyph(item) }}</span>
              <div class="artistic-contact-body">
                <span class="artistic-contact-label">{{ contactLabel(item, ci) }}</span>
                <span class="artistic-contact-value">
                  <a
                    v-if="item.href"
                    :href="item.href"
                    class="artistic-link"
                    :target="isExternalHttpHref(item.href) ? '_blank' : undefined"
                    :rel="isExternalHttpHref(item.href) ? 'noopener noreferrer' : undefined"
                    >{{ item.text }}</a
                  >
                  <template v-else>{{ item.text }}</template>
                </span>
              </div>
            </li>
          </ul>
        </section>

        <section class="artistic-block">
          <h2 class="artistic-bar artistic-bar--end">技能</h2>
          <div class="artistic-skills-wrap">
            <div v-for="group in resume.skillGroups" :key="group.title" class="artistic-skill-group">
              <h3 class="artistic-skill-group-title">{{ group.title }}</h3>
              <ul class="artistic-skill-list">
                <li v-for="item in group.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <section class="artistic-influence-full">
      <h2 class="artistic-bar artistic-bar--full">影响力</h2>
      <ul class="artistic-influence-list">
        <li v-for="line in resume.influenceItems" :key="line">{{ line }}</li>
      </ul>
    </section>
    </div>
  </section>

  <section
    v-for="(chunk, wi) in workChunks"
    :key="'w' + wi"
    class="page page-artistic page-artistic--flow"
  >
    <h2 class="artistic-bar artistic-bar--solo">{{ resume.workSectionTitle }}</h2>
    <div class="artistic-flow-body">
    <article v-for="item in chunk" :key="item.title" class="artistic-exp">
      <h3>{{ item.title }}</h3>
      <p class="artistic-exp-meta">
        {{ item.period }}<template v-if="item.role"> · {{ item.role }}</template>
      </p>
      <p v-if="item.result" class="artistic-exp-result">{{ item.result }}</p>
      <ul v-if="item.bullets.length" class="artistic-exp-bullets">
        <li v-for="b in item.bullets" :key="b">{{ b }}</li>
      </ul>
    </article>
    </div>
  </section>

  <section class="page page-artistic page-artistic--flow">
    <h2 class="artistic-bar artistic-bar--solo">{{ resume.earlySectionTitle }}</h2>
    <div class="artistic-flow-body">
    <article v-for="item in resume.earlyExperiences" :key="item.title" class="artistic-exp">
      <h3>{{ item.title }}</h3>
      <p class="artistic-exp-meta">
        {{ item.period }}<template v-if="item.role"> · {{ item.role }}</template>
      </p>
      <ul v-if="item.bullets.length" class="artistic-exp-bullets">
        <li v-for="b in item.bullets" :key="b">{{ b }}</li>
      </ul>
    </article>
    </div>
  </section>

  <section class="page page-artistic page-artistic--flow page-artistic--last">
    <h2 class="artistic-bar artistic-bar--solo">{{ resume.certificatesSectionTitle }}</h2>
    <div class="artistic-flow-body artistic-flow-body--certs">
    <div class="artistic-cert-grid">
      <figure v-for="c in resume.certificateImages" :key="c.src" class="artistic-cert">
        <img :src="c.src" :alt="c.title" />
        <figcaption>{{ c.title }}</figcaption>
      </figure>
    </div>
    </div>
  </section>
  </div>
</template>

<style scoped>
.artistic-root {
  display: contents;
}

.page-artistic {
  position: relative;
  box-sizing: border-box;
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  margin: 0 auto 24px;
  padding: 14mm 16mm 16mm;
  overflow: hidden;
  color: #1a1a1a;
  background: #fff;
  box-shadow: var(--resume-page-elevation, 0 8px 24px rgba(0, 0, 0, 0.10));
  break-after: page;
  page-break-after: always;
  font-family:
    "Helvetica Neue",
    Helvetica,
    Arial,
    "PingFang SC",
    "Microsoft YaHei",
    sans-serif;
}

.page-artistic--cover {
  display: flex;
  flex-direction: column;
  padding: 0 16mm 14mm;
  box-sizing: border-box;
}

.page-artistic--flow {
  display: flex;
  flex-direction: column;
  padding: 16mm 16mm 12mm;
  box-sizing: border-box;
}

.artistic-cover-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 7mm;
  overflow-x: hidden;
  overflow-y: auto;
}

.artistic-flow-body {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.artistic-flow-body--certs {
  display: flex;
  flex-direction: column;
}

.artistic-flow-body--certs .artistic-cert-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.artistic-hero {
  display: grid;
  grid-template-columns: 1fr 52mm;
  gap: 10mm;
  align-items: start;
  margin: 0 0 9mm;
  flex-shrink: 0;
}

.artistic-hero-text {
  position: relative;
  padding-left: 7mm;
}

.artistic-hero-rule {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1.5px;
  background: #0a0a0a;
}

.artistic-name {
  margin: 0;
  font-size: 28pt;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0.06em;
  color: #0a0a0a;
}

.artistic-role {
  margin: 2.5mm 0 0;
  max-width: 52em;
  font-size: 11pt;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: #333;
}

.artistic-portrait {
  margin: 0;
  align-self: start;
  width: 100%;
  min-height: 56mm;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.artistic-portrait img {
  width: 100%;
  height: 100%;
  min-height: 56mm;
  display: block;
  object-fit: cover;
  object-position: 50% 18%;
  filter: grayscale(100%);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.artistic-about-full {
  margin: 0 0 10mm;
}

.artistic-about-full .artistic-bar {
  text-align: left;
}

.artistic-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
  gap: 0 12mm;
  align-items: start;
  flex: 1;
  min-height: 0;
}

.artistic-main,
.artistic-side {
  min-height: 0;
  overflow-y: auto;
}

.artistic-side {
  padding-top: 3mm;
}

.artistic-bar {
  margin: 0 0 3.5mm;
  padding: 1.8mm 5mm;
  font-size: 9pt;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #fff;
  background: #0a0a0a;
  text-align: center;
}

.artistic-bar--end {
  text-align: right;
}

.artistic-bar--full {
  text-align: left;
}

.artistic-bar--solo {
  flex-shrink: 0;
  margin-bottom: 7mm;
}

.artistic-block + .artistic-block {
  margin-top: 9mm;
}

.artistic-influence-full {
  flex-shrink: 0;
  margin-top: 0;
  padding-top: 3mm;
  border-top: 1px solid #d1d5db;
}

.artistic-influence-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.artistic-influence-list li {
  margin: 0 0 4mm;
  padding: 0;
  font-size: 10.2pt;
  font-weight: 500;
  line-height: 1.55;
  text-align: justify;
  color: #1a1a1a;
}

.artistic-influence-list li:last-child {
  margin-bottom: 0;
}

.artistic-about {
  margin: 0;
  font-size: 10.2pt;
  font-weight: 500;
  line-height: 1.5;
  text-align: justify;
  color: #1a1a1a;
}

.artistic-exp + .artistic-exp {
  margin-top: 5mm;
}

.page-artistic--flow .artistic-exp + .artistic-exp {
  margin-top: 7mm;
  padding-top: 5mm;
  border-top: 1px solid #e5e7eb;
}

.artistic-exp h3 {
  margin: 0 0 1mm;
  font-size: 11.2pt;
  font-weight: 800;
  line-height: 1.25;
  color: #0a0a0a;
}

.artistic-exp-meta {
  margin: 0 0 1.5mm;
  font-size: 10pt;
  font-style: italic;
  font-weight: 500;
  color: #6b7280;
}

.artistic-exp-result {
  margin: 0 0 1.5mm;
  font-size: 10pt;
  font-weight: 500;
  line-height: 1.38;
  color: #333;
}

.artistic-exp-bullets {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 9.6pt;
  font-weight: 500;
  line-height: 1.38;
  color: #333;
}

.artistic-exp-bullets li {
  position: relative;
  padding-left: 4.5mm;
  margin-bottom: 1mm;
}

.artistic-exp-bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 3.5px;
  height: 3.5px;
  background: #0a0a0a;
}

.artistic-contacts {
  margin: 0;
  padding: 0;
  list-style: none;
}

.artistic-contacts li {
  display: grid;
  grid-template-columns: 7.5mm 1fr;
  gap: 3.5mm;
  align-items: start;
  margin-bottom: 3.5mm;
}

.artistic-contact-icon {
  display: grid;
  place-items: center;
  width: 7.5mm;
  height: 7.5mm;
  font-size: 9pt;
  line-height: 1;
  color: #0a0a0a;
  background: transparent;
  border: 1.2px solid #0a0a0a;
}

.artistic-contact-body {
  display: flex;
  flex-direction: column;
  gap: 0.8mm;
  min-width: 0;
}

.artistic-contact-label {
  font-size: 9pt;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #0a0a0a;
}

.artistic-contact-value {
  font-size: 9.2pt;
  font-weight: 500;
  line-height: 1.35;
  word-break: break-word;
  color: #333;
}

.artistic-link {
  color: inherit;
  text-decoration: none;
}

.artistic-skills-wrap {
  display: flex;
  flex-direction: column;
  gap: 6mm;
}

.artistic-skill-group {
  margin: 0;
}

.artistic-skill-group-title {
  margin: 0 0 2.5mm;
  font-size: 9.8pt;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #0a0a0a;
}

.artistic-skill-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 10pt;
  font-weight: 500;
  line-height: 1.45;
  color: #333;
}

.artistic-skill-list li {
  position: relative;
  padding-left: 4.5mm;
  margin: 0 0 2mm;
}

.artistic-skill-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 3.5px;
  height: 3.5px;
  background: #0a0a0a;
}

.artistic-skill-list li:last-child {
  margin-bottom: 0;
}

.artistic-cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5mm 6mm;
}

.artistic-cert {
  margin: 0;
  text-align: center;
}

.artistic-cert img {
  width: 100%;
  max-height: 52mm;
  object-fit: contain;
}

.artistic-cert figcaption {
  margin-top: 2mm;
  font-size: 8pt;
  font-weight: 500;
  line-height: 1.25;
  color: #555;
}

@media screen and (max-width: 900px) {
  .page-artistic {
    width: min(100%, 210mm);
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    margin-left: auto;
    margin-right: auto;
    padding: 10mm 12mm;
  }

  .page-artistic--cover {
    padding: 0 12mm 10mm;
  }

  .page-artistic--flow {
    padding: 12mm 12mm 10mm;
  }

  .artistic-hero {
    grid-template-columns: 1fr;
  }

  .artistic-portrait {
    max-height: 70mm;
    min-height: 48mm;
  }

  .artistic-portrait img {
    min-height: 48mm;
    max-height: 70mm;
  }

  .artistic-grid {
    grid-template-columns: 1fr;
  }

  .artistic-side {
    padding-top: 0;
  }

  .artistic-cert-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media print {
  .artistic-link {
    text-decoration: none;
  }

  .artistic-portrait {
    border: none;
  }

  .artistic-contact-icon {
    border: 1px solid #000;
  }

  .page-artistic {
    width: 210mm;
    height: 296mm;
    min-height: 296mm;
    max-height: 296mm;
    margin: 0;
    padding: 14mm 16mm 16mm;
    box-shadow: none;
    overflow: hidden;
    page-break-after: auto;
    break-after: auto;
  }

  .page-artistic--cover {
    padding: 0 16mm 14mm;
  }

  .page-artistic--flow {
    padding: 14mm 16mm 12mm;
  }

  .artistic-cover-body,
  .artistic-flow-body,
  .artistic-flow-body--certs .artistic-cert-grid {
    overflow: hidden !important;
  }

  .page-artistic--last {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>
