import { Box } from '@mui/material';
import { Suspense } from 'react';
import { getSpecifiedPhoto } from '../../actions/unsplash';
import GoBackButton from './goBackButton';
import LikeButton from './likeButton';
import LoadingPhotoSkeleton from './loading';

export const dynamicParams = true;

const padding = 2;

const PhotoDetailPage = async ({ params }: PhotoDetailPageProps) => {
  const photoID = (await params).photoID;

  const photo = await getSpecifiedPhoto(photoID);

  return (
    <Box display="flex" flexDirection="column" overflow="hidden">
      <Box padding={padding} alignSelf="start">
        <GoBackButton />
      </Box>
      <Box display="flex" justifyContent="center">
        <Suspense fallback={<LoadingPhotoSkeleton />}>
          <img
            src={photo?.urls.full}
            alt={photo?.description ?? photo?.alt_description ?? ''}
            style={{
              height: `calc(85vh - (${padding * 4} * var(--mui-spacing)))`
            }}
          />
        </Suspense>
      </Box>
      <Box padding={padding} alignSelf="end">
        {photo !== undefined && <LikeButton id={photo.id} />}
      </Box>
    </Box>
  );
};

export default PhotoDetailPage;

interface PhotoDetailPageProps {
  params: Promise<{ photoID: string }>;
}
