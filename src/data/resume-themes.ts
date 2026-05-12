export type ResumeThemeId = 'classic' | 'executive' | 'spectrum'

export const RESUME_THEME_STORAGE_KEY = 'my-profile-resume-theme'

export const RESUME_THEMES: readonly {
  id: ResumeThemeId
  label: string
  hint: string
}[] = [
  { id: 'classic', label: '经典', hint: '当前默认：青绿侧栏 + 双色标题条' },
  { id: 'executive', label: '商务', hint: '冷灰配色；侧栏略窄、内边距更紧' },
  {
    id: 'spectrum',
    label: '光谱',
    hint: '双栏简历式：左深色侧栏白字，右白底技能；底栏影响力浅灰分割',
  },
] as const

export function isResumeThemeId(value: string): value is ResumeThemeId {
  return value === 'classic' || value === 'executive' || value === 'spectrum'
}
