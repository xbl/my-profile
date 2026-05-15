<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { resume } from "@/data/resume";
import {
  normalizeThemeParam,
  RESUME_THEME_STORAGE_KEY,
  RESUME_THEMES,
  type ResumeThemeId,
} from "@/data/resume-themes";
import ResumeArtisticContent from "@/components/resume/ResumeArtisticContent.vue";
import { RESUME_THEME_SHELLS } from "@/components/resume/themes/themeShells";
import { fallbackChunks, packWorkExperienceChunks } from "@/utils/packResumeWorkChunks";
import { isInfluenceGroup } from "@/types/resume";

const themeId = ref<ResumeThemeId>("classic");

const themeShell = computed(() => RESUME_THEME_SHELLS[themeId.value]);

onMounted(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = normalizeThemeParam(params.get("theme"));
    if (q) {
      themeId.value = q;
      if (params.get("theme") === "spectrum") {
        localStorage.setItem(RESUME_THEME_STORAGE_KEY, "folio");
      }
    } else {
      const raw = normalizeThemeParam(localStorage.getItem(RESUME_THEME_STORAGE_KEY));
      if (raw) {
        themeId.value = raw;
        if (localStorage.getItem(RESUME_THEME_STORAGE_KEY) === "spectrum") {
          localStorage.setItem(RESUME_THEME_STORAGE_KEY, "folio");
        }
      }
    }
  } catch {
    /* ignore */
  }
  void recalcWorkChunks();
  document.fonts?.ready?.then(() => void recalcWorkChunks()).catch(() => {});
  window.addEventListener("resize", scheduleRecalcWorkChunks);
  window.addEventListener("beforeprint", recalcWorkChunks as EventListener);
});

