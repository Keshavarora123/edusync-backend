import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { FaLock, FaEnvelope, FaUserGraduate, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './AuthStyles.css'; // We'll create this for shared auth styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error } = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError(error || 'Failed to log in');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Login component rendering');
  
  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="auth-card shadow-lg" style={{
              border: 'none',
              borderRadius: '15px',
              overflow: 'hidden',
            }}>
              <div className="auth-card-header" style={{
                background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
                color: 'white',
                padding: '2rem 2rem 1.5rem',
                textAlign: 'center',
              }}>
                <h2 className="mb-1">Welcome Back!</h2>
                <p className="mb-0" style={{ opacity: 0.9 }}>Sign in to continue to EduSync</p>
              </div>
              
              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="border-0" style={{ 
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    color: '#dc3546',
                    borderLeft: '3px solid #dc3546',
                    borderRadius: '0',
                  }}>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit} className="mt-4">
                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent" style={{ borderRight: 'none' }}>
                        <FaEnvelope className="text-muted" />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        className="py-3"
                        style={{
                          borderLeft: 'none',
                          borderColor: '#e0e0e0',
                          borderRadius: '0 8px 8px 0',
                        }}
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent" style={{ borderRight: 'none' }}>
                        <FaLock className="text-muted" />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="py-3"
                        style={{
                          borderLeft: 'none',
                          borderColor: '#e0e0e0',
                          borderRadius: '0 8px 8px 0',
                        }}
                      />
                    </div>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="rememberMe" />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#6a11cb' }}>
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button 
                    disabled={loading} 
                    className="w-100 py-3 mb-3" 
                    type="submit"
                    style={{
                      background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #5a0cb3 0%, #1a65e0 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <span className="me-2">Sign In</span>
                    )}
                    <FaArrowRight />
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-decoration-none" style={{ color: '#6a11cb', fontWeight: '600' }}>
                        Sign Up
                      </Link>
                    </p>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-muted mb-2">Or sign in with</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Button variant="outline-secondary" className="rounded-circle p-3" style={{ borderColor: '#e0e0e0' }}>
                        <i className="fab fa-google"></i>
                      </Button>
                      <Button variant="outline-primary" className="rounded-circle p-3" style={{ borderColor: '#e0e0e0' }}>
                        <i className="fab fa-facebook-f"></i>
                      </Button>
                      <Button variant="outline-info" className="rounded-circle p-3" style={{ borderColor: '#e0e0e0' }}>
                        <i className="fab fa-twitter"></i>
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4">
              <p className="text-white mb-0" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                © {new Date().getFullYear()} EduSync. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
