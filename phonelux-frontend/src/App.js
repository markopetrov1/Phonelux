import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import GroupedFiltersComponent from "./components/GroupedFiltersComponent/GroupedFiltersComponent";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import SearchFieldComponent from "./components/FiltersComponents/SearchFieldComponent"
import FilterPriceComponent from "./components/FiltersComponents/FilterPriceComponent"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GroupedFiltersComponent/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
