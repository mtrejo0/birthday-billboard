import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading');
  const [songs, setSongs] = useState<any[]>([]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setLoadingText('Loading');

      const response = await axios.post(
        'https://ttjg79x010.execute-api.us-east-2.amazonaws.com/dev',
        {
          date: selectedDate,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      console.log(data);

      setSongs(data.body);

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setLoadingText((prevText) => prevText + '.');
      }, 1000);
    } else {
      setLoadingText('Loading');
    }

    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  const handleShareTwitter = () => {
    const maxCharacters = 280; // Maximum character limit for a tweet
    const maxSongNameLength = Math.floor((maxCharacters - 14) / 5); // Assuming each character takes 4 bytes (including special characters)
    
    const cappedSongsText = songs
      .slice(0, 5)
      .map((song, index) => `${index + 1}. ${song.name.substring(0, maxSongNameLength)}`)
      .join('%0A');
    
    const tweetUrl = encodeURIComponent(window.location.href);
    const tweetText = `Check out the top billboard songs on my birthday!%0A%0A${cappedSongsText}%0A%0A${tweetUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '100vh', background: '#000', color: '#fff', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Discover your Birthday Billboard!</h1>
      <p>Enter your birthday:</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]} // Set max attribute to the previous day's date
          style={{ marginRight: '0.5rem', padding: '6px' }}
        />
        <button type="submit" style={{ backgroundColor: '#1da1f2', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
          Submit
        </button>
      </form>

      {loading && (
        <div style={{ marginTop: '1rem' }}>
          <p>{loadingText}</p>
          <p>(This may take up to 30 seconds)</p>
        </div>
      )}

      {songs?.length > 0 && !loading && (
        <div>
          <button style={{ marginTop: '1rem', backgroundColor: '#1da1f2', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }} onClick={handleShareTwitter}>
            Share on Twitter
          </button>
          <p>Top 10 songs on your birthday:</p>
          {songs.map((song, i) => (
            <div key={song.id} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
              <p style={{ marginRight: '1rem' }}>#{i + 1} </p>
              <iframe src={`https://open.spotify.com/embed/track/${song.id}`} width="100%" height="80" frameBorder="0" allow="encrypted-media" title={song.name}></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
