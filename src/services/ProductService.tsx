import { Character } from "../types/Characters";

const BASE_URL = 'https://rickandmortyapi.com/api'

// export const ProductService = {
//     getProducts: async (): Promise<Character[]> => {
//         const response = await fetch(`${BASE_URL}/character/`);
//         const data = await response.json();
//         return data.results;
//         },
//     // getProduct: async (id: number): Promise<ProductDetail> => {
//     //     const response = await fetch(`${BASE_URL}/character/results/${id}`);
//     //     const data = await response.json();
//     //     console.log(response,'vaalxxxxe')

//     //     return data;
//     //     },
// };
export const ProductService = {
    getProducts: async (page: number): Promise<{ characters: Character[]; pageInfo: { count: number; pages: number; next: string | null; prev: string | null; } }> => {
        const response = await fetch(`${BASE_URL}/character/?page=${page}`);
        const data = await response.json();
        return {
            characters: data.results,
            pageInfo: {
                count: data.info.count,
                pages: data.info.pages,
                next: data.info.next,
                prev: data.info.prev
            }
        };
    },
};