watch(themeId, (id) => {
  try {
    localStorage.setItem(RESUME_THEME_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  if (id !== "artistic") {
    void nextTick(() => void recalcWorkChunks());
  }
});

function setTheme(id: ResumeThemeId) {
  themeId.value = id;
}

/** `public/ppt-assets` 下的文件名，与联系方式 / 技能标题 / 区块标题顺序对应 */
const PPT_ICON_FILES = {
  contact: [
    "icon-contact-phone.svg",
    "icon-contact-email.svg",
    "icon-contact-wechat.svg",
  ],
  skillSections: ["icon-skill-consult.svg", "icon-skill-basic.svg"],
  influence: "icon-influence.svg",
  headerWorkTeal: "icon-header-work.svg",
  headerEarlyPurple: "icon-header-early.svg",
  headerCertPurple: "icon-header-cert.svg",
} as const;

function iconSrc(name: string | null | undefined): string {
  if (!name) return "";
  return `/ppt-assets/${name}`;
}

function contactIconAt(index: number): string {
  return iconSrc(PPT_ICON_FILES.contact[index]);
}

function skillIconAt(index: number): string {
  return iconSrc(PPT_ICON_FILES.skillSections[index]);
}

const influenceIconSrc = iconSrc(PPT_ICON_FILES.influence);
const headerWorkSrc = iconSrc(PPT_ICON_FILES.headerWorkTeal);
const headerEarlySrc = iconSrc(PPT_ICON_FILES.headerEarlyPurple);
const headerCertSrc = iconSrc(PPT_ICON_FILES.headerCertPurple);

/** 无图标文件时的占位（与 `PPT_ICON_FILES` 顺序一致） */
const CONTACT_FALLBACK_ICONS = ["☎", "✉", "✹"] as const;
const SKILL_HEADING_FALLBACK_ICONS = ["▣", "✣"] as const;

function contactFallbackAt(index: number): string {
  return CONTACT_FALLBACK_ICONS[index] ?? "•";
}

function skillHeadingFallbackAt(index: number): string {
  return SKILL_HEADING_FALLBACK_ICONS[index] ?? "◆";
}

function isExternalHttpHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Inspire 工作经历：按可视区高度贪心分包（首页非 compact，后续 compact） */
const workChunks = shallowRef(fallbackChunks(resume.workExperiences, 3));

const probeLimitFirst = ref<HTMLElement | null>(null);
const probeLimitRest = ref<HTMLElement | null>(null);
const probeStackFull = ref<HTMLElement | null>(null);
const probeStackCompact = ref<HTMLElement | null>(null);

let resizeDebounce: ReturnType<typeof setTimeout> | undefined;

function articleBudgetPx(probeEl: HTMLElement): number {
  const hdr = probeEl.querySelector(".page-header") as HTMLElement | null;
  if (!hdr) return 600;
  const pb = parseFloat(getComputedStyle(probeEl).paddingBottom);
  return Math.floor(probeEl.clientHeight - hdr.offsetTop - hdr.offsetHeight - pb - 2);
}

function heightsFromStack(stack: HTMLElement): number[] {
  const arts = Array.from(stack.querySelectorAll(".experience-item")) as HTMLElement[];
  return arts.map((el) => {
    const mb = parseFloat(getComputedStyle(el).marginBottom) || 0;
    return el.offsetHeight + mb;
  });
}

async function recalcWorkChunks() {
  await nextTick();
  if (
    !probeLimitFirst.value ||
    !probeLimitRest.value ||
    !probeStackFull.value ||
    !probeStackCompact.value
  ) {
    workChunks.value = fallbackChunks(resume.workExperiences, 3);
    return;
  }
  const maxFirst = articleBudgetPx(probeLimitFirst.value);
  const maxRest = articleBudgetPx(probeLimitRest.value);
  const hFull = heightsFromStack(probeStackFull.value);
  const hCompact = heightsFromStack(probeStackCompact.value);
  if (hFull.length !== resume.workExperiences.length || hCompact.length !== resume.workExperiences.length) {
    workChunks.value = fallbackChunks(resume.workExperiences, 3);
    return;
  }
  workChunks.value = packWorkExperienceChunks(
    resume.workExperiences,
    hFull,
    hCompact,
    maxFirst,
    maxRest,
  );
}

function scheduleRecalcWorkChunks() {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => void recalcWorkChunks(), 200);
}

watch(
  () => resume.workExperiences,
  () => void recalcWorkChunks(),
  { deep: true },
);

onBeforeUnmount(() => {
  window.removeEventListener("resize", scheduleRecalcWorkChunks);
  window.removeEventListener("beforeprint", recalcWorkChunks as EventListener);
  clearTimeout(resizeDebounce);
});
</script>

<template>
  <component :is="themeShell">
    <div class="theme-bar" role="group" aria-label="简历主题">
      <span class="theme-bar-label">主题</span>
      <button
        v-for="t in RESUME_THEMES"
        :key="t.id"
        type="button"
        class="theme-chip"
        :class="{ 'theme-chip-active': themeId === t.id }"
        :title="t.hint"
        :aria-pressed="themeId === t.id"
        @click="setTheme(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <ResumeArtisticContent v-if="themeId === 'artistic'" />
    <template v-else>
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
              <img
                v-if="contactIconAt(ci)"
                class="contact-icon-img"
                :src="contactIconAt(ci)"
                alt=""
              />
              <span v-else class="contact-fallback">{{ contactFallbackAt(ci) }}</span>
            </span>
            <span class="contact-text">
              <a
                v-if="item.href"
                :href="item.href"
                class="contact-link"
                :target="isExternalHttpHref(item.href) ? '_blank' : undefined"
                :rel="isExternalHttpHref(item.href) ? 'noopener noreferrer' : undefined"
                >{{ item.text }}</a
              >
              <template v-else>{{ item.text }}</template>
            </span>
          </li>
        </ul>
      </aside>

      <main class="cover-main">
        <section v-for="(group, gi) in resume.skillGroups" :key="group.title" class="skill-block">
          <h2>
            <img v-if="skillIconAt(gi)" class="skill-heading-icon" :src="skillIconAt(gi)" alt="" />
            <span v-else class="skill-heading-fallback">{{ skillHeadingFallbackAt(gi) }}</span>
            {{ group.title }}
          </h2>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section v-if="themeId === 'folio'" class="influence-block influence-block-inline">
          <h2>
            <img v-if="influenceIconSrc" class="skill-heading-icon" :src="influenceIconSrc" alt="" />
            <span v-else class="skill-heading-fallback">⚑</span>
            影响力
          </h2>
          <ul>
            <li v-for="(entry, ii) in resume.influenceItems" :key="'inf-' + ii">
              <template v-if="isInfluenceGroup(entry)">
                <div class="influence-group-head">{{ entry.groupTitle }}</div>
                <ul class="influence-sublist">
                  <li v-for="(sub, si) in entry.items" :key="'inf-' + ii + '-s' + si">{{ sub }}</li>
                </ul>
                <p v-if="entry.footnote" class="influence-footnote">{{ entry.footnote }}</p>
              </template>
              <template v-else>{{ entry }}</template>
            </li>
          </ul>
        </section>
      </main>

      <section v-if="themeId !== 'folio'" class="influence-block">
        <h2>
          <img v-if="influenceIconSrc" class="skill-heading-icon" :src="influenceIconSrc" alt="" />
          <span v-else class="skill-heading-fallback">⚑</span>
          影响力
        </h2>
        <ul>
            <li v-for="(entry, ii) in resume.influenceItems" :key="'inf-' + ii">
              <template v-if="isInfluenceGroup(entry)">
                <div class="influence-group-head">{{ entry.groupTitle }}</div>
                <ul class="influence-sublist">
                  <li v-for="(sub, si) in entry.items" :key="'inf-' + ii + '-s' + si">{{ sub }}</li>
                </ul>
                <p v-if="entry.footnote" class="influence-footnote">{{ entry.footnote }}</p>
              </template>
              <template v-else>{{ entry }}</template>
            </li>
        </ul>
      </section>

      <span class="page-number">1</span>
    </section>

    <div class="work-chunk-measure" aria-hidden="true">
      <div ref="probeLimitFirst" class="page page-work work-chunk-probe">
        <div class="decor decor-top" />
        <header class="page-header teal">
          <span class="header-icon">
            <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
            <span v-else>♟</span>
          </span>
          <span>{{ resume.workSectionTitle }}</span>
        </header>
      </div>
      <div ref="probeLimitRest" class="page page-work compact work-chunk-probe">
        <div class="decor decor-top" />
        <header class="page-header teal">
          <span class="header-icon">
            <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
            <span v-else>♟</span>
          </span>
          <span>{{ resume.workSectionTitle }}</span>
        </header>
      </div>
      <div ref="probeStackFull" class="page page-work work-chunk-probe">
        <div class="decor decor-top" />
        <header class="page-header teal">
          <span class="header-icon">
            <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
            <span v-else>♟</span>
          </span>
          <span>{{ resume.workSectionTitle }}</span>
        </header>
        <article
          v-for="item in resume.workExperiences"
          :key="'mf-' + item.title"
          class="experience-item"
        >
          <h3>{{ item.title }}</h3>
          <p class="meta">{{ item.period }}</p>
          <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
          <p v-if="item.result" class="result">成果：{{ item.result }}</p>
          <ul>
            <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </article>
      </div>
      <div ref="probeStackCompact" class="page page-work compact work-chunk-probe">
        <div class="decor decor-top" />
        <header class="page-header teal">
          <span class="header-icon">
            <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
            <span v-else>♟</span>
          </span>
          <span>{{ resume.workSectionTitle }}</span>
        </header>
        <article
          v-for="item in resume.workExperiences"
          :key="'mc-' + item.title"
          class="experience-item"
        >
          <h3>{{ item.title }}</h3>
          <p class="meta">{{ item.period }}</p>
          <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
          <p v-if="item.result" class="result">成果：{{ item.result }}</p>
          <ul>
            <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </article>
      </div>
    </div>

    <section
      v-for="(chunk, ci) in workChunks"
      :key="'wk-' + ci"
      class="page page-work"
      :class="{ compact: ci > 0 }"
    >
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>{{ resume.workSectionTitle }}</span>
      </header>
      <article v-for="item in chunk" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">{{ 2 + ci }}</span>
    </section>

    <section class="page page-work compact page-early">
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
      <span class="page-number">{{ 2 + workChunks.length }}</span>
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
        <figure
          v-for="certificate in resume.certificateImages"
          :key="certificate.src"
          :class="certificate.className"
        >
          <img :src="certificate.src" :alt="certificate.title" />
          <figcaption>{{ certificate.title }}</figcaption>
        </figure>
      </div>
      <span class="page-number">{{ 3 + workChunks.length }}</span>
    </section>
    </template>
  </component>
</template>

<style scoped>
.theme-bar {
  position: sticky;
  top: 16px;
  z-index: 12;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 10px;
  max-width: 210mm;
  margin: 0 auto 20px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 20px rgba(20, 32, 40, 0.08);
  backdrop-filter: blur(8px);
}

.theme-bar-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--resume-ink);
  opacity: 0.65;
  margin-right: 4px;
}

