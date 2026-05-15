export type ResumeThemeId = 'classic' | 'executive' | 'folio' | 'modular'

/** 旧版主题 id，读取 URL / localStorage 时自动映射为 `folio` */
export const LEGACY_THEME_SPECTRUM = 'spectrum' as const

/** 已移除的艺术主题，读取 URL / localStorage 时映射为 `classic` */
export const LEGACY_THEME_ARTISTIC = 'artistic' as const

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
    id: 'modular',
    label: '简线',
    hint: '双栏 + 顶栏头像、技能标签、工作经历时间线；独立版式（ResumeModularContent）',
  },
] as const

export function isResumeThemeId(value: string): value is ResumeThemeId {
  return (
    value === 'classic' ||
    value === 'executive' ||
    value === 'folio' ||
    value === 'modular'
  )
}

/** 将历史 `spectrum` 规范为 `folio` */
export function normalizeThemeParam(value: string | null | undefined): ResumeThemeId | null {
  if (!value) return null
  if (value === LEGACY_THEME_SPECTRUM) return 'folio'
  if (value === LEGACY_THEME_ARTISTIC) return 'classic'
  if (isResumeThemeId(value)) return value
  return null
}
