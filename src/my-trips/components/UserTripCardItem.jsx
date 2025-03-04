import React from 'react'

function UserTripCardItem({trip}) {
  return (
    <div>
      <img src='/placeholder.jpg' 
      className="object-cover rounded-xl"/>
      <div>
        <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-smtext-gray-500 '>{trip?.userSelection.days} Days trip with { trip?.userSelection?.budget} </h2>
      </div>
    </div>
  )
}

export default UserTripCardItem
