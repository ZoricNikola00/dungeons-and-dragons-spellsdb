import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../hooks/spellHooks'
import { getAllSpells } from './spellSlice'
import { RingLoader } from 'react-spinners'
import Pagination from '../../components/Pagination'
const letters=['#','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Z']

const Spells = () => {
    const [letter, setLetter]=useState('#')
    const [query, setQuery]=useState('')
    const [header, setHeader]=useState('All Spells')
    const [currentPage, setCurrentPage]=useState(1)
    const [spellsPerPage,setSpellsPerPage]=useState(50)

    const nav=useNavigate()
    const {spells, isLoading}=useAppSelector(state=>state.spells)
    const dispatch=useAppDispatch()

    useEffect(()=>{
        dispatch(getAllSpells({letter,query}))
    },[letter])

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
        setLetter('#')
        setCurrentPage(1)
        dispatch(getAllSpells({letter,query}))
        setHeader(`Your search word was: ${query}`)
    }

    const letterClick=(letter:string)=>{
        setQuery('');
        setLetter(letter);
        setHeader(letter==='#'?'All spells':`All spells on letter: ${letter}`);
        setCurrentPage(1)
    }

    if(isLoading){
        return <RingLoader color='#666633' size={150} className='my-[200px] w-[full] mx-auto'/>
    }

    const indexOfLastSpell = currentPage*spellsPerPage
    const indexOfFirstSpell = indexOfLastSpell - spellsPerPage
    const currentSpells = spells.slice(indexOfFirstSpell, indexOfLastSpell)

  return (
    <div className='w-[90%] md:w-[80%] mx-auto mt-[100px]'>
        <div className='my-[20px] flex flex-wrap justify-center w-full text-white'>
            {letters.map((lett,i)=><div key={i} onClick={()=>letterClick(lett)} className='text-lg py-1 px-2 rounded font-bold transition duration-300 cursor-pointer hover:bg-[#666633]/60'>{lett}</div>)}
        </div>
        <form onSubmit={handleSubmit} className='w-[200px] mx-auto relative'>
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='Search for spell...' className='w-full p-2 outline-none rounded bg-[#666633]/60 text-white' type='text' />
            <button type='submit' className='text-white absolute translate-y-[-50%] top-[50%] right-1'><FaSearch /></button>
        </form>
        <h1 className='text-center text-white text-4xl my-[20px]'>{header}</h1>
        <div className='flex flex-wrap justify-center gap-4 w-full my-10'>
            {currentSpells.map((spell)=>(
                <div key={spell.index} onClick={()=>nav(`/spells/${spell.index}`)} className='text-white font-semibold cursor-pointer hover:scale-110 tranisiton duration-500 bg-green-300/30 rounded-lg p-4'>
                    {spell.name}
                </div>
            ))}
        </div>
        <Pagination spellsPerPage={spellsPerPage} totalSpells={spells.length} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
    </div>
  )
}

export default Spells