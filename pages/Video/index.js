import { useState, useEffect } from 'react';
import  './video.module.css';

function HomePage() {
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    async function fetchVideoData() {
      try {
        const response = await fetch('http://localhost:1337/api/video?populate=*', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`, // Replace with your actual token
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }

        const data = await response.json();
        setVideoData(data);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    }

    fetchVideoData();
  }, []);

  return (
    <div >
      {videoData && (
        <div>
        <div className="video-container">
      
       
          <video loop autoPlay style={{objectFit:"fill"}} width="1350" height="400" controls muted>
            <source src={videoData.data.attributes.play.data.attributes.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
