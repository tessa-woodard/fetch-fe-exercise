import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [breedFilter, setBreedFilter] = useState('');
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState([]);

  // Fetch breed options on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(
          'https://frontend-take-home-service.fetch.com/dogs/breeds',
          {
            withCredentials: true,
          }
        );
        setBreeds(response.data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  // Fetch dog data based on the current filter and page
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        // Fetch dog IDs based on the current filter and pagination
        const searchResponse = await axios.get(
          'https://frontend-take-home-service.fetch.com/dogs/search',
          {
            params: {
              breeds: breedFilter ? [breedFilter] : [],
              size: 25,
              from: page * 25,
              sort: 'breed:asc',
            },
            withCredentials: true,
          }
        );

        const dogIds = searchResponse.data.resultIds;

        if (dogIds.length > 0) {
          // Fetch detailed dog information
          const dogsResponse = await axios.post(
            'https://frontend-take-home-service.fetch.com/dogs',
            dogIds,
            {
              withCredentials: true,
            }
          );
          setDogs(dogsResponse.data);
        } else {
          setDogs([]);
        }
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, [breedFilter, page]);

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const generateMatch = async () => {
    try {
      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        favorites,
        {
          withCredentials: true,
        }
      );
      const matchId = response.data.match;
      alert(`You have been matched with dog ID: ${matchId}`);
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };

  return (
    <div>
      <h2>Search for Dogs</h2>

      {/* Filter by breed */}
      <select
        onChange={(e) => setBreedFilter(e.target.value)}
        value={breedFilter}
      >
        <option value="">All breeds</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      {/* Display the dog results */}
      <div>
        {dogs.length > 0 ? (
          dogs.map((dog) => (
            <div
              key={dog.id}
              style={{
                marginBottom: '20px',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <img
                src={dog.img}
                alt={dog.name}
                style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
              />
              <h3>
                {dog.name} ({dog.breed})
              </h3>
              <p>Age: {dog.age}</p>
              <p>Zip Code: {dog.zip_code}</p>
              <button onClick={() => toggleFavorite(dog.id)}>
                {favorites.includes(dog.id) ? 'Unfavorite' : 'Favorite'}
              </button>
            </div>
          ))
        ) : (
          <p>No dogs found.</p>
        )}
      </div>

      {/* Pagination and match button */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
        <button onClick={generateMatch} disabled={favorites.length === 0}>
          Generate Match
        </button>
      </div>
    </div>
  );
};

export default Search;
