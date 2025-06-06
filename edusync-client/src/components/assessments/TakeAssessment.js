import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Container, Card, Spinner, Form } from 'react-bootstrap';
import { FaExclamationTriangle, FaCheck, FaArrowLeft, FaClock, FaListUl } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config';

// Modern color scheme
const colors = {
  primary: '#4a6cf7',
  primaryLight: '#edf0ff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
};

// Animation keyframes
const fadeIn = {
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

const pulse = {
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.02)' },
  '100%': { transform: 'scale(1)' },
};

// Custom styles for the assessment component
const styles = {
  // Global styles
  '@global': {
    '@keyframes fadeIn': fadeIn,
    '@keyframes pulse': pulse,
    body: {
      backgroundColor: colors.gray100,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: 1.6,
      color: colors.gray800,
    },
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.gray900,
    },
    button: {
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  },
  
  // Main container
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '100vh',
    animation: 'fadeIn 0.5s ease-out',
    '@media (min-width: 768px)': {
      padding: '3rem 2rem',
    },
  },
  
  // Header section
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2.5rem',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  
  // Back button
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray300}`,
    color: colors.gray700,
    fontWeight: 500,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: colors.gray100,
      borderColor: colors.gray400,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  
  // Timer
  timer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.25rem',
    backgroundColor: colors.white,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    fontWeight: 600,
    color: colors.danger,
    border: `1px solid ${colors.gray200}`,
    '& svg': {
      color: colors.danger,
    },
  },
  
  // Assessment card
  assessmentCard: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
    marginBottom: '2rem',
    overflow: 'hidden',
    border: `1px solid ${colors.gray200}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
    },
  },
  
  // Assessment header
  assessmentHeader: {
    padding: '2rem 2rem 1.5rem',
    borderBottom: `1px solid ${colors.gray200}`,
    backgroundColor: colors.white,
  },
  
  // Assessment title
  assessmentTitle: {
    fontSize: '1.75rem',
    marginBottom: '0.75rem',
    color: colors.gray900,
    fontWeight: 700,
  },
  
  // Assessment description
  assessmentDescription: {
    color: colors.gray600,
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  
  // Meta information (time, questions count)
  assessmentMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
  
  // Meta item (time, questions)
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.9rem',
    backgroundColor: colors.gray100,
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: colors.gray700,
  },
  
  // Meta icon
  metaIcon: {
    color: colors.gray500,
    fontSize: '0.9rem',
  },
  
  // Question card
  questionCard: {
    padding: '1.75rem 2rem',
    borderBottom: `1px solid ${colors.gray200}`,
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: colors.gray50,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  
  // Question header
  questionHeader: {
    display: 'flex',
    gap: '1.25rem',
  },
  
  // Question number
  questionNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontWeight: 600,
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  
  // Question content
  questionContent: {
    flex: 1,
  },
  
  // Question text
  questionText: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: '1.25rem',
    color: colors.gray800,
    lineHeight: 1.6,
  },
  
  // Option button
  optionButton: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '0.85rem 1.25rem',
    marginBottom: '0.75rem',
    borderRadius: '8px',
    border: `1px solid ${colors.gray300}`,
    backgroundColor: colors.white,
    color: colors.gray800,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: colors.gray100,
      borderColor: colors.gray400,
    },
    '&.selected': {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
      color: colors.primary,
      fontWeight: 500,
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  
  // Footer
  footer: {
    padding: '1.5rem 2rem',
    backgroundColor: colors.gray50,
    borderTop: `1px solid ${colors.gray200}`,
  },
  
  // Footer content
  footerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    '@media (min-width: 576px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  
  // Answered count
  answeredCount: {
    fontSize: '0.95rem',
    color: colors.gray600,
    fontWeight: 500,
  },
  
  // Submit button
  submitButton: {
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: colors.primary,
    border: 'none',
    boxShadow: '0 4px 6px rgba(74, 108, 247, 0.2)',
    '&:hover': {
      backgroundColor: '#3a5bd9',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 8px rgba(74, 108, 247, 0.25)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  
  // Loading container
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    textAlign: 'center',
  },
  
  // Loading spinner
  loadingSpinner: {
    width: '3rem',
    height: '3rem',
    color: colors.primary,
  },
  
  // Error container
  errorContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: colors.white,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  
  // Success message
  successMessage: {
    maxWidth: '600px',
    margin: '4rem auto',
    padding: '2.5rem',
    backgroundColor: colors.white,
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
    animation: 'fadeIn 0.6s ease-out',
  },
  
  // Success icon
  successIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    marginBottom: '1.5rem',
    '& svg': {
      fontSize: '2.5rem',
      color: colors.success,
    },
  },
  
  // Success title
  successTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: colors.gray900,
  },
  
  // Success text
  successText: {
    fontSize: '1.1rem',
    color: colors.gray600,
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  
  // Back to course button
  backToCourseButton: {
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: colors.primary,
    border: 'none',
    color: colors.white,
    textDecoration: 'none',
    display: 'inline-block',
    '&:hover': {
      backgroundColor: '#3a5bd9',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 8px rgba(74, 108, 247, 0.25)',
    },
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e0e0e0',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 15px',
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateX(-3px)',
    },
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontWeight: '600',
    color: '#dc3545',
  },
  assessmentCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '30px',
    overflow: 'hidden',
  },
  assessmentHeader: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
  },
  assessmentTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.75rem',
    fontWeight: '600',
  },
  assessmentDescription: {
    color: '#6c757d',
    margin: '10px 0 0',
    fontSize: '1.1rem',
  },
  questionCard: {
    padding: '20px',
    borderBottom: '1px solid #e9ecef',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  questionText: {
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    marginBottom: '10px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
    '&.selected': {
      backgroundColor: '#e7f5ff',
      borderColor: '#4dabf7',
    },
  },
  optionInput: {
    marginRight: '12px',
    cursor: 'pointer',
  },
  optionLabel: {
    cursor: 'pointer',
    margin: 0,
    flex: 1,
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '8px',
    marginTop: '20px',
    transition: 'all 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
  },
  loadingSpinner: {
    width: '3rem',
    height: '3rem',
  },
};

