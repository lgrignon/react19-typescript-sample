
import { Component, useEffect, useState } from 'react';

interface Pokemon {
    name: string;
    url: string;
    index: number;
    imageUrl: string;
}

export function PokeList() {

    const [pokemons, setPokemons] = useState<Pokemon[]>([]);

    async function loadPokemons() {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20')
        const result = (await response.json()) as { results: Pokemon[] };

        const pokemons: Pokemon[] = result.results.map(pokemon => {

            pokemon.index = parseInt(pokemon.url.substring(pokemon.url.lastIndexOf('/', pokemon.url.length - 2) + 1, pokemon.url.length - 1));
            return { ...pokemon, imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.index}.png` };
        });
        setPokemons(pokemons);
    }

    useEffect(() => {
        console.log("load pokes")
        loadPokemons();
    }, []);

    return (<div>
        {pokemons.map(pokemon => (
            <div key={pokemon.name}>
                <img src={pokemon.imageUrl} style={{verticalAlign: 'middle'}} />
                <a href={pokemon.url}>{pokemon.name}</a></div>
        ))}
    </div>)
}
