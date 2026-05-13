export type ResumeThemeId = 'classic' | 'executive' | 'folio' | 'artistic'

/** 旧版主题 id，读取 URL / localStorage 时自动映射为 `folio` */
export const LEGACY_THEME_SPECTRUM = 'spectrum' as const

export const RESUME_THEME_STORAGE_KEY = 'my-profile-resume-theme'

export const RESUME_THEMES: readonly {
  id: ResumeThemeId
  label: string
  hint: string
}[] = [
  { id: 'classic', label: '经典', hint: '当前默认：青绿侧栏 + 双色标题条' },
  { id: 'executive', label: '商务', hint: '冷灰配色；侧栏略窄、内边距更紧' },
  {
    id: 'folio',
    label: '对开',
    hint: '双栏式：左深侧栏；技能与影响力同在右侧，色系统一自 --folio-base',
  },
  {
    id: 'artistic',
    label: '艺术',
    hint: '黑白高对比：粗黑标题条、侧栏技能圆点、头像竖版灰度',
  },
] as const

export function isResumeThemeId(value: string): value is ResumeThemeId {
  return (
    value === 'classic' ||
    value === 'executive' ||
    value === 'folio' ||
    value === 'artistic'
  )
}

/** 将历史 `spectrum` 规范为 `folio` */
export function normalizeThemeParam(value: string | null | undefined): ResumeThemeId | null {
  if (!value) return null
  if (value === LEGACY_THEME_SPECTRUM) return 'folio'
  if (isResumeThemeId(value)) return value
  return null
}
