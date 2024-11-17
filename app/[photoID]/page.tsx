import { Favorite } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import { Suspense } from 'react';
import { getSpecifiedPhoto } from '../actions/unsplash';
import GoBackButton from './goBackButton';
import LoadingPhotoSkeleton from './loading';

const PhotoDetailPage = async ({ params }: PhotoDetailPageProps) => {
  const photoID = (await params).photoID;

  const photo = await getSpecifiedPhoto(photoID);

  return (
    <Box>
      <Box position="absolute" top={16} left={16}>
        <GoBackButton />
      </Box>
      <Box padding={4} display="flex" justifyContent="center">
        <Suspense fallback={<LoadingPhotoSkeleton />}>
          <img
            src={photo?.urls.full}
            alt={photo?.description ?? photo?.alt_description ?? ''}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
          />
        </Suspense>
      </Box>
      <Box position="absolute" bottom={16} right={16}>
        <Fab aria-label="like">
          <Favorite />
        </Fab>
      </Box>
    </Box>
  );
};

export default PhotoDetailPage;

interface PhotoDetailPageProps {
  params: Promise<{ photoID: string }>;
}

export async function generateStaticParams() {
  return [];
}
