import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
// Perhatikan path import di bawah ini, pastikan menuju ke folder features
import { bookApi } from '@/features/books/bookApi'; 

export const useBooksQuery = () => {
  const { searchQuery, selectedCategory, currentPage } = useAppSelector((state) => state.ui);

  return useQuery({
    queryKey: ['books', searchQuery, selectedCategory, currentPage],
    queryFn: () => bookApi.getBooks({
      search: searchQuery,
      category: selectedCategory || undefined,
      page: currentPage,
      limit: 10 // Sesuaikan dengan desain (5 kolom x 2 baris)
    }),
  });
};