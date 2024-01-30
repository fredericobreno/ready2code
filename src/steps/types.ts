export type Step = {
  install: (options: Record<string, string>) => Promise<void>
  configure: (options: Record<string, string>) => Promise<void>
}
