import { transactions as mockData } from './transactions'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {

  async getTransactions() {
    await delay(800)
    return [...mockData]
  },

}