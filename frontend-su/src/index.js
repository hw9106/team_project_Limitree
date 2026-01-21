import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";
import UserProvider from "./context/UserProvider";



const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <UserProvider>
    <App />
  </UserProvider>
);

