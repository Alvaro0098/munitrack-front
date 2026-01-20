import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/login/Login";
import CreateOperador from "../components/Operator/CreateOperator";
import CreateCitizen from "../components/Citizen/CreateCitizen";
import Incidence from "../components/incidenceDetails/Incidence";
import UserNotFound from "../components/usernotfound/UserNotFound";
import CitizenSearch from "../components/Citizen/CitizenSearch";
import ForgotPassword from "../components/forgotPassword/ForgotPassword";
import AreaDetails from "../components/areaDetails/AreaDetails";

const RouterPrincipal = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/operators" element={<CreateOperador />} />
        <Route path="/citizens" element={<CreateCitizen />} />
        <Route path="/incidence" element={<Incidence />} />
        <Route path="/UserNotFound" element={<UserNotFound />} />
        <Route path="/CitizenSearch" element={<CitizenSearch />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />}/>
        <Route path="/AreaDetails" element={<AreaDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterPrincipal;