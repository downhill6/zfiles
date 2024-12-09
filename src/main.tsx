import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layout";
import { Home } from "./pages/home";
import { Room } from "./pages/room";
import { ThemeProvider } from "#/src/components/theme-provider";

import "./global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider defaultTheme="light">
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/room" element={<Room />} />
                        <Route path="/room/:roomId" element={<Room />} />
                    </Route>
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
);
