import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Book } from '@/types/book';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
}: BookDetailModalProps) {
  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Book Details</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Cover Image */}
          <div className='md:col-span-1'>
            <div className='aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-100 border'>
              <img
                src={book.coverImage}
                alt={book.title}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Details */}
          <div className='md:col-span-2 space-y-4'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>{book.title}</h2>
              <p className='text-lg text-gray-600 italic'>
                by {book.author.name}
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Badge variant='secondary' className='bg-blue-50 text-blue-700'>
                {book.category.name}
              </Badge>
              <Badge variant='outline'>{book.publishedYear}</Badge>
              <Badge
                variant={book.availableCopies > 0 ? 'default' : 'destructive'}
              >
                {book.availableCopies > 0
                  ? `${book.availableCopies} Available`
                  : 'Out of Stock'}
              </Badge>
            </div>

            <div className='flex items-center gap-4 py-2'>
              <div className='flex items-center text-yellow-500'>
                <Star className='w-5 h-5 fill-current' />
                <span className='ml-1 font-bold text-lg'>
                  {book.rating || 0}
                </span>
              </div>
              <div className='text-gray-400'>|</div>
              <div className='text-gray-600'>{book.reviewCount} Reviews</div>
              <div className='text-gray-400'>|</div>
              <div className='text-gray-600'>
                {book.totalCopies} Total Copies
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='font-semibold mb-2'>Description</h3>
              <p className='text-gray-700 leading-relaxed'>
                {book.description}
              </p>
            </div>

            <div>
              <h3 className='font-semibold mb-2'>ISBN</h3>
              <p className='text-gray-600 font-mono'>{book.isbn}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section (Placeholder if empty based on request) */}
        <div className='mt-8'>
          <Separator className='mb-4' />
          <h3 className='font-semibold text-lg mb-4'>Reviews</h3>
          {book.reviews && book.reviews.length > 0 ? (
            <div className='space-y-4'>
              {book.reviews.map((_, idx) => (
                <div key={idx} className='p-4 bg-gray-50 rounded-lg'>
                  <p>{/* Render review content here if structure known */}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 italic'>No reviews yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
