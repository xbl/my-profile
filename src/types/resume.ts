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

export type ResumeData = {
  name: string
  headlineLines: string[]
  summaryLines: string[]
  contactItems: ResumeContactItem[]
  skillGroups: ResumeSkillGroup[]
  /** 影响力列表；单项可含 `\n`，各主题下按行展示（`white-space: pre-line`） */
  influenceItems: string[]
  workSectionTitle: string
  workExperiences: ResumeExperience[]
  earlySectionTitle: string
  earlyExperiences: ResumeExperience[]
  certificatesSectionTitle: string
  certificateImages: ResumeCertificate[]
  portraitSrc: string
  portraitAlt: string
}
