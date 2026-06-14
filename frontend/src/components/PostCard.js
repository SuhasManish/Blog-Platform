import React from 'react';
import { Link } from 'react-router-dom';
import MediaRenderer from './MediaRenderer';

function PostCard({ post }) {
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p>{post.description}</p>

      {/* Render the media using the MediaRenderer component */}
      {post.mediaUrl && (
        <MediaRenderer mediaUrl={post.mediaUrl} mediaType={post.mediaType} />
      )}

      <Link to={`/post/${post.id}`} className="view-post-btn">View Post</Link>
    </div>
  );
}

export default PostCard;
