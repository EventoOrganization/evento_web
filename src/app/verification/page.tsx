import BackButton from '@/components/ui/BackButton'
import CustomButton from '@/components/ui/CustomButton'
import { Input, Link } from '@nextui-org/react'
import React from 'react'

export default function page() {
  return (
    <>
      <div className='bg-white h-screen'>
        <div className="p-9 w-full max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">
            Verification
          </div>
          <div className="text-xs text-slate-300 mt-2.5">
            Enter the 4 digit code that was sent to your e-mail
          </div>
          <div className="mt-10">OTP</div>
          <div className="mt-4 flex space-x-4 justify-between">
            <Input
              className="w-16"
              size="lg"
              name=""
            />
            <Input
              className="w-16"
              size="lg"
              name=""
            />
            <Input
              className="w-16"
              size="lg"
              name=""
            />
            <Input
              className="w-16"
              size="lg"
              name=""
            />
          </div>
          <div className="mt-8 flex justify-center">
            Haven't received the code ? <Link href="#" className="ml-1">Resend code</Link>
          </div>
          <div className="flex justify-center mt-8">
            <CustomButton size="lg" radius="full" gradient>
              Next
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  )
}
