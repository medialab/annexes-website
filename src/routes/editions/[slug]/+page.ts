import type { PageLoad } from './$types';
import { editions } from '$lib/data/datasource';

export const load: PageLoad = ({ params }) => {
    const correctEdition = editions.find((edition) => edition.name === params.slug);
    return {
        correctEdition
    };
};