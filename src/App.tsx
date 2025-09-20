import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

function App() {
    return(
        <div className="app-container">
            <nav>
              <h1>PIB Conéctar</h1>
              <ul>
                <li>
                  <NavLink to="/chart" className={({ isActive }) => isActive ? "active" : ""}>CHART</NavLink>
                </li>
                <li>
                  <NavLink to="/table" className={({ isActive }) => isActive ? "active" : ""}>TABLE</NavLink>
                </li>
              </ul>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default App;