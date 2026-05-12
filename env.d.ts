/// <reference types="vite/client" />

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '@/config/ppt-manifest.json' {
  const manifest: {
    icons: {
      contact: string[]
      skillSections: string[]
      influence: string | null
      headerWorkTeal: string | null
      headerEarlyPurple: string | null
      headerCertPurple: string | null
    }
  }
  export default manifest
}
