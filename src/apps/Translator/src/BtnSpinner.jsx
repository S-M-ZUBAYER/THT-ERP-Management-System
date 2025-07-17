import React from 'react'

const BtnSpinner = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <p className="text-cyan-500 text-2xl">L</p>
            <div className='w-4 h-4 border-2 border-dashed rounded-full animate-spin border-yellow-300'></div>
            <p className="text-cyan-500 text-2xl">ading...</p>
        </div>
    )
}

export default BtnSpinner;