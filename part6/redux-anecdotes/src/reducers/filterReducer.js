import React from 'react'
import { createSlice } from '@reduxjs/toolkit';



/* const filterReducer = (state = '', action) => {

    console.log('action.payload IS CURRENTLY :>> ', action.payload);
  switch (action.type) {
    case 'SET_FILTER':
        return action.payload
    default:
        return state
  }
}

export const filterChange = (filter) => {

    return {
        type: 'SET_FILTER',
        payload: filter,
    }
} */


const filterSlice = createSlice({
    name: 'filter',
    initialState: "",
    reducers: {
        filterAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const {filterAnecdotes} = filterSlice.actions
export default filterSlice.reducer
