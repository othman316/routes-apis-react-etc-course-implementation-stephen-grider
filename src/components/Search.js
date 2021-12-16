import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Search = () => {
    
    const [term, setTerm] = useState('books')
    const [debouncedTerm, setDebouncedTerm] = useState(term)
    const [ results, setResults] = useState([])
    
    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            setDebouncedTerm(term)
        },500)
        
        return () =>{
            clearTimeout(timeoutId)
        }

    }, [term])
    
    useEffect(()=>{
        if(debouncedTerm){
               const search = async () =>{
                    const {data} = await axios.get('https://en.wikipedia.org/w/api.php', {
                        params: {
                            action: 'query',
                            list: 'search',
                            origin: '*',
                            format: 'json',
                            srsearch: debouncedTerm
                        }
                    })
                    
                    setResults(data.query.search)
                };
                search()
        }else{
            setResults([])
        }

    }, [debouncedTerm])
    
    const renderedResults = results.map(result =>{
        return(
            <div key={result.pageid} className='item'>
                <div className='right floated content'>
                    <a rel="noreferrer" target='_blank' href={`https://en.wikipedia.org?curid=${result.pageid}`} className='ui button'>Go</a>
                </div>
                <div className='content'>
                    <div className='header'>
                        {result.title}
                    </div>
                    <span dangerouslySetInnerHTML={{__html:result.snippet}}></span>
                </div>
            </div>
        )
    })

    return (
        <div className='ui container' > 
        <br />
            <div className='ui form'>
                <div className='ui field'>
                    <label>Enter Search Term</label>
                    <input
                        value={term}
                        onChange={ e => setTerm(e.target.value)}
                        className='input'
                    />
                </div>
            </div>
            <div className='ui celled list'>
                {renderedResults}
            </div>
        </div>
    )
}

export default Search
