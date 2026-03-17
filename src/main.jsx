import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

<AuthProvider>
    <App />
</AuthProvider>
);
