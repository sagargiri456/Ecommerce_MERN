import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Component/layout/Header";
import Footer from "./Component/layout/Footer";
import Home from "./Component/Home";
import ProductDetails from "./Component/products/ProductDetails";
import "./App.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/search/:keyword" element={<Home />} exact />
            <Route path="/product/:id" element={ProductDetails} exact />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
