// import ListGroup from "./ListGroup"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login/login"
import Register from "./components/Register/Register"
import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom"


export default function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to ="/Login"/>}/>
          {/* <Route path="/" element={<Login/>}/> */}
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </>
  )
}


