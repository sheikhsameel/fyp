import React, { useState } from 'react';

const AdminSignup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    position: '',
    phoneNumber: '',
    verificationCode: ''
  });

  const [step, setStep] = useState(1); // Step 1: Initial form, Step 2: Email verification
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      // Here you would typically:
      // 1. Send the admin registration request to your backend
      // 2. Backend would verify the details and send verification email
      // 3. Move to verification step
      console.log('Sending registration request:', formData);
      setStep(2);
      setError('');
    } else {
      // Handle verification code submission
      // Here you would typically verify the code with your backend
      console.log('Verifying code:', formData.verificationCode);
      // If verification successful, close the form and notify parent
      onClose();
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-box">
        <h2>Admin Registration</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
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
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
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
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="verificationCode">Enter Verification Code</label>
              <p className="verification-info">
                Please check your email for the verification code we just sent.
              </p>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {step === 1 ? 'Continue' : 'Verify & Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup; 