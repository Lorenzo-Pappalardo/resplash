import { Box } from '@mui/material';
import { getSpecifiedPhoto } from '../../actions/unsplash';
import GoBackButton from './goBackButton';
import LikeButton from './likeButton';

export const dynamicParams = true;

const padding = 2;

const PhotoDetailPage = async ({ params }: PhotoDetailPageProps) => {
  const photoID = (await params).photoID;

  const photo = await getSpecifiedPhoto(photoID);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box padding={padding} alignSelf="start">
        <GoBackButton />
      </Box>
      <img
        src={photo?.urls.full}
        alt={photo?.description ?? photo?.alt_description ?? ''}
        style={{
          objectFit: 'contain',
          height: '100%'
        }}
      />
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
