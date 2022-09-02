import { createSlice } from '@reduxjs/toolkit';

export const appReducer = createSlice({
  name: 'app',
  initialState: {
    colorScheme: 'light'
  },
  reducers: {
    setColorScheme: (state) => {
      state.colorScheme = state.colorScheme === 'light' ? 'dark' : 'light'
      
    }
  }
});

export const { setColorScheme} = appReducer.actions;

export const toggleColorSchemeAction = () => dispatch => {
  dispatch(setColorScheme());
};



export default appReducer.reducer;
