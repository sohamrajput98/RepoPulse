import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard  from './pages/Dashboard';
import FileDetail from './pages/FileDetail';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"            element={<Dashboard />} />
                <Route path="/file/:filePath" element={<FileDetail />} />
            </Routes>
        </BrowserRouter>
    );
}