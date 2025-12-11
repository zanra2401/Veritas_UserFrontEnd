// src/App.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import PutusanListPage from "./pages/PutusanListPage";
import PutusanDetailPage from "./pages/PutusanDetailPage";


// Wrapper untuk route public (pakai MainLayout)
function PublicLayoutWrapper() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function App() {
  return (
    <Routes>
      {/* ==== ROUTE PUBLIC (USER BIASA) ==== */}
      <Route element={<PublicLayoutWrapper />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/putusan" element={<PutusanListPage />} />
        <Route path="/putusan/:id" element={<PutusanDetailPage />} />
      </Route>
    </Routes>


  );
}

export default App;
