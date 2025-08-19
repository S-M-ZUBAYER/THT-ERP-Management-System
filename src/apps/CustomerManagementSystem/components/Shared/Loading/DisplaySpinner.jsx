import React from 'react'

const DisplaySpinner = () => {
    return (
        <div className='flex justify-center items-center mt-32'>
            <p className='text-7xl font-bold text-[#004368]'>L</p>
            <div className='w-10 h-10 border-8 border-dashed rounded-full animate-spin mt-5 border-blue-400'></div>
            <p className='text-7xl font-bold text-[#004368]'>ading....</p>
        </div>
    )
}

export default DisplaySpinner;