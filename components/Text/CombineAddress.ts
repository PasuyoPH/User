import { AddressData } from 'app-types/src/address'

const combineAddress = (address: AddressData) => {
  console.log(address)

  return [address.landmark ?? '', address.text]
    .join(' ')
    .trim()
}

export default combineAddress