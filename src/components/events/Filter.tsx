import React, { useState } from 'react'
import BackButton from '../ui/BackButton'
import { Button, Checkbox, DatePicker } from '@nextui-org/react'
import CustomButton from '../ui/CustomButton';

export default function Filter() {

  const buttonLabels = [
    '90s Kid',
    'Self Card',
    'Hot Yoga',
    'Writing ',
    'Meditation',
    'Sushi',
    'Hockey',
    'Basketball',
    'Slam Poetry',
    'Home Workout ',
    'Manga',
    'Makeup',
    'Aquarium',
    'Sneakers',
    'Instagram',
    'Hot Springs',
    'Martial Arts',
    'Marvel',
  ];

  const [checkedItems, setCheckedItems] = useState({});

  const handleChange = (label: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      <div className="bg-white h-screen">
        <div className="p-9 w-full max-w-lg mx-auto">
          <div className="flex justify-start items-center mt-16">
            <div className="flex">
              <BackButton />
            </div>
            <div className="mx-auto font-bold p-3">
              <h1 className="text-3xl">Event Filter</h1>
            </div>
          </div>

          <div className="mt-10">
            <span className="text-md mb-1">Date</span>
            <DatePicker
              size="lg"
            />
          </div>

          <div className='mt-10'>
            <span className="text-md mb-1">Interests</span>
            <div className="flex flex-wrap gap-3 items-center">
              {buttonLabels.map(label => (
                <label
                  key={label}
                  className={`flex items-center cursor-pointer px-4 py-2 rounded-full border ${checkedItems[label] ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-300'
                    } hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  onClick={() => handleChange(label)}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checkedItems[label]}
                    onChange={() => handleChange(label)}
                  />
                  <span className="ml-2">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="flex justify-center">
              <CustomButton size="lg" radius="full" gradient>
                Apply
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
