const axios = require('axios');
const qs = require('qs');

const client_id = '2c2ff72235344ef3be61c2e425f770ac'; // Your client id
const client_secret = 'ba23e0f0f1754487a84b54286a5319d1'; // Your secret
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

const getAuth = async () => {
  try{
    //make post request to SPOTIFY API for access token, sending relavent info
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({'grant_type':'client_credentials'});

    const response = await axios.post(token_url, data, {
      headers: { 
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    })
    //return access token
    return response.data.access_token;
    //console.log(response.data.access_token);   
  }catch(error){
    //on fail, log the error in console
    console.log(error);
  }
}

const getAudioFeatures_Track = async (track_id) => {
  //request token using getAuth() function
  const access_token = await getAuth();
  //console.log(access_token);

  const api_url = `https://api.spotify.com/v1/audio-features/${track_id}`;
  //console.log(api_url);
  try{
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log(response.data);
    return response.data;
  }catch(error){
    console.log(error);
  }  
};

console.log(getAudioFeatures_Track('07A0whlnYwfWfLQy4qh3Tq'));