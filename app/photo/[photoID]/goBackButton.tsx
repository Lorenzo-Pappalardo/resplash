'use client';

import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const GoBackButton = () => {
  const router = useRouter();

  const handleGoBackButtonClick = () => {
    router.back();
  };

  return (
    <Button variant="text" startIcon={<ArrowBack />} onClick={handleGoBackButtonClick}>
      Go back
    </Button>
  );
};

export default GoBackButton;
