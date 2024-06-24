import { RxCheckCircled } from 'react-icons/rx'

interface AuthSuccessProps {
  message?: string
}

export const AuthSuccess = ({ message }: AuthSuccessProps) => {
  if (!message) return null

  return (
    <div className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-md text-emerald-500'>
      <RxCheckCircled className='h-5 w-5' />
      <p>{message}</p>
    </div>
  )
}
