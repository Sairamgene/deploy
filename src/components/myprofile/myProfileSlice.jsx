import { createSlice } from '@reduxjs/toolkit';

export const myProfileReducer = createSlice({
  name: 'myprofile',
  initialState: {
    profile: null,
    profileImageURL: ''
  },
  reducers: {
    setEmployeeProfile: (state, action) => {
      state.profile = { ...action.payload}
    },
    setFirebaseProfileURL: (state, action) => {
      console.log('setFirebaseProfileURL', action.payload);
      state.profileImageURL = action.payload;
    }
  }
});

export const { setEmployeeProfile, setFirebaseProfileURL } = myProfileReducer.actions;

export const setEmployeeProfileAsync = employee => dispatch => {
  dispatch(setEmployeeProfile(employee));
};

export const setFirebaseProfileImageURLAsync = imageURL => dispatch => {
  dispatch(setFirebaseProfileURL(imageURL));
}


export default myProfileReducer.reducer;
