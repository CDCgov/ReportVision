export const makeSafeForID = (name: string): string => {
    return name.replace(/[^a-z0-9]/g, function replaceName(s) {
      const c = s.charCodeAt(0)
      if (c === 32) return '-'
      if (c >= 65 && c <= 90) return `img_${s.toLowerCase()}`
      return `__${c.toString(16).slice(-4)}`
    })
  }