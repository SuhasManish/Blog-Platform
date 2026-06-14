import React from 'react';

function MediaRenderer({ mediaUrl, mediaType }) {
  if (mediaType === 'image') {
    return <img src={mediaUrl} alt="Post media" className="post-media" />;
  }

  if (mediaType === 'video') {
    return (
      <video className="post-media" controls>
        <source src={mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return <div>No media available.</div>;
}

export default MediaRenderer;
