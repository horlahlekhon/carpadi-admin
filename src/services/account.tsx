import { BehaviorSubject } from 'rxjs'
import getConfig from 'next/config'
import Router from 'next/router'
import { fetchWrapper } from '../helpers/fetchWrapper'

const { publicRuntimeConfig } = getConfig()
const baseUrl = `${publicRuntimeConfig.apiUrl}/admins`

const retrieveAccountStats = (yearOnly = true, startDate, endDate) => {
  return fetchWrapper
    .get(
      `${baseUrl}/dashboards/accounts/?filter_year_only=${yearOnly}&start_date=${startDate}&end_date=${endDate}`
    )
    .then((response) => {
      return { status: true, data: response }
    })
    .catch((error) => {
      return { status: false, data: error }
    })
}

export const accountService = {
  retrieveAccountStats
}
