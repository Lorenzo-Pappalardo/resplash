'use client';

import { likePhoto, unlikePhoto } from '@/app/actions/unsplash';
import useGlobalStore from '@/app/state';
import { Favorite } from '@mui/icons-material';
import { Box, Fab, Tooltip } from '@mui/material';
import { useState } from 'react';

const LikeButton = ({ id }: { id?: string }) => {
  const { authenticated } = useGlobalStore();
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
    <Tooltip
      title="Login to like"
      placement="left"
      disableFocusListener={authenticated}
      disableHoverListener={authenticated}
      disableInteractive={authenticated}
      disableTouchListener={authenticated}>
      {/* The Box below is necessary for the Tooltip to be able to listen to events and open accordingly */}
      <Box>
        <Fab
          aria-label="like"
          color="primary"
          size="medium"
          onClick={handleClick}
          disabled={!authenticated}>
          <Favorite htmlColor={liked ? 'red' : undefined} />
        </Fab>
      </Box>
    </Tooltip>
  );
};

export default LikeButton;
