import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    authUser: null,
    tenantId: "",
    tenantName: "",
    count: 0,
    employeeId: '',
    roles: [],
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser= action.payload
    },
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload;
    },
    setTenantId: (state, action) => {
      state.tenantId = action.payload
    },
    setCount: (state, action) => {
      state.count = action.payload
    },
    setRoles: (state, action) => {
      state.roles = action.payload
    },
    setTenantName: (state, action) => {
      state.tenantName = action.payload;
    }
  }
});

export const { setAuthUser, setTenantId, setCount, setRoles, setEmployeeId, setTenantName} = loginSlice.actions;

export const setAuthUserAsync = user => dispatch => {
  dispatch(setAuthUser(user));
};


export const setEmployeeIdAsync = employeeId => dispatch => {
  dispatch(setEmployeeId(employeeId))
}

export const setTenantIdAsync = tenantId => dispatch => {
  dispatch(setTenantId(tenantId));
};

export const setTenantNameAsync = tenantName => dispatch => {
  dispatch(setTenantName(tenantName));
}

export const setRolesAsync = rolesArr => dispatch => {
  dispatch(setRoles(rolesArr));
};

export default loginSlice.reducer;
