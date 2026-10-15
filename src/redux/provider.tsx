'use client';

import { store } from './store';
import { Provider } from 'react-redux';
import { Setup } from '../Components/utils';

interface Props {
	children: React.ReactNode;
}

export default function CustomProvider({ children }: Props) {
	return (
		<Provider store={store}>
			<Setup />
			{children}
		</Provider>
	);
}