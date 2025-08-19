import React from 'react'

const Spinner = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-4 h-4 border-2 border-dashed rounded-full animate-spin border-sky-800'></div>
        </div>
    )
}

export default Spinner;