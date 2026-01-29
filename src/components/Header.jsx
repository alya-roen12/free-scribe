import React from 'react'

export default function Header() {
  return (
        <header className= 'flex justify-between items-center pt-3 px-3'>
            <h1 className='text-xl font-medium'>Free<span className='text-blue-600 bold'>Scribe</span></h1> 
            <div className='flex items-center gap-4 '>
              <a href="https://bmc.link/smoljame"  target= '_blank' className='text-slate-600 cursor-pointer' rel="noreferrer">Donate </a>
          <a href="/" className='flex items center gap-2 specialBtn px-3 py-2 rounded-lg text-blue-400'>
            <p>New</p>
            <i className= "fa-solid fa-plus"></i>

          </a>
          </div>
          </header>
   
  )
}
