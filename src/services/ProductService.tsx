import { Character } from "../types/Characters";
import { Episode } from "../types/Episodes";

const BASE_URL = 'https://rickandmortyapi.com/api'

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

    getEpisodes: async (episodeUrls: string[]): Promise<Episode[]> => {
        const episodes: Episode[] = [];
        for (const url of episodeUrls) {
            const response = await fetch(url);
            const data = await response.json();
            episodes.push(data);
        }
        return episodes;
    },
};