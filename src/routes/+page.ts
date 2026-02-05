import type { PageLoad } from './$types';
import { editions } from '$lib/data/datasource';

export const load: PageLoad = () => {
	return {
		editions
	};
};