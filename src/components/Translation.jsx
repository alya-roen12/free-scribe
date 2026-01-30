import React from 'react'
import { FREE_LANGUAGE_CODES } from '../utils/free-translation-api'

export default function Translation(props) {
    const { textElement, toLanguage, translating, setToLanguage, generateTranslation } = props
    
    return (
        <>
            {!translating && (<div className='flex flex-col gap-1 mb-4'>
                <p className='text-xs sm:text-sm font-medium text-slate-500 mr-auto'>To language</p>
                <div className='flex items-stretch gap-2 sm:gap-4' >
                    <select 
                        value={toLanguage} 
                        className='flex-1 outline-none w-full focus:outline-none bg-white duration-200 p-2 rounded' 
                        onChange={(e) => setToLanguage(e.target.value)}
                    >
                        <option value={'Select language'}>Select language</option>
                        {Object.keys(FREE_LANGUAGE_CODES).map((language) => {
                            return (
                                <option key={language} value={language}>{language}</option>
                            )
                        })}
                    </select>
                    <button 
                        onClick={generateTranslation} 
                        className='specialBtn px-3 py-2 rounded-lg text-blue-400 hover:text-blue-600 duration-200'
                        disabled={translating || toLanguage === 'Select language'}
                    >
                        Translate
                    </button>
                </div>
                <p className='text-xs text-slate-400 mt-1'>Using free translation API - No cost!</p>
            </div>)}
            
            {(textElement && !translating) && (
                <div className='bg-white p-4 rounded-lg shadow-sm text-left'>
                    <p className='whitespace-pre-wrap'>{textElement}</p>
                </div>
            )}
            
            {translating && (
                <div className='flex items-center justify-center gap-2 p-4'>
                    <i className="fa-solid fa-spinner animate-spin text-blue-400"></i>
                    <p className='text-blue-400'>Translating for free...</p>
                </div>
            )}
        </>
    )
}