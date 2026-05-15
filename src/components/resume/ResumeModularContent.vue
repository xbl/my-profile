<script setup lang="ts">
import { computed } from "vue";
import { resume } from "@/data/resume";
import {
  isInfluenceGroup,
  type ResumeExperience,
} from "@/types/resume";

defineOptions({ name: "ResumeModularContent" });

const props = defineProps<{
  workChunks: ResumeExperience[][];
}>();

const PPT_ICON_FILES = {
  contact: ["icon-contact-phone.svg", "icon-contact-email.svg", "icon-contact-wechat.svg"],
  skillSections: ["icon-skill-consult.svg", "icon-skill-basic.svg"],
  influence: "icon-influence.svg",
  headerWorkTeal: "icon-header-work.svg",
  headerEarlyPurple: "icon-header-early.svg",
  headerCertPurple: "icon-header-cert.svg",
} as const;

const CONTACT_FALLBACK_ICONS = ["☎", "✉", "✹"] as const;
const SKILL_HEADING_FALLBACK_ICONS = ["▣", "✣"] as const;

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

function contactFallbackAt(index: number): string {
  return CONTACT_FALLBACK_ICONS[index] ?? "•";
}

function skillHeadingFallbackAt(index: number): string {
  return SKILL_HEADING_FALLBACK_ICONS[index] ?? "◆";
}

function isExternalHttpHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

const summaryParagraphs = computed(() =>
  resume.summaryLines.map((s) => s.trim()).filter((s) => s.length > 0),
);

function companyFromExperience(ex: ResumeExperience): { company: string; period: string; fullTitle: string } {
  const title = ex.title.trim();
  const m = title.match(/^(.+?)\s*[–—\-]\s*(.+)$/);
  if (m) {
    return { company: m[1].trim(), period: ex.period, fullTitle: title };
  }
  return { company: title, period: ex.period, fullTitle: title };
}

