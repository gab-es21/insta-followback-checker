import './App.css';
import { MainPane } from './components/MainPane';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <MainPane />
    </div>
  );
}

export default App;
