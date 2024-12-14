'use client';

import { TablePagination, TablePaginationProps, useMediaQuery } from '@mui/material';
import { useEffect, useRef } from 'react';
import theme from '../theme';

const MobileFriendlyTablePagination = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange
}: TablePaginationProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const paginationRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isMobile && paginationRef.current !== undefined) {
      console.log(paginationRef.current.children[0]);

      const paginationRoot = paginationRef.current.children[0] as HTMLDivElement;
      paginationRoot.style.width = '100%';
      paginationRoot.style.display = 'grid';
      paginationRoot.style.gridTemplateColumns = '1fr 1fr';

      (paginationRoot.children[0] as HTMLDivElement).style.display = 'none';
    }
  }, [isMobile]);

  return (
    <TablePagination
      ref={paginationRef}
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="Photos per page:"
      rowsPerPageOptions={[10, 15, 20, 25, 30]}
    />
  );
};

export default MobileFriendlyTablePagination;
