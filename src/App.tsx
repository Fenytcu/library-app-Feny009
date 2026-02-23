import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import LandingPage from './pages/LandingPage';
import ComingSoonPage from './pages/ComingSoonPage';
import HomePage from './pages/HomePage';
import AuthorDetailsPage from './pages/AuthorDetailsPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import BookDetailPage from './pages/BookDetailPage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import { Toaster } from 'sonner';
import ReviewsPage from './pages/ReviewsPage';
import MyBorrowedList from './pages/BorrowedList';

import AdminBookList from '@/pages/admin/AdminBookList';
import CreateBook from '@/pages/admin/CreateBook';
import UserList from '@/pages/admin/UserList';
import BorrowedList from '@/pages/admin/BorrowedList';
import AdminBorrowedListPage from '@/pages/admin/AdminBorrowedListPage';
import AdminUserPage from '@/pages/admin/AdminUserPage';
import AdminBookListPage from '@/pages/admin/AdminBookListPage';
import AdminBookDetailPage from '@/pages/admin/AdminBookDetailPage';
import AdminEditBookPage from '@/pages/admin/AdminEditBookPage';
import AuthorList from '@/pages/admin/authors/AuthorList';
import CreateAuthor from '@/pages/admin/authors/CreateAuthor';
import CategoryList from '@/pages/admin/categories/CategoryList';
import CreateCategory from '@/pages/admin/categories/CreateCategory';
import AdminLayout from './layouts/AdminLayout';
import { AdminRoute } from './components/AdminRoute';

import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster position='top-center' richColors />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/coming-soon' element={<ComingSoonPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          {/* Standalone admin panel pages (own layout) */}
          <Route
            path='/admin/borrowed-list'
            element={<AdminBorrowedListPage />}
          />
          <Route path='/admin/user-list' element={<AdminUserPage />} />
          <Route path='/admin/book-list' element={<AdminBookListPage />} />
          <Route
            path='/admin/book-list/detail/:id'
            element={<AdminBookDetailPage />}
          />
          <Route
            path='/admin/book-list/create'
            element={<AdminEditBookPage />}
          />
          <Route
            path='/admin/book-list/edit/:id'
            element={<AdminEditBookPage />}
          />
          {/* Legacy admin panel with sidebar layout */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='books' element={<AdminBookList />} />
            <Route path='books/create' element={<CreateBook />} />
            <Route path='books/edit/:id' element={<CreateBook />} />
            <Route path='authors' element={<AuthorList />} />
            <Route path='authors/create' element={<CreateAuthor />} />
            <Route path='authors/edit/:id' element={<CreateAuthor />} />
            <Route path='categories' element={<CategoryList />} />
            <Route path='categories/create' element={<CreateCategory />} />
            <Route path='categories/edit/:id' element={<CreateCategory />} />
            <Route path='users' element={<UserList />} />
            <Route path='borrowed' element={<BorrowedList />} />
            <Route index element={<Navigate to='/admin/books' replace />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<HomePage />} />
          <Route path='/books/:id' element={<BookDetailPage />} />
          <Route path='/authors/:id' element={<AuthorDetailsPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/profile/update' element={<UpdateProfilePage />} />
          <Route path='/my-loans' element={<MyBorrowedList />} />
          <Route path='/my-reviews' element={<ReviewsPage />} />
          <Route path='/category/:name' element={<CategoryPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/checkout/success' element={<CheckoutSuccessPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