/** 将 period 按常见分隔符拆成片段（用于拼 Inspire 总跨度） */
function periodSegments(period: string): string[] {
  return period
    .trim()
    .split(/\s*[–—\-]\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** 多条 Inspire 客户项目的时间线：取最早一条的起点 + 最近一条的终点 */
function workExperiencesSpanLabel(work: ResumeExperience[]): string {
  if (!work.length) return "";
  const oldest = work[work.length - 1]!;
  const newest = work[0]!;
  const startSeg = periodSegments(oldest.period)[0] ?? oldest.period.trim();
  const newestSegs = periodSegments(newest.period);
  const endSeg =
    newestSegs.length >= 2 ? newestSegs[newestSegs.length - 1]! : newest.period.trim();
  return `${startSeg} – ${endSeg}`;
}

function inspireEmployerShortName(): string {
  return resume.workSectionTitle.replace(/\s*工作经历\s*$/, "").trim() || "Inspire";
}

/**
 * 封面「公司经历」：Inspire 为任职公司（workExperiences 均为客户侧咨询项目）；
 * 其后为早期任职公司（与「早期工作经历」页一致）。
 */
const coverWorkTimeline = computed(() => {
  const rows: { company: string; period: string; fullTitle: string }[] = [];
  if (resume.workExperiences.length) {
    const company = inspireEmployerShortName();
    rows.push({
      company,
      period: workExperiencesSpanLabel(resume.workExperiences),
      fullTitle: resume.workSectionTitle,
    });
  }
  for (const ex of resume.earlyExperiences) {
    rows.push(companyFromExperience(ex));
  }
  return rows;
});

function certPageNumber(): number {
  return 3 + props.workChunks.length;
}

function earlyPageNumber(): number {
  return 2 + props.workChunks.length;
}
</script>

<template>
  <div class="modular-root">
    <!-- 封面：顶栏 + 双栏（总结 / 公司经历 / 影响力 | 联系 / 技能） -->
    <section class="page page-modular page-modular--cover">
      <header class="modular-hero">
        <div class="modular-hero-text">
          <h1 class="modular-name">{{ resume.name }}</h1>
          <p class="modular-headline">
            <span v-for="(line, hi) in resume.headlineLines" :key="'h' + hi">
              <br v-if="hi > 0" />
              {{ line }}
            </span>
          </p>
        </div>
        <figure class="modular-hero-photo">
          <img :src="resume.portraitSrc" :alt="resume.portraitAlt" />
        </figure>
      </header>

      <div class="modular-cover-body">
        <div class="modular-sheet">
          <div class="modular-col modular-col--main">
            <section class="modular-block">
              <h2 class="modular-block-title">
                <span class="modular-block-icon" aria-hidden="true">◉</span>
                个人总结
              </h2>
              <div class="modular-summary-body">
                <p v-for="(para, pi) in summaryParagraphs" :key="'p' + pi" class="modular-summary-p">
                  {{ para }}
                </p>
              </div>
            </section>

            <section v-if="coverWorkTimeline.length" class="modular-block modular-block--career">
              <h2 class="modular-block-title">
                <img v-if="headerWorkSrc" class="modular-block-title-ico" :src="headerWorkSrc" alt="" />
                <span v-else class="modular-block-icon" aria-hidden="true">▸</span>
                公司经历
              </h2>
              <div class="modular-mini-timeline">
                <div class="modular-mini-timeline-rail" aria-hidden="true" />
                <article
                  v-for="(row, ri) in coverWorkTimeline"
                  :key="'cv-' + ri"
                  class="modular-mini-item"
                  :title="row.fullTitle"
                >
                  <div class="modular-mini-dot-wrap" aria-hidden="true">
                    <span class="modular-mini-dot" />
                  </div>
                  <div class="modular-mini-body">
                    <header class="modular-mini-head">
                      <span class="modular-mini-co">{{ row.company }}</span>
                      <time class="modular-mini-time">{{ row.period }}</time>
                    </header>
                  </div>
                </article>
              </div>
            </section>

            <section class="modular-block modular-block--influence">
              <h2 class="modular-block-title">
                <img v-if="influenceIconSrc" class="modular-block-title-ico" :src="influenceIconSrc" alt="" />
                <span v-else class="modular-block-icon" aria-hidden="true">⚑</span>
                影响力
              </h2>
              <ul class="modular-influence">
                <li v-for="(entry, ii) in resume.influenceItems" :key="'inf-' + ii">
                  <template v-if="isInfluenceGroup(entry)">
                    <div class="modular-inf-head">{{ entry.groupTitle }}</div>
                    <ul class="modular-inf-sub">
                      <li v-for="(sub, si) in entry.items" :key="'s' + si">{{ sub }}</li>
                    </ul>
                    <p v-if="entry.footnote" class="modular-inf-note">{{ entry.footnote }}</p>
                  </template>
                  <template v-else>{{ entry }}</template>
                </li>
              </ul>
            </section>
          </div>

          <aside class="modular-col modular-col--aside">
          <section class="modular-block modular-block--aside">
            <h2 class="modular-block-title modular-block-title--aside">
              <span class="modular-block-icon" aria-hidden="true">◇</span>
              基本信息
            </h2>
            <ul class="modular-contact">
              <li v-for="(item, ci) in resume.contactItems" :key="item.text">
                <span class="modular-contact-ico">
                  <img v-if="contactIconAt(ci)" class="modular-contact-img" :src="contactIconAt(ci)" alt="" />
                  <span v-else>{{ contactFallbackAt(ci) }}</span>
                </span>
                <span class="modular-contact-txt">
                  <a
                    v-if="item.href"
                    :href="item.href"
                    class="modular-link"
                    :target="isExternalHttpHref(item.href) ? '_blank' : undefined"
                    :rel="isExternalHttpHref(item.href) ? 'noopener noreferrer' : undefined"
                    >{{ item.text }}</a
                  >
                  <template v-else>{{ item.text }}</template>
                </span>
              </li>
            </ul>
          </section>

          <section v-for="(group, gi) in resume.skillGroups" :key="group.title" class="modular-block modular-block--aside">
            <h2 class="modular-block-title modular-block-title--aside">
              <img v-if="skillIconAt(gi)" class="modular-skill-ico" :src="skillIconAt(gi)" alt="" />
              <span v-else class="modular-block-icon" aria-hidden="true">{{ skillHeadingFallbackAt(gi) }}</span>
              {{ group.title }}
            </h2>
            <div class="modular-tags">
              <span v-for="item in group.items" :key="item" class="modular-tag">{{ item }}</span>
            </div>
          </section>
        </aside>
        </div>
      </div>
      <span class="modular-page-no">1</span>
    </section>

    <!-- 工作经历：按包分页 + 时间线 -->
    <section
      v-for="(chunk, ci) in workChunks"
      :key="'wk-' + ci"
      class="page page-modular page-modular--timeline"
    >
      <h2 class="modular-section-h">
        <img v-if="headerWorkSrc" class="modular-section-h-ico" :src="headerWorkSrc" alt="" />
        <span v-else class="modular-section-h-fallback" aria-hidden="true">▸</span>
        {{ resume.workSectionTitle }}
      </h2>
      <div class="modular-flow-body">
        <div class="modular-timeline">
        <div class="modular-timeline-rail" aria-hidden="true" />
        <article v-for="item in chunk" :key="item.title" class="modular-tl-item">
          <div class="modular-tl-dot-wrap" aria-hidden="true">
            <span class="modular-tl-dot" />
          </div>
          <div class="modular-tl-body">
            <header class="modular-tl-head">
              <h3 class="modular-tl-title">{{ item.title }}</h3>
              <time class="modular-tl-time">{{ item.period }}</time>
            </header>
            <p v-if="item.role" class="modular-tl-role">{{ item.role }}</p>
            <p v-if="item.result" class="modular-tl-result">{{ item.result }}</p>
            <ul v-if="item.bullets.length" class="modular-tl-bullets">
              <li v-for="b in item.bullets" :key="b">{{ b }}</li>
            </ul>
          </div>
        </article>
      </div>
      </div>
      <span class="modular-page-no">{{ 2 + ci }}</span>
    </section>

    <!-- 早期经历 -->
    <section class="page page-modular page-modular--timeline page-modular--early">
      <h2 class="modular-section-h modular-section-h--muted">
        <img v-if="headerEarlySrc" class="modular-section-h-ico" :src="headerEarlySrc" alt="" />
        <span v-else class="modular-section-h-fallback" aria-hidden="true">▸</span>
        {{ resume.earlySectionTitle }}
      </h2>
      <div class="modular-flow-body">
        <div class="modular-timeline">
        <div class="modular-timeline-rail modular-timeline-rail--muted" aria-hidden="true" />
        <article v-for="item in resume.earlyExperiences" :key="item.title" class="modular-tl-item">
          <div class="modular-tl-dot-wrap" aria-hidden="true">
            <span class="modular-tl-dot modular-tl-dot--muted" />
          </div>
          <div class="modular-tl-body">
            <header class="modular-tl-head">
              <h3 class="modular-tl-title">{{ item.title }}</h3>
              <time class="modular-tl-time">{{ item.period }}</time>
            </header>
            <p v-if="item.role" class="modular-tl-role">{{ item.role }}</p>
            <p v-if="item.result" class="modular-tl-result">{{ item.result }}</p>
            <ul v-if="item.bullets.length" class="modular-tl-bullets">
              <li v-for="b in item.bullets" :key="b">{{ b }}</li>
            </ul>
          </div>
        </article>
      </div>
      </div>
      <span class="modular-page-no">{{ earlyPageNumber() }}</span>
    </section>

    <!-- 证书 -->
    <section class="page page-modular page-modular--certs">
      <h2 class="modular-section-h modular-section-h--muted">
        <img v-if="headerCertSrc" class="modular-section-h-ico" :src="headerCertSrc" alt="" />
        <span v-else class="modular-section-h-fallback" aria-hidden="true">▸</span>
        {{ resume.certificatesSectionTitle }}
      </h2>
      <div class="modular-flow-body modular-flow-body--certs">
        <div class="modular-cert-grid">
        <figure
          v-for="c in resume.certificateImages"
          :key="c.src"
          class="modular-cert-fig"
          :class="c.className"
        >
          <img :src="c.src" :alt="c.title" />
          <figcaption>{{ c.title }}</figcaption>
        </figure>
      </div>
      </div>
      <span class="modular-page-no">{{ certPageNumber() }}</span>
    </section>
  </div>
</template>

<style scoped>
.modular-root {
  font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page-modular {
  position: relative;
  box-sizing: border-box;
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  margin: 0 auto 24px;
  overflow: hidden;
  color: var(--resume-ink);
  background: #fff;
  box-shadow: var(--resume-page-elevation, 0 12px 32px rgba(15, 23, 42, 0.12));
  break-after: page;
  page-break-after: always;
}

.page-modular--cover {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.modular-cover-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modular-sheet {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 0;
  overflow: hidden;
}

.modular-col--main,
.modular-col--aside {
  min-height: 0;
  overflow-x: hidden;
  overflow-y: hidden;
}

.modular-col--main {
  padding: 10mm 11mm 10mm 13mm;
  border-right: 1px solid color-mix(in srgb, var(--resume-ink) 8%, transparent);
}

.modular-col--aside {
  padding: 10mm 13mm 10mm 10mm;
  background: color-mix(in srgb, var(--resume-muted) 55%, #fff);
}

.page-modular--timeline {
  display: flex;
  flex-direction: column;
  padding: 12mm 14mm 12mm;
  box-sizing: border-box;
}

.page-modular--certs {
  display: flex;
  flex-direction: column;
  padding: 12mm 14mm 12mm;
  box-sizing: border-box;
}

.modular-flow-body {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: hidden;
}

.modular-flow-body--certs {
  display: flex;
  flex-direction: column;
}

.modular-flow-body--certs .modular-cert-grid {
  flex: 1;
  min-height: 0;
  overflow-y: hidden;
}

.modular-hero {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 10mm;
  flex-shrink: 0;
  padding: 10mm 14mm 9mm;
  background: linear-gradient(
    105deg,
    color-mix(in srgb, var(--resume-teal) 94%, #000) 0%,
    color-mix(in srgb, var(--resume-teal) 72%, var(--resume-purple)) 100%
  );
  color: #fff;
}

.modular-hero-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3mm;
}

.modular-name {
  margin: 0;
  font-size: 26pt;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.1;
}

.modular-headline {
  margin: 0;
  font-size: 11.5pt;
  font-weight: 600;
  line-height: 1.45;
  opacity: 0.94;
}

.modular-hero-photo {
  margin: 0;
  flex-shrink: 0;
  width: 38mm;
  height: 38mm;
  border-radius: 999px;
  overflow: hidden;
  border: 3px solid color-mix(in srgb, #fff 55%, transparent);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
}

.modular-hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 18%;
}

.modular-block-title {
  display: flex;
  align-items: center;
  gap: 2.5mm;
  margin: 0 0 4.5mm;
  padding: 0 0 2mm;
  font-size: 12pt;
  font-weight: 800;
  color: var(--resume-teal);
  border-bottom: 2px solid var(--resume-purple);
}

.modular-block-title--aside {
  font-size: 10.8pt;
  border-bottom-color: color-mix(in srgb, var(--resume-purple) 82%, var(--resume-teal));
}

.modular-block-icon {
  font-size: 11pt;
  opacity: 0.85;
}

.modular-skill-ico {
  width: 1.1em;
  height: 1.1em;
  object-fit: contain;
}

.modular-block-title-ico {
  width: 1.1em;
  height: 1.1em;
  object-fit: contain;
  flex-shrink: 0;
}

.modular-block--career {
  margin-top: 1.5mm;
}

.modular-mini-timeline {
  --mini-spine: 5mm;
  position: relative;
  margin: 0;
  padding: 0;
}

.modular-mini-timeline-rail {
  position: absolute;
  left: calc(var(--mini-spine) * 0.5);
  top: 0.42em;
  bottom: 0.42em;
  z-index: 0;
  width: 2px;
  transform: translateX(-50%);
  border-radius: 1px;
  background: color-mix(in srgb, var(--resume-purple) 42%, #cbd5e1);
}

.modular-mini-item {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: var(--mini-spine) 1fr;
  gap: 0 2.2mm;
  margin-bottom: 2.6mm;
}

.modular-mini-item:last-child {
  margin-bottom: 0;
}

.modular-mini-dot-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding-top: 0.12em;
}

.modular-mini-dot {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 3mm;
  height: 3mm;
  border-radius: 50%;
  background: var(--resume-purple);
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--resume-purple) 45%, transparent);
}

.modular-mini-body {
  min-width: 0;
}

.modular-mini-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 3mm;
  align-items: start;
  font-size: 9.1pt;
  line-height: 1.32;
}

.modular-mini-co {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-weight: 700;
  color: var(--resume-teal);
}

.modular-mini-time {
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  align-self: start;
  font-variant-numeric: tabular-nums;
  color: color-mix(in srgb, var(--resume-ink) 52%, #fff);
  white-space: nowrap;
}

.modular-summary-body {
  font-size: 10.5pt;
  line-height: 1.48;
  color: color-mix(in srgb, var(--resume-ink) 92%, #fff);
}

.modular-summary-p {
  margin: 0 0 3mm;
}

.modular-summary-p:last-child {
  margin-bottom: 0;
}

.modular-contact {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.8mm;
  font-size: 10.2pt;
}

.modular-contact li {
  display: flex;
  align-items: flex-start;
  gap: 2.5mm;
}

.modular-contact-ico {
  flex-shrink: 0;
  width: 7mm;
  height: 7mm;
  display: grid;
  place-items: center;
  border-radius: 1.2mm;
  background: color-mix(in srgb, var(--resume-teal) 12%, #fff);
  color: var(--resume-teal);
  font-size: 9pt;
}

.modular-contact-img {
  width: 62%;
  height: 62%;
  object-fit: contain;
}

.modular-contact-txt {
  min-width: 0;
  word-break: break-word;
  line-height: 1.35;
}

.modular-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.12em;
}

.modular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm 2.5mm;
}

.modular-tag {
  display: inline-block;
  padding: 1.2mm 2.8mm;
  font-size: 8.8pt;
  font-weight: 600;
  line-height: 1.2;
  color: color-mix(in srgb, var(--resume-ink) 88%, #fff);
  background: #fff;
  border: 1px solid color-mix(in srgb, var(--resume-ink) 12%, transparent);
  border-radius: 999px;
}

.modular-block + .modular-block {
  margin-top: 7mm;
}

.modular-influence {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 9.6pt;
  line-height: 1.38;
}

.modular-influence > li {
  margin-bottom: 2.5mm;
}

.modular-influence > li:last-child {
  margin-bottom: 0;
}

.modular-inf-head {
  font-weight: 700;
  margin-bottom: 1.2mm;
}

.modular-inf-sub {
  margin: 0;
  padding: 0 0 0 3.5mm;
  list-style: disc;
  color: var(--resume-purple);
}

.modular-inf-sub li {
  margin-bottom: 0.8mm;
  color: var(--resume-ink);
}

.modular-inf-note {
  margin: 1.5mm 0 0;
  font-size: 9pt;
  color: color-mix(in srgb, var(--resume-ink) 55%, #fff);
}

/* 时间线页 */
.modular-section-h {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 3mm;
  margin: 0 0 7mm;
  padding-bottom: 2.5mm;
  font-size: 13pt;
  font-weight: 800;
  color: var(--resume-teal);
  border-bottom: 2px solid var(--resume-purple);
}

.modular-section-h--muted {
  border-bottom-color: color-mix(in srgb, var(--resume-purple) 55%, var(--resume-teal));
}

.modular-section-h-ico {
  width: 1.15em;
  height: 1.15em;
  object-fit: contain;
}

.modular-section-h-fallback {
  font-size: 12pt;
  opacity: 0.75;
}

.modular-timeline {
  position: relative;
  padding-left: 11mm;
}

.modular-timeline-rail {
  position: absolute;
  left: 3.2mm;
  top: 0.5mm;
  bottom: 2mm;
  width: 2px;
  border-radius: 1px;
  background: color-mix(in srgb, var(--resume-ink) 16%, #cbd5e1);
}

.modular-timeline-rail--muted {
  background: color-mix(in srgb, var(--resume-purple) 35%, #cbd5e1);
}

.modular-tl-item {
  position: relative;
  display: grid;
  grid-template-columns: 7mm 1fr;
  gap: 2mm 3mm;
  margin-bottom: 6.5mm;
}

.modular-tl-item:last-child {
  margin-bottom: 0;
}

.modular-tl-dot-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 0.35em;
}

.modular-tl-dot {
  width: 3.2mm;
  height: 3.2mm;
  border-radius: 50%;
  background: var(--resume-purple);
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--resume-purple) 45%, transparent);
  z-index: 1;
}

.modular-tl-dot--muted {
  background: color-mix(in srgb, var(--resume-purple) 72%, var(--resume-teal));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--resume-purple) 35%, transparent);
}

.modular-tl-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4mm;
  flex-wrap: wrap;
}

.modular-tl-title {
  margin: 0;
  font-size: 11.8pt;
  font-weight: 800;
  color: var(--resume-teal);
  line-height: 1.25;
  flex: 1;
  min-width: 12em;
}

.modular-tl-time {
  flex-shrink: 0;
  font-size: 10pt;
  font-weight: 700;
  color: color-mix(in srgb, var(--resume-ink) 58%, #fff);
  font-style: normal;
}

.modular-tl-role {
  margin: 1mm 0 0;
  font-size: 10.2pt;
  font-weight: 600;
  color: color-mix(in srgb, var(--resume-ink) 78%, #fff);
}

.modular-tl-result {
  margin: 1.5mm 0 0;
  font-size: 10pt;
  line-height: 1.38;
  text-align: justify;
  color: color-mix(in srgb, var(--resume-ink) 88%, #fff);
}

.modular-tl-bullets {
  margin: 2mm 0 0;
  padding: 0;
  list-style: none;
}

.modular-tl-bullets li {
  position: relative;
  padding-left: 4.5mm;
  margin-bottom: 1.2mm;
  font-size: 9.6pt;
  line-height: 1.36;
  color: color-mix(in srgb, var(--resume-ink) 92%, #fff);
}

.modular-tl-bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.48em;
  transform: translateY(-50%);
  width: 1.35mm;
  height: 1.35mm;
  border-radius: 50%;
  background: color-mix(in srgb, var(--resume-purple) 85%, var(--resume-teal));
}

.page-modular--certs {
  padding: 12mm 14mm 12mm;
}

.modular-cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4mm 5mm;
}

.modular-cert-fig {
  margin: 0;
  text-align: center;
}

.modular-cert-fig img {
  width: 100%;
  max-height: 58mm;
  object-fit: contain;
}

.modular-cert-fig figcaption {
  margin-top: 1.8mm;
  font-size: 10pt;
  font-weight: 500;
  line-height: 1.25;
}

.modular-cert-fig.wide {
  grid-column: span 1;
}

.modular-cert-fig.cover img {
  max-height: 58mm;
}

.modular-cert-fig:nth-child(3),
.modular-cert-fig:nth-child(4),
.modular-cert-fig:nth-child(5) {
  grid-column: auto;
}

.modular-cert-fig:nth-child(n + 3):not(.wide) img {
  max-height: 68mm;
}

.modular-cert-fig:nth-child(3) {
  grid-column: 1 / 2;
}

.modular-cert-fig:nth-child(4) {
  grid-column: 2 / 3;
}

.modular-cert-fig:nth-child(5) {
  grid-column: 3 / 4;
}

.modular-cert-fig:nth-child(6) {
  grid-column: 1 / 3;
}

.modular-cert-fig:nth-child(6) img {
  max-height: 46mm;
}

.modular-page-no {
  position: absolute;
  right: 7mm;
  bottom: 5mm;
  font-size: 10pt;
  font-weight: 600;
  color: color-mix(in srgb, var(--resume-ink) 48%, #fff);
}

@media screen and (max-width: 900px) {
  .page-modular {
    width: min(100%, 210mm);
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
  }

  .modular-sheet {
    grid-template-columns: 1fr;
  }

  .modular-col--main {
    border-right: none;
    border-bottom: 1px solid color-mix(in srgb, var(--resume-ink) 8%, transparent);
  }
}

@media print {
  .modular-link {
    text-decoration: none;
  }

  .page-modular {
    width: 210mm;
    height: 296mm;
    min-height: 296mm;
    max-height: 296mm;
    margin: 0;
    box-shadow: none;
    page-break-after: auto;
    break-after: auto;
  }

  .modular-col--main,
  .modular-col--aside,
  .modular-flow-body,
  .modular-flow-body--certs .modular-cert-grid {
    overflow: hidden !important;
  }

  .page-modular:last-child {
    page-break-after: auto;
    break-after: auto;
  }
}
</style>