.theme-chip {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--resume-ink);
  background: #fff;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.theme-chip:hover {
  border-color: var(--resume-teal);
  color: var(--resume-teal);
}

.theme-chip-active {
  border-color: var(--resume-teal);
  color: #fff;
  background: var(--resume-teal);
}

:deep(.resume-shell) {
  min-height: 100vh;
  padding: 28px 16px 48px;
  background:
    radial-gradient(circle at 12% 8%, var(--resume-shell-radial), transparent 28rem),
    var(--resume-canvas);
}

.page {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 24px;
  overflow: hidden;
  color: var(--resume-ink);
  background: #fff;
  box-shadow: var(--resume-page-elevation, 0 16px 45px rgba(20, 32, 40, 0.16));
  break-after: page;
  page-break-after: always;
  font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.work-chunk-measure {
  position: fixed;
  left: 0;
  top: 0;
  width: 210mm;
  max-width: 100vw;
  transform: translateX(-120%);
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  visibility: hidden;
}

.work-chunk-measure .work-chunk-probe.page {
  position: relative;
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.page::after {
  content: "";
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
  align-items: start;
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
  content: "";
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
  text-align: center;
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

.contact-text {
  word-break: break-word;
}

.contact-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.12em;
}

@media print {
  .contact-link {
    text-decoration: none;
  }
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
.influence-block > ul > li::before,
.experience-item li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--resume-green);
  font-weight: 900;
}

.influence-block > ul > li::before {
  font-size: min(10.2pt, 0.92em);
  line-height: 1;
  top: 0.08em;
}

.skill-block li,
.influence-block li,
.experience-item li {
  margin-bottom: 1.8mm;
  font-size: 11.4pt;
  line-height: 1.25;
}

.influence-block > ul > li {
  white-space: pre-line;
}

.influence-group-head {
  margin: 0 0 1.6mm;
  font-weight: 700;
}

.influence-sublist {
  margin: 0 0 1mm;
  padding: 0;
  list-style: none;
}

.influence-sublist li {
  position: relative;
  padding-left: 4.2mm;
  margin-bottom: 1.1mm;
  font-size: 10.7pt;
  line-height: 1.32;
  font-weight: 500;
}

.influence-sublist li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  transform: translateY(-50%);
  width: min(1.15mm, 0.26em);
  height: min(1.15mm, 0.26em);
  max-width: 0.42em;
  max-height: 0.42em;
  border-radius: 50%;
  background: color-mix(in srgb, var(--resume-green) 88%, var(--resume-teal));
  box-shadow: none;
}

