import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import GroupedFiltersComponent from "./components/GroupedFiltersComponent/GroupedFiltersComponent";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import InputFormComponent from "./components/LoginRegisterComponents/InputFormComponent";
import LoginFormComponent from "./components/LoginRegisterComponents/LoginFormComponent";
import RegisterFormComponent from "./components/LoginRegisterComponents/RegisterFormComponent";
import PaginationComponent from "./components/PaginationComponent/PaginationComponent"
import PhoneCardComponent from "./components/PhoneCardComponent/PhoneCardComponent";
import PhoneCardGridComponent from "./components/PhoneCardGridComponent/PhoneCardGridComponent";
import HomepageComponent from "./components/HomepageComponent"
import PhonePageComponent from "./components/PhonePageComponent";
import SortByComponent from "./components/FiltersComponents/SortByComponent";
import LoginPageComponent from "./components/LoginPageComponent"
import RegisterPageComponent from "./components/RegisterPageComponent";



function App() {  
  return (
    <BrowserRouter>
      <Routes>
        {/* { <Route path="/" element={<PhoneCardComponent 
        image_url='https://admin.ledikom.mk/uploads/items/411/1641668143apple-iphone-13-pro-max-1-250x300-pad.jpg?v=1'
        model='Apple iPhone 13 Pro Max' price='75000'/>}/> } */}
        <Route path="/" element={<HomepageComponent/>}/> 
        <Route path="/login" element={<LoginPageComponent/>}/>
        <Route path="/register" element={<RegisterPageComponent/>}/> 
        <Route path="/phones/:phoneId" element={<PhonePageComponent/>} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
