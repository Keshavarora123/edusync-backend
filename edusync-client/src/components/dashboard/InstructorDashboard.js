import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button, Badge, Dropdown, ProgressBar } from 'react-bootstrap';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaSearch,
  FaSignOutAlt,
  FaBell,
  FaUserTie,
  FaCog,
  FaChevronDown,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaComments,
  FaQuestionCircle,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaCogs
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardStyles.css';

const InstructorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const userName = currentUser?.name || 'Instructor';
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New submission for Web Development Assignment', time: '15 min ago', read: false },
    { id: 2, text: 'Student question in Data Structures', time: '1 hour ago', read: true },
    { id: 3, text: 'New course enrollment request', time: '3 hours ago', read: false },
  ]);

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

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Instructor stats (mock data)
  const stats = [
    { title: 'Active Courses', value: 5, icon: <FaBook className="text-primary" />, color: 'primary' },
    { title: 'Total Students', value: 142, icon: <FaUsers className="text-success" />, color: 'success' },
    { title: 'Pending Grading', value: 23, icon: <FaFileAlt className="text-warning" />, color: 'warning' },
    { title: 'Course Rating', value: 4.8, icon: <FaChartBar className="text-info" />, color: 'info' },
  ];

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
              {getGreeting()}, <span className="gradient-text">Prof. {userName.split(' ')[0]}</span>
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
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="d-none d-md-block me-2">
                  <div className="fw-medium">Prof. {userName.split(' ')[0]}</div>
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
                    <FaBook className="me-3" />
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
              
              <Nav.Item>
                <Nav.Link 
                  as={Link} 
                  to="/instructor/calendar"
                  className={`d-flex align-items-center ${location.pathname === '/instructor/calendar' ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <FaCalendarAlt className="me-3" />
                  </div>
                  <span className="menu-text">Calendar</span>
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
            {/* Stats Cards */}
            {location.pathname === '/instructor' && (
              <div className="row mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-md-6 col-xl-3 mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body className="d-flex align-items-center">
                        <div className="icon-circle bg-light text-primary d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                          {stat.icon}
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">{stat.title}</h6>
                          <h4 className="mb-0">{stat.value}</h4>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            
            {/* Nested Routes Content */}
            <Outlet />
          </div>
          
          <footer className="footer">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  © {new Date().getFullYear()} EduSync - Instructor Portal
                </div>
                <div>
                  <span className="me-3">v1.0.0</span>
                  <a href="#" className="text-muted me-3">Help</a>
                  <a href="#" className="text-muted">Privacy</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
