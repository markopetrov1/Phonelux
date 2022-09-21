import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomepageComponent from "./components/HomepageComponent"
import PhonePageComponent from "./components/PhonePageComponent";
import LoginPageComponent from "./components/LoginPageComponent"
import RegisterPageComponent from "./components/RegisterPageComponent";
import PhoneOfferDetailsComponent from "./components/PhoneOfferDetailsComponent/PhoneOfferDetailsComponent";
import { UserProvider } from "./context/UserContext";
import UserFavouriteOffersComponent from "./components/UserFavouriteOffersComponent/UserFavouriteOffersComponent";
import SuperAdminComponent from "./components/SuperAdminComponent/SuperAdminComponent";
import EditOfferComponent from "./components/EditOfferComponent/EditOfferComponent";
import CompareOffersComponent from "./components/CompareOffersComponent/CompareOffersComponent";
import SpecificationsFilterComponent from "./components/FiltersComponents/SpecificationsFilterComponent";



function App() {  
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomepageComponent/>}/> 
        <Route path="/login" element={<LoginPageComponent/>}/>
        <Route path="/register" element={<RegisterPageComponent/>}/> 
        <Route path="/phones/:phoneId" element={<PhonePageComponent/>} />
        <Route path="/phoneoffer/:offerId" element={<PhoneOfferDetailsComponent/>} />
        <Route path="/user/:userId/favouriteoffers" element={<UserFavouriteOffersComponent/>} />
        <Route path="/management/users" element={<SuperAdminComponent/>}/>
        <Route path="/admin/editoffer/:offerId" element={<EditOfferComponent/>}/>
        <Route path="/compareoffers" element={<CompareOffersComponent/>}/>
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;
