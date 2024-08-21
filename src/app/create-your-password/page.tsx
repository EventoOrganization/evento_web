import BackButton from '@/components/ui/BackButton'
import CustomButton from '@/components/ui/CustomButton'
import { Input, } from '@nextui-org/react'
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
            Create your password
          </div>
          <div className="text-xs text-slate-300 mt-2.5">
            A strong password at play, keeps the hackers at bay!
          </div>
          <div className="mt-10">
            <Input
              placeholder="Password"
              size="lg"
              name="password"
            />
          </div>
          <div className="mt-6">
            <Input
              placeholder="Comfirm Password"
              size="lg"
              name="comfirmPassword"
            />
          </div>
          <div className="flex justify-center mt-16">
            <CustomButton size="lg" radius="full" gradient>
              Next
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  )
}
