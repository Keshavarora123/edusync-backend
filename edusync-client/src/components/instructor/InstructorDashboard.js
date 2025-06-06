import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Badge, Dropdown, Nav } from 'react-bootstrap';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBookOpen,
  FaCalendarAlt,
  FaPlus,
  FaBell,
  FaUserTie,
  FaCog,
  FaChevronDown,
  FaChartLine,
  FaFileAlt,
  FaClipboardCheck,
  FaSignOutAlt,
  FaQuestionCircle,
  FaCogs,
  FaTachometerAlt
} from 'react-icons/fa';
import CreateCourseForm from './CreateCourseForm';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/DashboardStyles.css';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New submission for Web Development Assignment', time: '15 min ago', read: false },
    { id: 2, text: 'Student question in Data Structures', time: '1 hour ago', read: true },
    { id: 3, text: 'New course enrollment request', time: '3 hours ago', read: false },
  ]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingGrading: 0,
    courseRating: 0
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  
  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get the current user from localStorage
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not authenticated');
      }
      
      const user = JSON.parse(userJson);
      const token = user?.token;
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Fetch all courses for the instructor
      const [activeCoursesResponse, allCoursesResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5109/api'}/Courses/ByInstructor/${user.userId}?activeOnly=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5109/api'}/Courses/ByInstructor/${user.userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      if (!activeCoursesResponse.ok || !allCoursesResponse.ok) {
        throw new Error('Failed to fetch courses data');
      }
      
      const [activeCourses, allCourses] = await Promise.all([
        activeCoursesResponse.json(),
        allCoursesResponse.json()
      ]);
      
      setStats(prevStats => ({
        ...prevStats,
        activeCourses: activeCourses.length || 0
      }));
      
      setCourses(allCourses);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="content-wrapper">
          <Alert variant="danger" className="shadow">
            <Alert.Heading>Error Loading Dashboard</Alert.Heading>
            <p className="mb-3">{error}</p>
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}>
        <div className="container-fluid">
          <button 
            className="navbar-toggler me-3" 
            type="button" 
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="d-flex align-items-center">
            <h1 className="dashboard-title mb-0">
              {getGreeting()}, <span className="gradient-text">Prof. {currentUser?.name?.split(' ')[0] || 'Instructor'}</span>
            </h1>
          </div>
          
          <div className="ms-auto d-flex align-items-center">
            <div className="me-4 text-end d-none d-md-block">
              <div className="text-white-50 small">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-white fw-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <Dropdown className="me-3" align="end">
              <Dropdown.Toggle variant="transparent" className="position-relative p-0 border-0">
                <FaBell className="text-white fs-5" />
                {unreadNotifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadNotifications}
                  </span>
                )}
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="dropdown-menu-end shadow" style={{ minWidth: '300px' }}>
                <Dropdown.Header className="d-flex justify-content-between align-items-center">
                  <span>Notifications</span>
                  <Badge bg="primary" pill>{unreadNotifications} New</Badge>
                </Dropdown.Header>
                <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <Dropdown.Item 
                        key={notification.id} 
                        className={`py-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="d-flex">
                          <div className="me-3">
                            <div className="icon-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                              <FaBell size={14} />
                            </div>
                          </div>
                          <div>
                            <div className="small text-gray-500">{notification.time}</div>
                            <span className="font-weight-bold">{notification.text}</span>
                          </div>
                        </div>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item className="text-center py-3 text-muted">
                      No new notifications
                    </Dropdown.Item>
                  )}
                </div>
                <Dropdown.Divider />
                <Dropdown.Item className="text-center text-primary" onClick={clearAllNotifications}>
                  Clear all notifications
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="transparent" 
                className="d-flex align-items-center text-white p-0 border-0"
              >
                <div className="avatar-circle me-2" style={{ background: 'linear-gradient(135deg, #283593 0%, #1a237e 100%)' }}>
                  {currentUser?.name?.charAt(0).toUpperCase() || 'I'}
                </div>
                <div className="d-none d-md-block me-2">
                  <div className="fw-medium">Prof. {currentUser?.name?.split(' ')[0] || 'Instructor'}</div>
                  <div className="small text-white-50">Instructor</div>
                </div>
                <FaChevronDown className="text-white-50" />
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="dropdown-menu-end shadow">
                <Dropdown.Item as={Link} to="/instructor/profile">
                  <FaUserTie className="me-2" /> My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/instructor/settings">
                  <FaCog className="me-2" /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
      
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h3 className="text-center mb-0">EduSync</h3>
            <div className="text-center small text-muted">Instructor Portal</div>
          </div>
          
          <div className="sidebar-menu">
            <Nav className="flex-column">
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor" 
                  className={`d-flex align-items-center ${location.pathname === '/instructor' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaTachometerAlt className="me-3" />
                  </div>
                  <span className="menu-text">Dashboard</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/courses"
                  className={`d-flex align-items-center ${location.pathname.startsWith('/instructor/courses') ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaBookOpen className="me-3" />
                  </div>
                  <span className="menu-text">My Courses</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/students"
                  className={`d-flex align-items-center ${location.pathname === '/instructor/students' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaUsers className="me-3" />
                  </div>
                  <span className="menu-text">Students</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/assignments"
                  className={`d-flex align-items-center ${location.pathname === '/instructor/assignments' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaFileAlt className="me-3" />
                  </div>
                  <span className="menu-text">Assignments</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/grades"
                  className={`d-flex align-items-center ${location.pathname === '/instructor/grades' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaClipboardCheck className="me-3" />
                  </div>
                  <span className="menu-text">Gradebook</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/analytics"
                  className={`d-flex align-items-center ${location.pathname === '/instructor/analytics' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaChartLine className="me-3" />
                  </div>
                  <span className="menu-text">Analytics</span>
                </Nav.Link>
              </Nav.Item>
              
              <div className="sidebar-divider my-3"></div>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/settings"
                  className={`d-flex align-items-center ${location.pathname === '/instructor/settings' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaCogs className="me-3" />
                  </div>
                  <span className="menu-text">Settings</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/help"
                  className="d-flex align-items-center"
                >
                  <div className="icon-wrapper">
                    <FaQuestionCircle className="me-3" />
                  </div>
                  <span className="menu-text">Help & Support</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          
          <div className="sidebar-footer">
            <Button 
              variant="outline-light" 
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="main-content">
          <div className="content-wrapper">
            {/* Stats Overview */}
            <div className="row mb-4">
              <div className="col-md-6 col-xl-3 mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="icon-circle bg-light text-primary d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                      <FaUsers size={24} />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Students</h6>
                      <h4 className="mb-0">{stats.totalStudents}</h4>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6 col-xl-3 mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="icon-circle bg-light text-success d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                      <FaBookOpen size={24} />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Active Courses</h6>
                      <h4 className="mb-0">{stats.activeCourses}</h4>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6 col-xl-3 mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="icon-circle bg-light text-warning d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                      <FaFileAlt size={20} />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Pending Grading</h6>
                      <h4 className="mb-0">{stats.pendingGrading}</h4>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6 col-xl-3 mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="icon-circle bg-light text-info d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                      <FaChartLine size={20} />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Course Rating</h6>
                      <h4 className="mb-0">{stats.courseRating.toFixed(1)} <small className="text-muted">/ 5.0</small></h4>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
            
            {/* Courses Section */}
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Courses</h5>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setShowCreateCourse(true)}
                    className="d-flex align-items-center me-2"
                  >
                    <FaPlus className="me-1" /> Create Course
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={fetchDashboardData}
                    title="Refresh courses"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : courses.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {courses.map(course => (
                      <div key={course.id} className="col">
                        <Card className="h-100 course-card">
                          <div 
                            className="card-img-top" 
                            style={{
                              height: '120px',
                              background: 'linear-gradient(135deg, #283593 0%, #1a237e 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '2rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {course.name.charAt(0).toUpperCase()}
                          </div>
                          <Card.Body>
                            <Card.Title>{course.name}</Card.Title>
                            <Card.Text className="text-muted small">
                              {course.description || 'No description available'}
                            </Card.Text>
                            <div className="d-flex justify-content-between align-items-center">
                              <Badge bg={course.isActive ? 'success' : 'secondary'}>
                                {course.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowCourseModal(true);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <FaBookOpen size={48} className="text-muted" />
                    </div>
                    <h5>No courses found</h5>
                    <p className="text-muted">Get started by creating your first course</p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowCreateCourse(true)}
                    >
                      <FaPlus className="me-2" /> Create Course
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            {/* Create Course Modal */}
            <Modal 
              show={showCreateCourse} 
              onHide={() => setShowCreateCourse(false)}
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Create New Course</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CreateCourseForm 
                  onSuccess={() => {
                    setShowCreateCourse(false);
                    fetchDashboardData();
                  }}
                />
              </Modal.Body>
            </Modal>
            
            {/* Course Details Modal */}
            <Modal
              show={showCourseModal}
              onHide={() => setShowCourseModal(false)}
              size="lg"
            >
              {selectedCourse && (
                <>
                  <Modal.Header closeButton>
                    <Modal.Title>{selectedCourse.name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <p className="text-muted mb-1">Course Code</p>
                        <p>{selectedCourse.code || 'N/A'}</p>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Status</p>
                        <Badge bg={selectedCourse.isActive ? 'success' : 'secondary'}>
                          {selectedCourse.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <p className="text-muted mb-1">Description</p>
                      <p>{selectedCourse.description || 'No description available'}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowCourseModal(false)}
                      >
                        Close
                      </Button>
                      <Button 
                        variant="primary"
                        onClick={() => {
                          setShowCourseModal(false);
                          navigate(`/instructor/courses/${selectedCourse.id}`);
                        }}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </Modal.Body>
                </>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
