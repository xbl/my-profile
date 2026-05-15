/** 简历结构化数据（由 `src-profile/谢保龙简历.md` 同步生成，供页面与后续 HTML 导出使用） */

export type ResumeExperience = {
  title: string
  period: string
  role?: string
  result?: string
  bullets: string[]
}

export type ResumeCertificate = {
  title: string
  src: string
  className?: string
}

export type ResumeSkillGroup = {
  title: string
  items: string[]
}

export type ResumeContactItem = {
  text: string
  /**
   * 可点击跳转：`tel:`、`mailto:`、`https:` 等（与简历 PPT/Markdown 中的联系方式一致；导出 PDF 时仍保留为可点链接）
   */
  href?: string
}

/** 影响力中带子列表的一组（如「公开演讲」）；子项符号由 CSS 绘制，随 `--resume-*` 变量变化 */
export type InfluenceGroup = {
  groupTitle: string
  items: string[]
  footnote?: string
}

export type InfluenceListEntry = string | InfluenceGroup

export function isInfluenceGroup(entry: InfluenceListEntry): entry is InfluenceGroup {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'groupTitle' in entry &&
    'items' in entry &&
    Array.isArray((entry as InfluenceGroup).items)
  )
}

export type ResumeData = {
  name: string
  headlineLines: string[]
  summaryLines: string[]
  contactItems: ResumeContactItem[]
  skillGroups: ResumeSkillGroup[]
  /** 影响力：字符串为单行（可含 `\n`）；`InfluenceGroup` 为嵌套 `<ul>`，子项符号见 `ResumeView` / 主题 CSS */
  influenceItems: InfluenceListEntry[]
  workSectionTitle: string
  workExperiences: ResumeExperience[]
  earlySectionTitle: string
  earlyExperiences: ResumeExperience[]
  certificatesSectionTitle: string
  certificateImages: ResumeCertificate[]
  portraitSrc: string
  portraitAlt: string
}
