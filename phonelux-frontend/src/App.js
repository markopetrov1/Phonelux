import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomepageComponent from "./components/HomepageComponent"
import PhonePageComponent from "./components/PhonePageComponent";
import LoginPageComponent from "./components/LoginPageComponent"
import RegisterPageComponent from "./components/RegisterPageComponent";
import PhoneOfferDetailsComponent from "./components/PhoneOfferDetailsComponent/PhoneOfferDetailsComponent";




function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomepageComponent/>}/> 
        <Route path="/login" element={<LoginPageComponent/>}/>
        <Route path="/register" element={<RegisterPageComponent/>}/> 
        <Route path="/phones/:phoneId" element={<PhonePageComponent/>} />
        <Route path="/phoneoffer/:offerId" element={<PhoneOfferDetailsComponent/>} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
