"use client";
import React, { Input, Switch, Card, Avatar, Checkbox, Button } from '@nextui-org/react';
import SearchIcon from '@/components/icons/SearchIcon';

export default function AddGuestsTab() {
  return (
    <>
      <div className="">
        <div className="text-center font-bold">
          {/* <h1 className="text-xl">Add Guests</h1> */}
        </div>
        <div className="flex items-center bg-white mt-4 p-3 rounded-md">
          <SearchIcon />
          <Input
            type="text"
            placeholder="Search"
            size="lg"
          />
        </div>
        <div className="flex my-5">
          <div className="flex-1">
            <label htmlFor="toggle-switch" className="text-gray-700 text-sm font-bold">
              Allow guests to invite their friends?
            </label>
          </div>
          <div className="flex-none">
            <Switch id="toggle-switch" />
          </div>
        </div>
        <div className="my-5">
          <Card className="w-full p-4">
            <div className="flex items-center">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                alt="joeclark"
                className="mr-4 w-20 h-20 text-large"
              />
              <div>
                <span className="text-gray-800">
                  joeclark
                </span>
              </div>
              <div className="ml-auto">
                <Checkbox size="lg"></Checkbox>
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card className="w-full p-4">
            <div className="flex items-center">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                alt="joeclark"
                className="mr-4 w-20 h-20 text-large"
              />
              <div>
                <span className="text-gray-800">
                  joeclark
                </span>
              </div>
              <div className="ml-auto">
                <Checkbox size="lg"></Checkbox>
              </div>
            </div>
          </Card>
        </div>
      </div >
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
        <div className="flex justify-center">
          <Button radius="full" className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm" size="lg">
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}
