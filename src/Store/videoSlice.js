import {createSlice} from "@reduxjs/toolkit"

const initialState ={
    status: false,
    videoData: null
}

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers:{

        vdo:(state,action)=>{
            state.status = true,
            state.videoData = action?.payload
        },
        novdo:(state) =>{
            state.status = false,
            state.videoData = null
        }
    }
    
})

export const {vdo, novdo} = videoSlice.actions

export default videoSlice.reducer