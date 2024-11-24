import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const customToastSuccess = (text: string) => {
  return toast.success(text, {
    autoClose: 1500,
  })
}

export const customToastError = (text: string) => {
  return toast.error(text, {
    autoClose: 1500,
  })
}
