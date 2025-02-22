require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

// Retrieve an access Token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:
// Step 1: Create a Homepage
app.get('/', (req, res) => {
    res.render('home')
})

// Step 2: Display results for artist search
app.get('/artist-search', (req, res) => {
    const newArtist = req.query.query
    spotifyApi
        .searchArtists(newArtist)
        .then(data => {
            const newArtistArray = data.body.artists.items
            res.render('artist-search-result', { newArtistArray })
        })
        .catch(error => console.log('The error while searching artists occurred: ', error))
})

app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))