import React from 'react'

const Filter = ({isSearching, handleisSearchingChange}) => {
  return (
    <div>
        filter shown with
        <input value={isSearching} onChange={handleisSearchingChange}/>
    </div>
  )
}

export default Filter
