import { AddressData } from 'app-types/src/address'

const combineAddress = (address: AddressData) => {
  return [address.landmark ?? '', address.text]
    .join(' ')
    .trim()
}

export default combineAddress