'use client';

import { Button } from '@/components/ui/button';

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  onPreviousAction: () => void;
  onNextAction: () => void;
  isLoading?: boolean;
};

export default function PaginationControls({
  page,
  totalPages,
  totalItems,
  onPreviousAction,
  onNextAction,
  isLoading = false,
}: PaginationControlsProps) {
  return (
    <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row'>
      <p className='text-sm text-gray-300'>
        Page {page} of {totalPages} ({totalItems} results)
      </p>
      <div className='flex gap-2'>
        <Button
          type='button'
          variant='outline'
          onClick={onPreviousAction}
          disabled={isLoading || page <= 1}
          className='border-gray-700 text-gray-100 hover:bg-gray-800'
        >
          Previous
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={onNextAction}
          disabled={isLoading || page >= totalPages}
          className='border-gray-700 text-gray-100 hover:bg-gray-800'
        >
          Next
        </Button>
      </div>
    </div>
  );
}
