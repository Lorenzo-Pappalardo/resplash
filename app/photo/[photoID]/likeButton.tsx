'use client';

import { likePhoto, unlikePhoto } from '@/app/actions/unsplash';
import { Favorite } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useState } from 'react';

const LikeButton = ({ id }: { id?: string }) => {
  const [liked, setLiked] = useState(false);

  const handleClick = async () => {
    if (id !== undefined) {
      if (liked) {
        setLiked(!(await unlikePhoto(id)));
      } else {
        setLiked(await likePhoto(id));
      }
    }
  };

  return (
    <Fab aria-label="like" color="primary" size="medium" onClick={handleClick}>
      <Favorite htmlColor={liked ? 'red' : undefined} />
    </Fab>
  );
};

export default LikeButton;
