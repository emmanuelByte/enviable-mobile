import AsyncStorage from '@react-native-community/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logOut } from '../api/userApi';

const initialState = {
  value: null,
  status: false,
}
const logUserOut = createAsyncThunk(
  'users/logout',
  async (userId, thunkAPI) => {
    await AsyncStorage.removeItem('customer').then(()=>{
      return true;
    })
    .catch((error)=>{
      thunkAPI.rejectWithValue(false);
    });

    // return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers:{
    [logUserOut.fulfilled]: (state, action) =>{
      state.value = null;
      state.status = false
    }
  },
  reducers: {
    setUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      console.log("Updated User")
      state.value = action.payload.user;
      state.status = action.payload.status
    },
    logOutUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // AsyncStorage.removeItem('customer')
      // logOut
      // state.value = null;
      // state.status = false
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, decrement, incrementByAmount } = userSlice.actions;
export {logUserOut};
export default userSlice.reducer