export const formattedDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date unavailable'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "'Date unavailable"

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }

  return new Intl.DateTimeFormat('en-EN', options).format(date)
}
