import  { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.svg"; // Ensure logo.svg is inside 'src/assets/'
import FeaturedCars from "./components/FeaturedCars"; // Ensure FeaturedCars.js exists in 'components/'
import PostAd from "./components/PostAd";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPostAd, setShowPostAd] = useState(false);
  const [carAds, setCarAds] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // Check for existing user session on component mount
  useEffect(() => {
    
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin);
      setFormData(userData);
    }
  }, []);

  // Load car ads and inventory from localStorage on component mount
  useEffect(() => {
    const savedAds = localStorage.getItem('carAds');
    const savedInventory = localStorage.getItem('inventory');
    if (savedAds) {
      setCarAds(JSON.parse(savedAds));
    }
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // Handles input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        setIsAuthenticated(true);
        setIsAdmin(user.isAdmin);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        alert("Invalid credentials!");
      }
    } else {
      // Signup logic
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some(u => u.email === formData.email)) {
        alert("Email already registered!");
        return;
      }

      // Create new user (default to non-admin)
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: false
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsAuthenticated(true);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowPostAd(false);
    localStorage.removeItem('user');
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleBackToHome = () => {
    setShowPostAd(false);
  };

  const handlePostAd = (newAd) => {
    const updatedAds = [...carAds, { ...newAd, id: Date.now() }];
    setCarAds(updatedAds);
    localStorage.setItem('carAds', JSON.stringify(updatedAds));
  };

  const handleDeleteAd = (adId) => {
    const updatedAds = carAds.filter(ad => ad.id !== adId);
    setCarAds(updatedAds);
    localStorage.setItem('carAds', JSON.stringify(updatedAds));
  };

  const handleUpdateInventory = (updatedInventory) => {
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  return (
    <div className="App">
      <div className="car-background"></div>

      {/* Header Section */}
      <header className="App-header">
        <div className="logo-container">
          <h1>Premium Cars</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#inventory">Inventory</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            {isAuthenticated && (
              <>
                {!isAdmin && (
                  <li><button onClick={() => setShowPostAd(true)} className="post-ad-button">Post Ad</button></li>
                )}
                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!isAuthenticated ? (
          <div className="split-content">
            {/* Left Section */}
            <div className="left-content">
              <div className="centered-logo">
                <img src={logo} className="App-logo-centered" alt="logo" />
              </div>
              <section className="website-description centered-description">
                <h2>Find Your Dream Car Today</h2>
                <p>
                  Welcome to Premium Cars, your trusted destination for high-quality vehicles.
                  Our expert team is ready to help you find the perfect car.
                </p>
              </section>
            </div>

            {/* Right Section - Authentication Form */}
            <div className="right-content">
              <section className="auth-form-container">
                <div className="auth-form-box">
                  <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                  <form onSubmit={handleSubmit}>
                    {!isLogin && (
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {!isLogin && (
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Login As:</label>
                      <div className="login-type-buttons">
                        <button
                          type="button"
                          className={`login-type-button ${!isAdmin ? 'active' : ''}`}
                          onClick={() => setIsAdmin(false)}
                        >
                          User
                        </button>
                        <button
                          type="button"
                          className={`login-type-button ${isAdmin ? 'active' : ''}`}
                          onClick={() => setIsAdmin(true)}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="auth-button">
                      {isLogin ? "Login" : "Sign Up"}
                    </button>
                  </form>
                  <p className="form-toggle">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={toggleForm} className="toggle-button">
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="authenticated-content">
            {isAdmin ? (
              <AdminPanel
                carAds={carAds}
                inventory={inventory}
                onDeleteAd={handleDeleteAd}
                onUpdateInventory={handleUpdateInventory}
              />
            ) : (
              <>
                {showPostAd ? (
                  <PostAd onBack={handleBackToHome} onSubmit={handlePostAd} />
                ) : (
                  <>
                    <div className="welcome-message">
                      <h2>Welcome, {formData.name || formData.email}!</h2>
                      <p>You are now logged in and can explore our featured cars or post your own ad.</p>
                    </div>
                    <FeaturedCars carAds={carAds} />
                  </>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Premium Cars. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