.influence-footnote {
  margin: 1.2mm 0 0;
  font-size: 10.2pt;
  line-height: 1.3;
  font-weight: 500;
  color: color-mix(in srgb, var(--resume-ink) 70%, transparent);
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
  margin-top: 6mm;
}

.influence-block h2 {
  min-width: 60mm;
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
  margin-bottom: 4.8mm;
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
  font-size: 10.2pt;
  line-height: 1.28;
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
  color: var(--resume-ink);
}

/* 仅屏幕窄视口叠栏；print/PDF 用纸张宽度会误触 max-width，勿与 @media print 混用 */
@media screen and (max-width: 900px) {
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

  :deep(.resume-shell) {
    padding: 0;
    background: #fff;
  }

  :global(.app-root) {
    min-height: auto;
    padding: 0 !important;
  }

  .theme-bar {
    display: none;
  }

  .page {
    width: 210mm;
    min-height: 296mm;
    margin: 0;
    box-shadow: none;
    overflow: hidden;
    page-break-after: auto;
    break-after: auto;
  }

  /* 经历条与首条尽量同页；整块不再强制 avoid，改由 JS 按高度分包 */
  .page-work:not(.page-early) > .page-header.teal {
    break-after: avoid;
    page-break-after: avoid;
  }

  .page::after,
  .page-cover::before,
  .cover-corner,
  .decor-top,
  .decor-left {
    display: none;
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
