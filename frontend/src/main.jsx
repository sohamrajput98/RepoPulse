import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// EXTEND THIS FUNCTION: wrap App in a global error boundary and a theme
// provider once the styling and dark-mode support are implemented
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);