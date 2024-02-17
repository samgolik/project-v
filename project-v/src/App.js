/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

function App() {
  const CLIENT_ID = "2c2ff72235344ef3be61c2e425f770ac"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-top-read"
  const API_BASE_URL = "https://api.spotify.com/v1"

  const [token, setToken] = useState("")
  const [userProfile, setUserProfile] = useState(null)
  const [topSongs, setTopSongs] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

    // Fetch user profile and top songs when token is available
    if (token) {
      fetchUserProfile(token)
      fetchTopSongs(token)
    }

    
  }, [token]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      } else {
        console.error('Failed to fetch user profile:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchSongData = async (token, track_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/audio-features/${track_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log(data)
      } else {
        console.error('Failed to fetch song data:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching song data:', error)
    }
  }

  const fetchTopSongs = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/me/top/tracks?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTopSongs(data.items)
        
        fetchSongData(token, data.items[0].id)
      } else {
        console.error('Failed to fetch top songs:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching top songs:', error)
    }
  }

  
  

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    setUserProfile(null)
    setTopSongs([])
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
          :
          <>
            <button onClick={logout}>Logout</button>
            {userProfile && (
              <div>
                <h2>User Profile</h2>
                <p>Display Name: {userProfile.display_name}</p>
                <p>Email: {userProfile.email}</p>
                {/* Display other profile information as needed */}
              </div>
            )}
            {topSongs.length > 0 && (
              <div>
                <h2>Top 10 Songs</h2>
                <ul>
                  {topSongs.map((song, index) => (
                    <li key={index}>{song.name} - {song.artists.map(artist => artist.name).join(', ')}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        }
      </header>
    </div>
  );
}

export default App;
