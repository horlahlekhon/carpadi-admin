import React from 'react'
import { parseISO, format } from 'date-fns'

 export function DateParse({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'd LLLL yyyy')}</time>
}
export function TimeParse({dateString}) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'hh:mm')}</time>
}
