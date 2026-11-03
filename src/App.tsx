import Dashboard from "./pages/dashboard";
import MainLayout from "./layout/main";

function App() {
  return (
    <MainLayout activeHref="/">
      <Dashboard />
    </MainLayout>
  );
}

export default App;
