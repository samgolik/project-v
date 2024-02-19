import React, { useState, useEffect } from 'react';

const App = () => {
  const [token, setToken] = useState(null);
  const [songTitles, setSongTitles] = useState([]);
  const [score, setScore] = useState(0);

  const handleLogin = () => {
    var client_id = '2c2ff72235344ef3be61c2e425f770ac';
    var redirect_uri = 'http://localhost:3000';
    var stateKey = 'state'; // Define the stateKey variable

    var generateRandomString = (length) => {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    var state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope = 'user-read-private user-read-email user-top-read';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location.href = url;
  };

  // const fetchUserData = async (token) => {
  //   const response = await fetch('https://api.spotify.com/v1/me', {
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }

  const fetchTopSongs = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await response.json();
    let titles = [];
    let totalScore = 0;
    data.items.forEach((item) => {
      titles.push(item.name);
      totalScore += item;
      console.log(item);
    });
    let averageScore = totalScore / data.items.length;
    setSongTitles(titles);
    setScore(averageScore);
  }
  

  useEffect(() => {
    var hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce(function (initial, item) {
        if (item) {
          var parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = '';
    var _token = hash.access_token;
    if (_token) {
      setToken(_token);
      fetchTopSongs(_token);
    }
  }, []);

  return (
    <div className="main__wrap">
      <main className="container">
        <div className="card__box">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleLogin}
          >
            Login to Spotify
          </button>
        </div>
        {token && (
          <div>
            <h2>Top Songs:</h2>
            <p>{songTitles}</p>
            <h2>Score:</h2>
            <p>{score}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
