import type { Component } from "vue";
import type { ResumeThemeId } from "@/data/resume-themes";
import ResumeThemeClassic from "./ResumeThemeClassic.vue";
import ResumeThemeExecutive from "./ResumeThemeExecutive.vue";
import ResumeThemeFolio from "./ResumeThemeFolio.vue";

/** 与 `ResumeThemeId` 一一对应；改主题只动对应目录下 `.vue` + `.css` */
export const RESUME_THEME_SHELLS: Record<ResumeThemeId, Component> = {
  classic: ResumeThemeClassic,
  executive: ResumeThemeExecutive,
  folio: ResumeThemeFolio,
};
