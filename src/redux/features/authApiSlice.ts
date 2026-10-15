import { apiSlice } from '../services/apiSlice';

interface User {
	id:string;
	full_name: string;
	username: string;
	role:string;
}

interface SocialAuthArgs {
	provider: string;
	state: string;
	code: string;
}

interface CreateUserResponse {
	success: boolean;
	user: User;
}

const authApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		retrieveUser: builder.query<User, void>({
			query: () => '/users/me/',
		}),
		socialAuthenticate: builder.mutation<
			CreateUserResponse,
			SocialAuthArgs
		>({
			query: ({ provider, state, code }) => ({
				url: `/users/social/${provider}/?state=${encodeURIComponent(
					state
				)}&code=${encodeURIComponent(code)}`,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}),
		}),
		login: builder.mutation({
			query: ({ identifier, password }) => ({
				url: '/users/login/',
				method: 'POST',
				body: { identifier, password },
			}),
		}),
		
		otpRequest: builder.mutation({
			query: ({ identifier }) => ({
				url: '/users/otp/request/',
				method: 'POST',
				body: { identifier },
			}),
		}),
		
		otpLogin: builder.mutation({
			query: ({ identifier, code}) => ({
				url: '/users/otp/login/',
				method: 'POST',
				body: { identifier, code },
			}),
		}),
		register: builder.mutation({
			query: ({
				full_name,
				email,
				username,
				password,
				re_password,
			}) => ({
				url: '/users/register/',
				method: 'POST',
				body: {
					full_name,
					email,
					username,
					password,
					re_password,
				},
			}),
		}),

		verify: builder.mutation({
			query: () => ({
				url: '/users/jwt/verify/',
				method: 'POST',
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: '/users/logout/',
				method: 'POST',
			}),
		}),
		activation: builder.mutation({
			query: ({ uid, token }) => ({
				url: '/users/activation/',
				method: 'POST',
				body: { uid, token },
			}),
		}),
		resetPassword: builder.mutation({
			query: email => ({
				url: '/users/reset_password/',
				method: 'POST',
				body: { email },
			}),
		}),
		resetPasswordConfirm: builder.mutation({
			query: ({ uid, token, new_password, re_new_password }) => ({
				url: '/users/reset_password_confirm/',
				method: 'POST',
				body: { uid, token, new_password, re_new_password },
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useOtpRequestMutation,
	useOtpLoginMutation, 
	useLogoutMutation,


	
	useSocialAuthenticateMutation,
	useRegisterMutation,
	useActivationMutation,
	
	useRetrieveUserQuery,
	useVerifyMutation,

	
	useResetPasswordMutation,
	useResetPasswordConfirmMutation,

} = authApiSlice;