import React, { useState, useEffect, useRef } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
    const { output, finished } = props
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    const [translating, setTranslating] = useState(null)
    const [error, setError] = useState(null)
    
    console.log('Output:', output)

    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(
                new URL('../utils/translate.worker.js', import.meta.url), 
                { type: 'module' }
            )
        }

        const onMessageReceived = async (e) => {
            console.log('Worker message received:', e.data)
            
            switch (e.data.status) {
                case 'initiate':
                    console.log('DOWNLOADING MODEL')
                    setError(null)
                    break;
                case 'progress':
                    console.log('LOADING MODEL')
                    break;
                case 'update':
                    console.log("Translation chunk received:", e.data.output)
                    break;
                case 'complete':
                    console.log("Translation complete:", e.data.output)
                    setTranslating(false)
                    
                    // Handle different output formats
                    if (Array.isArray(e.data.output)) {
                        // If it's an array of translation objects
                        setTranslation(e.data.output)
                    } else if (e.data.output && e.data.output.translation_text) {
                        // If it's a single translation object
                        setTranslation([e.data.output])
                    } else {
                        // Fallback to setting as is
                        setTranslation(e.data.output)
                    }
                    break;
                case 'error':
                    console.error("Translation error:", e.data.message)
                    setTranslating(false)
                    setError(e.data.message || 'Translation failed')
                    break;
                default:
                    console.log('Unknown status:', e.data.status)
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => worker.current.removeEventListener('message', onMessageReceived)
    }, [])

    // Prepare text element for display
    const textElement = tab === 'transcription' 
        ? output.map(val => val.text).join(' ')
        : (() => {
            if (!translation) return '';
            
            if (Array.isArray(translation)) {
                // Handle array of translation objects
                return translation.map(item => {
                    if (typeof item === 'string') return item;
                    if (item.translation_text) return item.translation_text;
                    return '';
                }).join(' ');
            }
            
            if (typeof translation === 'string') {
                return translation;
            }
            
            if (translation.translation_text) {
                return translation.translation_text;
            }
            
            return '';
        })()

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement("a")
        const file = new Blob([textElement], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `Freescribe_${new Date().toString()}.txt`
        document.body.appendChild(element)
        element.click()
    }

    function generateTranslation() {
        if (translating || toLanguage === 'Select language') {
            return
        }

        console.log('Starting translation to:', toLanguage)
        setTranslating(true)
        setError(null)
        setTranslation(null)

        // Send text to worker
        const textToTranslate = output.map(val => val.text).join(' ')
        
        worker.current.postMessage({
            text: textToTranslate,
            src_lang: 'eng_Latn',
            tgt_lang: toLanguage
        })
    }

    return (
        <main className='flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'>Your <span className='text-blue-400 bold'>Transcription</span></h1>

            <div className='grid grid-cols-2 sm:mx-auto bg-white  rounded overflow-hidden items-center p-1 blueShadow border-[2px] border-solid border-blue-300'>
                <button onClick={() => setTab('transcription')} className={'px-4 rounded duration-200 py-1 ' + (tab === 'transcription' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Transcription</button>
                <button onClick={() => setTab('translation')} className={'px-4 rounded duration-200 py-1  ' + (tab === 'translation' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Translation</button>
            </div>
            
            {/* Error message */}
            {error && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                    <span className='block sm:inline'>{error}</span>
                </div>
            )}

            <div className='my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'>
                {(!finished || translating) && (
                    <div className='grid place-items-center'>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                    </div>
                )}
                {tab === 'transcription' ? (
                    <Transcription {...props} textElement={textElement} />
                ) : (
                    <Translation 
                        {...props} 
                        toLanguage={toLanguage} 
                        translating={translating} 
                        textElement={translation} 
                        setTranslating={setTranslating} 
                        setTranslation={setTranslation} 
                        setToLanguage={setToLanguage} 
                        generateTranslation={generateTranslation} 
                    />
                )}
            </div>
            <div className='flex items-center gap-4 mx-auto '>
                <button onClick={handleCopy} title="Copy" className='bg-white  hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded'>
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button onClick={handleDownload} title="Download" className='bg-white  hover:text-blue-500 duration-200 text-blue-300 px-2 aspect-square grid place-items-center rounded'>
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
        </main>
    )
}