import Admin from "./components/Admin/Admin";
import { MyContextProvider } from "./components/Context/Admincontext";
function App() {
  return (
    <MyContextProvider>
    <Admin/>
    </MyContextProvider>
  );
}

export default App;
