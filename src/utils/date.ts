export const todayIso = () => new Date().toISOString().slice(0, 10)

export const formatDate = (value?: string) => {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export const daysUntil = (value?: string) => {
  if (!value) return Number.POSITIVE_INFINITY
  const target = new Date(`${value}T00:00:00`).getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target - today.getTime()) / 86_400_000)
}

export const addDays = (value: string, amount: number) => {
  const d = new Date(`${value}T00:00:00`)
  d.setDate(d.getDate() + amount)
  return d.toISOString().slice(0, 10)
}

export const addMonths = (value: string, amount: number) => {
  const d = new Date(`${value}T00:00:00`)
  d.setMonth(d.getMonth() + amount)
  return d.toISOString().slice(0, 10)
}
