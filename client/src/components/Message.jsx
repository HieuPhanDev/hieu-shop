const Message = ({ variant, children }) => {
  let mes
  switch (variant) {
    case 'success':
      mes = 'bg-green-100 text-green-800'
      break
    case 'error':
      mes = 'bg-red-100 text-red-800'
      break
    default:
      mes = 'bg-blue-100 text-blue-800'
  }
  return <div className={`p-4 rounded ${mes}`}>{children}</div>
}

export default Message
