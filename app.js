require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/" , (req, res, next) => res.render('index'));

app.get("/artist-search", (req,res,next)=>{
  spotifyApi
  .searchArtists(req.query.spotify)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    res.render("artist-search-result.hbs",{artist: data.body.artists.items
     })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));


})


app.get('/albums/:artistId', (req, res, next) => {
  let idArtist = req.params.artistId
  spotifyApi.getArtistAlbums(idArtist)
    .then(
    function(data) {
      // console.log('Artist albums', data.body.items[0]);
      let artistName = data.body.items[0].artists[0].name
      res.render("albums.hbs",{albums: data.body.items, artistName
      })
    },
    function(err) {
      console.error(err);
    }
  );


});

app.get('/albums/tracks/:albumId', (req, res, next) => {
  let idAlbum = req.params.albumId
  
  
  spotifyApi.getAlbumTracks(idAlbum, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body.items);
    res.render("tracks.hbs", {tracks: data.body.items})

  }, function(err) {
    console.log('Something went wrong!', err);
  });


});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
