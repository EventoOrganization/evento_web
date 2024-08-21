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
            Enter your name
          </div>
          <div className="text-xs text-slate-300 mt-2.5">
            Add your name so people can easily find you
            <br />
            and invite you to events
          </div>
          <div className="mt-10">
            <Input
              placeholder="First name"
              size="lg"
              name="firstName"
            />
          </div>
          <div className="mt-6">
            <Input
              placeholder="Last name"
              size="lg"
              name="lastName"
            />
          </div>
          <div className="flex justify-center mt-16">
            <CustomButton size="lg" radius="full" gradient>
              Next
            </CustomButton>
          </div>
          <div className="flex justify-center mt-10">
            <Link href="#" className="text-slate-500">Skip to later</Link>
          </div>
        </div>
      </div>
    </>
  )
}