// Add some basic styles for debugging
const debugStyles = `
  .debug-container {
    border: 2px solid #dc3545;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
  }
  .debug-info {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    margin: 10px 0;
  }
`;

// Simple debug component
export const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const location = useLocation();
  
  console.log('DEBUG - TakeAssessment rendered with ID:', assessmentId);
  console.log('Current location:', location);
  
  // Add styles to the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = debugStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!assessmentId || !user?.token) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch assessment details
        const response = await fetch(`${config.apiBaseUrl}/Assessments/${assessmentId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch assessment: ${response.status}`);
        }

        let data = await response.json();
        
        // If questions are not included, fetch them separately
        if (!data.questions || data.questions.length === 0) {
          console.log('No questions found in assessment, fetching separately...');
          const questionsResponse = await fetch(`${config.apiBaseUrl}/Assessments/${assessmentId}/questions`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            data.questions = questionsData;
            console.log('Fetched questions:', questionsData);
          } else {
            console.warn('Failed to fetch questions separately');
            data.questions = [];
          }
        } else {
          console.log('Questions found in assessment data:', data.questions);
        }
        
        setAssessment(data);
        
        // Initialize answers object with null for each question
        if (data.questions) {
          const initialAnswers = {};
          data.questions.forEach(q => {
            initialAnswers[q.questionId] = null; // Initialize with null for radio buttons
          });
          setAnswers(initialAnswers);
          console.log('Initialized answers:', initialAnswers);
        }
        
        // Set up timer if there's a time limit
        if (data.timeLimitMinutes) {
          setTimeLeft(data.timeLimitMinutes * 60); // Convert to seconds
        }
        
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError(err.message || 'Failed to load assessment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, user?.token]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, optionId) => {
    console.log(`Selected option ${optionId} for question ${questionId}`);
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  // Helper to get options from question object
  const getOptions = (question) => {
    const options = [];
    
    // Check each possible option (A, B, C, D)
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const optionKey = `option${letter}`;
      const optionValue = question[optionKey];
      
      // Only add the option if it has a value and is not 'null' or empty string
      if (optionValue && optionValue.trim() !== '' && optionValue.toLowerCase() !== 'null') {
        options.push({
          optionId: optionKey,  // Using 'optionA', 'optionB' as IDs
          text: optionValue,
          letter: letter
        });
      }
    });
    
    return options;
  };

  // Helper to render options for a question
  const renderOptions = (question) => {
    const options = getOptions(question);
    
    if (options.length === 0) {
      console.warn('No valid options found for question:', question);
      return <Alert variant="warning">No valid options available for this question.</Alert>;
    }
    
    return (
      <div className="options-container">
        {options.map((option) => (
          <div key={`${question.questionId}-${option.optionId}`} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name={`question-${question.questionId}`}
              id={`option-${question.questionId}-${option.optionId}`}
              checked={answers[question.questionId] === option.optionId}
              onChange={() => handleAnswerChange(question.questionId, option.optionId)}
              disabled={isSubmitting}
            />
            <label 
              className="form-check-label d-block p-2 rounded"
              style={{
                backgroundColor: answers[question.questionId] === option.optionId ? '#e9f5ff' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%',
                borderRadius: '4px',
              }}
              htmlFor={`option-${question.questionId}-${option.optionId}`}
            >
              <strong>{option.letter}.</strong> {option.text}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    
    try {
      // Check if all questions are answered
      const unanswered = Object.entries(answers).filter(([_, value]) => value === null || value.trim() === '');
      
      if (unanswered.length > 0) {
        const confirmSubmit = window.confirm(
          `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
        );
        if (!confirmSubmit) return;
      }
      
      setIsSubmitting(true);
      
      // Prepare submission data according to SubmitAssessmentDTO
      const submission = {
        assessmentId: assessment.assessmentId, // Use the assessment ID from the assessment object
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption: selectedOption || ''
        }))
      };
      
      console.log('Submitting assessment:', JSON.stringify(submission, null, 2));
      
      // Submit to the API
      const response = await fetch(`${config.apiBaseUrl}/Assessments/Submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit assessment');
      }
      
      const result = await response.json();
      console.log('Submission successful:', result);
      
      // Redirect to student dashboard after successful submission
      navigate('/student/dashboard');
      
    } catch (err) {
      console.error('Error submitting assessment:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      alert(`Failed to submit assessment: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner 
          animation="border" 
          variant="primary" 
          style={styles.loadingSpinner} 
          className="mb-4" 
        />
        <h4 style={{ 
          color: colors.gray800, 
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: 600,
        }}>
          Loading Assessment
        </h4>
        <p style={{ 
          color: colors.gray600,
          fontSize: '1.05rem',
          maxWidth: '400px',
          lineHeight: 1.6,
        }}>
          Please wait while we load your assessment. This won't take long...
        </p>
      </div>
    );
  }


  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={{
          backgroundColor: 'rgba(220, 53, 69, 0.08)',
          borderLeft: `4px solid ${colors.danger}`,
          padding: '1.75rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          maxWidth: '800px',
          margin: '0 auto',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          <div style={{
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '1.25rem',
          }}>
            <FaExclamationTriangle style={{ 
              color: colors.danger, 
              fontSize: '1.5rem',
            }} />
          </div>
          <div>
            <h4 style={{ 
              margin: '0 0 0.75rem 0', 
              color: colors.gray900,
              fontSize: '1.5rem',
              fontWeight: 700,
            }}>
              Error Loading Assessment
            </h4>
            <p style={{ 
              margin: '0 0 1.75rem 0', 
              color: colors.gray700,
              lineHeight: 1.6,
              fontSize: '1.1rem',
              maxWidth: '600px',
            }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button 
                variant="outline-danger" 
                onClick={() => window.location.reload()}
                style={{ 
                  padding: '0.75rem 1.75rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderColor: colors.danger,
                  color: colors.danger,
                }}
              >
                <FaArrowLeft style={{ fontSize: '0.9rem' }} />
                Try Again
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                style={{ 
                  padding: '0.75rem 1.75rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderColor: colors.gray400,
                  color: colors.gray700,
                }}
              >
                <FaArrowLeft style={{ fontSize: '0.9rem' }} />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // No assessment found
  if (!assessment) {
    return (
      <div style={styles.container}>
        <div style={{
          backgroundColor: 'rgba(255, 193, 7, 0.08)',
          borderLeft: `4px solid ${colors.warning}`,
          padding: '1.75rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          maxWidth: '800px',
          margin: '0 auto',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '1.25rem',
          }}>
            <FaExclamationTriangle style={{ 
              color: colors.warning, 
              fontSize: '1.5rem',
            }} />
          </div>
          <div>
            <h4 style={{ 
              margin: '0 0 0.75rem 0', 
              color: colors.gray900,
              fontSize: '1.5rem',
              fontWeight: 700,
            }}>
              Assessment Not Found
            </h4>
            <p style={{ 
              margin: '0 0 1.75rem 0', 
              color: colors.gray700,
              lineHeight: 1.6,
              fontSize: '1.1rem',
              maxWidth: '600px',
            }}>
              The requested assessment could not be loaded. It may have been removed or you may not have permission to view it.
            </p>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              style={{ 
                padding: '0.75rem 1.75rem',
                fontWeight: 600,
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderColor: colors.gray400,
                color: colors.gray700,
              }}
            >
              <FaArrowLeft style={{ fontSize: '0.9rem' }} />
              Go Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate(-1)}
          style={styles.backButton}
          disabled={isSubmitting}
        >
          <FaArrowLeft className="me-2" /> Back
        </Button>
        
        {timeLeft !== null && (
          <div style={styles.timer}>
            <FaClock className="me-2" />
            <span>Time Remaining: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
      
      <Card style={styles.assessmentCard}>
        <div style={styles.assessmentHeader}>
          <h1 style={styles.assessmentTitle}>{assessment.title}</h1>
          {assessment.description && (
            <p style={styles.assessmentDescription}>{assessment.description}</p>
          )}
          
          <div style={styles.assessmentMeta}>
            {assessment.timeLimitMinutes && (
              <span style={styles.metaItem}>
                <FaClock style={styles.metaIcon} />
                {assessment.timeLimitMinutes} min
              </span>
            )}
            <span style={styles.metaItem}>
              <FaListUl style={styles.metaIcon} />
              {assessment.questions?.length || 0} questions
            </span>
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Form onSubmit={handleSubmit}>
            {assessment.questions?.map((question, index) => (
              <div key={question.questionId} style={styles.questionCard}>
                <div style={styles.questionHeader}>
                  <div style={styles.questionNumber}>
                    {index + 1}.
                  </div>
                  <div style={styles.questionContent}>
                    <h5 style={styles.questionText}>
                      {question.text}
                    </h5>
                    <Form.Group controlId={`question-${question.questionId}`}>
                      {renderOptions(question)}
                    </Form.Group>
                  </div>
                </div>
              </div>
            ))}
            
            <Card.Footer style={styles.footer}>
              <div style={styles.footerContent}>
                <div style={styles.answeredCount}>
                  {Object.values(answers).filter(a => a).length} of {assessment.questions?.length || 0} questions answered
                </div>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting || !assessment.questions?.length}
                  style={styles.submitButton}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner 
                        as="span" 
                        size="sm" 
                        animation="border" 
                        role="status" 
                        aria-hidden="true" 
                        style={{ marginRight: '8px' }} 
                      />
                      Submitting...
                    </>
                  ) : 'Submit Assessment'}
                </Button>
              </div>
            </Card.Footer>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TakeAssessment;