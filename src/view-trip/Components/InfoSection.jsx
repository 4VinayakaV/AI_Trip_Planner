import { Button } from '@/components/ui/button'
import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoShareOutline } from "react-icons/io5";
import { PHOTO_REF_URL } from '@/service/GlobalApi'; 


function InfoSection({trip}) {

    const [photoURL, setPhotoURL] = useState();

    useEffect(()=>{
        trip&&GetPlacePhoto();
    },[trip])

    const GetPlacePhoto=async()=>{
        const data={
            textQuery:trip?.userSelection?.location?.label
        }
        const result=await GetPlaceDetails(data).then(resp=>{
            console.log(resp.data.places[0].photos[2].name);

            const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[2].name);
            setPhotoURL(PhotoURL);
        })

    }


  return (
    <div>
      <img src={photoURL} className='h-[300pxl] w-full object-cover rounded-xl'/>
     <div className='flex justify-between items-center'>
      <div className='my-5 flex flex-col gap-2 '>
        <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label} </h2>
        <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md' >📅 {trip.userSelection?.days} days</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md' >💰 {trip.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md' >🥂 Number of travellers: {trip.userSelection?.traveller}</h2>
        </div>
      </div>
      <Button><IoShareOutline />
      </Button>
      </div>
    </div>
  )
}

export default InfoSection
