import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { HomePage, homePageLoader } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPostEditor } from './pages/AdminPostEditor';
import { AdminAuthProvider } from './components/AdminAuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BlogStoreProvider } from './utils/BlogStore';
import './App.css';

// Root layout component that provides the AdminAuthProvider context
function RootLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}

// Create the router with data loading support
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homePageLoader,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute>
            <BlogStoreProvider>
              <AdminDashboard />
            </BlogStoreProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/post",
        element: (
          <ProtectedRoute>
            <BlogStoreProvider>
              <AdminPostEditor />
            </BlogStoreProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/post/:id",
        element: (
          <ProtectedRoute>
            <BlogStoreProvider>
              <AdminPostEditor />
            </BlogStoreProvider>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
