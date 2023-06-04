import billboard
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json

# Dictionary to store cached song information
songCache = {}

def search_song(query):
    # Check if the song is already cached
    if query in songCache:
        return songCache[query]
    
    # Spotify API client credentials
    client_id = 'TODO'
    client_secret = 'TODO'
    # Authenticate with Spotify using client credentials
    auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(auth_manager=auth_manager)

    # Perform the search
    response = sp.search(q=query, type='track', limit=1)
    
    # Extract and cache the song information
    if response['tracks']['items']:
        song_info = {
            'name': response['tracks']['items'][0]['name'],
            'id': response['tracks']['items'][0]['id'],
            'img': response['tracks']['items'][0]['album']['images'][0]['url']
        }
        songCache[query] = song_info

    return song_info


def get_top_songs(date):
    # Billboard chart for Hot 100 songs on the given date
    chart = billboard.ChartData('hot-100', date=date)

    songs = []

    chart = chart[:10]

    # Iterate over the top 100 songs from Billboard and search for their Spotify ID
    for song in chart:
        query = f'{song.title} {song.artist}'
        song_info = search_song(query)
        songs.append(song_info)

    return songs


def lambda_handler(event, context):  
    date = event["date"]

    songs = get_top_songs(date)

    return {
        'statusCode': 200,
        'body': songs
    }
