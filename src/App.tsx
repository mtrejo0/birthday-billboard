import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true); // Set loading to true before making the request

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
      console.log(data); // Output the response data to the console

      setSongs(data.body);

      setLoading(false); // Set loading back to false after receiving the response
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); // Set loading back to false in case of error
    }
  };
  const handleShareTwitter = () => {
    const songsText = songs.slice(0, 4).map((song, index) => `${index + 1}. ${song.name}`).join('%0A');
  
    
    const tweetUrl = encodeURIComponent(window.location.href);

    const tweetText = `Check out the top 4 songs on my Birthday Billboard!%0A${songsText}%0A%0A${tweetUrl}`;
  
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  
    window.open(twitterUrl, '_blank');
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Discover your Bithday Billboard!</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Select a date: </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <button type="submit">Submit</button>
      </form>
      {loading && <div style={{ marginTop: '1rem' }}>Loading...</div>}

      {songs?.length > 0 && !loading && (
  <div style={{ marginTop: '2rem' }}>
    <button style={{ marginTop: '1rem' }} onClick={handleShareTwitter}>Share on Twitter</button>
    {songs.map((song) => (
      <div key={song.id} style={{ marginTop: '1rem' }}>
        <iframe
          src={`https://open.spotify.com/embed/track/${song.id}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          title={song.name}
        ></iframe>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default App;
