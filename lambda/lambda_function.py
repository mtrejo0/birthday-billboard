import billboard
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json

def get_top_songs_spotify_ids(date):
    # Billboard chart for Hot 100 songs on the given date
    chart = billboard.ChartData('hot-100', date=date)

    # Spotify API client credentials
    client_id = 'TODO'
    client_secret = 'TODO'
    # Authenticate with Spotify using client credentials
    auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(auth_manager=auth_manager)

    spotify_ids = []

    chart = chart[:1]

    # Iterate over the top 100 songs from Billboard and search for their Spotify ID
    for song in chart:
        query = f'{song.title} {song.artist}'
        results = sp.search(q=query, type='track', limit=1)
        items = results['tracks']['items']
        if items:
            spotify_ids.append(items[0]['id'])

    return spotify_ids


def lambda_handler(event, context):  

    # Example usage
    date = '2023-05-30'
    spotify_ids = get_top_songs_spotify_ids(date)
    print(spotify_ids)

    return {
        'statusCode': 200,
        'body': json.dumps(spotify_ids)
    }
