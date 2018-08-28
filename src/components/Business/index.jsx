import React from 'react'
import Loadable from 'react-loadable'
import Loading from '../_common/Loading'

const Page = Loadable({
  loading: Loading,
  loader: () => import('./Page')
})
const Create = Loadable({
  loading: Loading,
  loader: () => import('./Create')
})
const Audience = Loadable({
  loading: Loading,
  loader: () => import('./Audience')
})
const Settings = Loadable({
  loading: Loading,
  loader: () => import('./Settings')
})
const Finances = Loadable({
  loading: Loading,
  loader: () => import('./Finances')
})
// const Index = Loadable({
//   loading: Loading,
//   loader: () => import('./Business')
// })

export { default as Business } from './Business'
// export const Business = () => <Index />
export const BusinessPage = () => <Page />
export const BusinessAudience = () => <Audience />
export const BusinessCreate = () => <Create />
export const BusinessSettings = () => <Settings />
export const BusinessFinances = () => <Finances />

