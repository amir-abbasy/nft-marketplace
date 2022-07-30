export const addrsSubStr = (addrs, length = 3) => {
  var address = addrs || ''
  if (address == 'NullAddress') return address
  if (address == '') return ''
  return (
    address.substring(0, length + 1) +
    '...' +
    address.substring(address.length - length, address.length)
  )
}
