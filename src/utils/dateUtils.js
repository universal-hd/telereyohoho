export const formatDate = (dateStr) => {
  if (!dateStr) return ''

  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  const hour = dateStr.substring(9, 11)
  const minute = dateStr.substring(11, 13)
  const second = dateStr.substring(13, 15)

  const utcDate = new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    )
  )

  return utcDate.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
}

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return ''

  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  const hour = dateStr.substring(9, 11)
  const minute = dateStr.substring(11, 13)
  const second = dateStr.substring(13, 15)

  const commentDate = new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    )
  )
  const now = new Date()
  const diffInSeconds = Math.floor((now - commentDate) / 1000)

  if (diffInSeconds < 60) {
    return 'только что'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${getMinutesWord(diffInMinutes)} назад`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${getHoursWord(diffInHours)} назад`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${getDaysWord(diffInDays)} назад`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${getWeeksWord(diffInWeeks)} назад`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${getMonthsWord(diffInMonths)} назад`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} ${getYearsWord(diffInYears)} назад`
}

const getMinutesWord = (minutes) => {
  if (minutes % 10 === 1 && minutes % 100 !== 11) return 'минуту'
  if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) return 'минуты'
  return 'минут'
}

const getHoursWord = (hours) => {
  if (hours % 10 === 1 && hours % 100 !== 11) return 'час'
  if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) return 'часа'
  return 'часов'
}

const getDaysWord = (days) => {
  if (days % 10 === 1 && days % 100 !== 11) return 'день'
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня'
  return 'дней'
}

const getWeeksWord = (weeks) => {
  if (weeks % 10 === 1 && weeks % 100 !== 11) return 'неделю'
  if ([2, 3, 4].includes(weeks % 10) && ![12, 13, 14].includes(weeks % 100)) return 'недели'
  return 'недель'
}

const getMonthsWord = (months) => {
  if (months % 10 === 1 && months % 100 !== 11) return 'месяц'
  if ([2, 3, 4].includes(months % 10) && ![12, 13, 14].includes(months % 100)) return 'месяца'
  return 'месяцев'
}

const getYearsWord = (years) => {
  if (years % 10 === 1 && years % 100 !== 11) return 'год'
  if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return 'года'
  return 'лет'
}
