import Image from 'next/image'

interface IAuthWrapper {
  children: React.ReactNode
  imageSrc: string
}

const AuthWrapper: React.FC<IAuthWrapper> = ({ children, imageSrc }) => {
  return (
    <div className='grid lg:grid-cols-2 items-center min-h-screen gap-5 m-auto'>
      <div className=' bg-secondary w-full h-full p-6 centered'>
        <div className='flex flex-col justify-between items-start lg:h-5/6 max-w-screen-md'>
          <Image
            src='/images/logo-light.png'
            alt='logo'
            width={200}
            height={200}
            className='absolute top-10'
          />
          <Image src={imageSrc} alt='logo' width={600} height={450} />
          <p className='lg:w-[330px]'>
            enabling small businesses to manage their payments efficiently.
          </p>
        </div>
      </div>
      <div className='p-6 centered'>{children}</div>
    </div>
  )
}

export default AuthWrapper
