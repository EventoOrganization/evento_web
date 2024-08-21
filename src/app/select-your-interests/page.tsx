import BackButton from '@/components/ui/BackButton'
import CustomButton from '@/components/ui/CustomButton'
import React, { Image, Link, Checkbox } from "@nextui-org/react";

export default function page() {
  const list = [
    {
      title: "Yoga",
      img: "https://citigym.com.vn/storage/uploads/screenshot-2020-12-23-164801.jpg",
    },
    {
      title: "Wellness",
      img: "https://media.glamourmagazine.co.uk/photos/65662415ecea75020943ba76/2:3/w_852,h_1278,c_limit/DIRTY-WELLNESS-281123-DIRTY-WELLNESS2.jpg",
    },
    {
      title: "Meditation",
      img: "https://w0.peakpx.com/wallpaper/509/220/HD-wallpaper-mahatma-buddha-meditating-mahatma-buddha-buddha-meditating-lord-buddha-thumbnail.jpg",
    },
    {
      title: "Techno Music",
      img: "https://cdn.wallpapersafari.com/74/33/lqJOkw.jpg",
    },
    {
      title: "Live Music",
      img: "https://img.freepik.com/free-photo/electric-guitar-still-life_23-2151376374.jpg",
    },
    {
      title: "Jazz",
      img: "https://i.pinimg.com/550x/5b/7c/62/5b7c625534cb9c478fa5a09d13e8f819.jpg",
    },
    {
      title: "Classical Music",
      img: "https://png.pngtree.com/thumb_back/fh260/background/20230926/pngtree-playing-a-violin-in-blue-light-with-a-clock-and-music-image_13315506.jpg",
    },
    {
      title: "Yoga",
      img: "https://citigym.com.vn/storage/uploads/screenshot-2020-12-23-164801.jpg",
    },
    {
      title: "Wellness",
      img: "https://media.glamourmagazine.co.uk/photos/65662415ecea75020943ba76/2:3/w_852,h_1278,c_limit/DIRTY-WELLNESS-281123-DIRTY-WELLNESS2.jpg",
    },
    {
      title: "Meditation",
      img: "https://w0.peakpx.com/wallpaper/509/220/HD-wallpaper-mahatma-buddha-meditating-mahatma-buddha-buddha-meditating-lord-buddha-thumbnail.jpg",
    },
    {
      title: "Techno Music",
      img: "https://cdn.wallpapersafari.com/74/33/lqJOkw.jpg",
    },
    {
      title: "Live Music",
      img: "https://img.freepik.com/free-photo/electric-guitar-still-life_23-2151376374.jpg",
    },
    {
      title: "Jazz",
      img: "https://i.pinimg.com/550x/5b/7c/62/5b7c625534cb9c478fa5a09d13e8f819.jpg",
    },
    {
      title: "Classical Music",
      img: "https://png.pngtree.com/thumb_back/fh260/background/20230926/pngtree-playing-a-violin-in-blue-light-with-a-clock-and-music-image_13315506.jpg",
    },
  ];
  return (
    <>
      <div className='bg-white h-screen'>
        <div className="p-9 w-full mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">
            Select your interests
          </div>
          <div className="text-xs text-slate-300 mt-2.5">
            To discover in person and online events tailored for you.
          </div>
          <div className="mt-10">
            <div className="lg:columns-6 md:columns-4 sm:columns-3 columns-3">
              {list.map((item, index) => (
                <div key={index} className="relative break-inside-avoid mb-5">
                  <Image
                    alt={item.title}
                    className="rounded-lg"
                    src={item.img}
                    width="100%"
                    height="auto"
                  />
                  <Checkbox
                    color="secondary"
                    size="lg"
                    className="absolute top-2 right-0 z-10"
                  />
                  <div className="text-center">
                    <span className="text-xs">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
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
