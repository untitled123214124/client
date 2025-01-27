import Layout from './components/common/Layout'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from './pages/Main';
import Board from './pages/Board';
import NewPost from './pages/NewPost';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import ViewPost from './pages/ViewPost';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/boards/:boardId/posts' element={<Board />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/newpost' element={<NewPost />} />
          <Route path="/auth/github/callback" element={<AuthCallback />} />
          <Route path="/board/:postId" element={<ViewPost />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
