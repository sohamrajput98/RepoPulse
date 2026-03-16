import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard  from './pages/Dashboard';
import FileDetail from './pages/FileDetail';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/"               element={<Dashboard />} />
                <Route path="/file/:filePath" element={<FileDetail />} />
            </Routes>
        </HashRouter>
    );
}