import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../components/app/appSlice';
import loginReducer from '../components/login/loginSlice';
import myProfileReducer from '../components/myprofile/myProfileSlice';

export default configureStore({
  reducer: {
    app: appReducer,
    auth: loginReducer,
    employee: myProfileReducer
  },
});
