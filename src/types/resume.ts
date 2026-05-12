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
}

export type ResumeData = {
  name: string
  headlineLines: string[]
  summaryLines: string[]
  contactItems: ResumeContactItem[]
  skillGroups: ResumeSkillGroup[]
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
