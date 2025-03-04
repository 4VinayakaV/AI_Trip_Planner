import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-80 gap-9'>
    <h1
      className='font-extrabold text-[50pxl] text-center mt-16'
      >
        <span className='text-[#f56551]'>Discover your next adventure with AI:</span> Personalized iteneraries at your fingertips</h1>
        <p className='text-xl text-gray-500 text-center'>
            Your personal trip planner and travel curator, creating custom itneraies tailored to your insterests and budget.
        </p>
        <Link to={'/Create-trip'}>
        <Button>Get Started, It's Free</Button>
        </Link>
    </div>
  )
}

export default Hero
