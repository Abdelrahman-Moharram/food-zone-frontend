import { createSlice } from '@reduxjs/toolkit';
import Cookies from "js-cookie"
const colormode = Cookies.get('colormode') || 'light'
// const isAuthenticated = Cookies.get('access_token') ? true : false

interface restaurantType{
	id	 : string,
	name : string,
}

const emptyUser = {
	id			: '',
	username	: '',
	full_name	: '',
	email		: '',
	role		: '',
	restaurant	: undefined,
	permissions	: []
}
interface user {
    id			: string;
	full_name	: string;
	email		: string;
	username	: string;
	role		: string;
	permissions	: string[];
	restaurant?	: restaurantType;
}
interface AuthState {
	isAuthenticated	: boolean;
	isLoading		: boolean;
	colormode		: string;
    user			: user,
}

const initialState = {
    isAuthenticated	: false,
	isLoading		: true,
    user			: emptyUser,
	colormode		: colormode
} as AuthState;

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth: (state, action) => {
			if(action.payload)
			{
				
				if(!state.isAuthenticated)
					state.isAuthenticated = true;
				state.user = action.payload
			}
			if(state.isLoading)
				state.isLoading = false
		},
		changeColorMode: (state)=>{
			Cookies.set('colormode', state.colormode === 'light'?'dark':'light') 
			state.colormode = state.colormode === 'light'?'dark':'light'
		},
		setLogout: state => {
			
			Cookies.remove('access_token')
			Cookies.remove('refresh_token')
			Cookies.remove('access')
			Cookies.remove('refresh')
			state.user = emptyUser

			if(state.isAuthenticated)
				state.isAuthenticated = false;
			if(state.isLoading)
				state.isLoading = false;

		},
		finishInitialLoad: state => {
			state.isLoading = false;
		},
	},
});

export const { setAuth, setLogout, finishInitialLoad, changeColorMode } = authSlice.actions;
export default authSlice.reducer;