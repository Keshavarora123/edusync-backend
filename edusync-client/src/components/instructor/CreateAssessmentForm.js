import React, { useState } from 'react';
import { Form, Button, Modal, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CreateAssessmentForm = ({ courseId, show, onHide, onSave }) => {
  const [title, setTitle] = useState('');
  const [maxScore, setMaxScore] = useState(10);
  const [questions, setQuestions] = useState([
    { 
      questionText: '', 
      optionA: '', 
      optionB: '', 
      optionC: '', 
      optionD: '', 
      correctOption: 'A' 
    }
  ]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (maxScore <= 0) {
      newErrors.maxScore = 'Max score must be greater than 0';
    }
    
    // Validate questions
    questions.forEach((q, index) => {
      if (!q.questionText.trim()) {
        newErrors[`question_${index}`] = 'Question text is required';
      }
      if (!q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
        newErrors[`options_${index}`] = 'All options are required';
      }
      if (!q.correctOption) {
        newErrors[`correct_${index}`] = 'Please select the correct option';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { 
        questionText: '', 
        optionA: '', 
        optionB: '', 
        optionC: '', 
        optionD: '', 
        correctOption: 'A' 
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    console.log(`Updating question ${index}, field: ${field}, value:`, value);
    
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      const updatedQuestion = { 
        ...newQuestions[index], 
        [field]: value 
      };
      
      // Log the updated question with correctOption
      console.log('Updated question:', {
        ...updatedQuestion,
        correctOption: updatedQuestion.correctOption,
        hasCorrectOption: updatedQuestion.correctOption !== null && updatedQuestion.correctOption !== undefined
      });
      
      newQuestions[index] = updatedQuestion;
      return newQuestions;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enhanced validation with logging
    const isFormValid = validateForm();
    console.log('Form validation result:', isFormValid);
    
    if (isFormValid) {
      // Create a deep copy of questions to avoid mutating state
      const processedQuestions = questions.map((q, index) => {
        // Ensure correctOption is a valid string (A, B, C, or D)
        let correctOption = q.correctOption || 'A'; // Default to 'A' if null/undefined
        
        // Ensure it's a single uppercase letter
        correctOption = correctOption.toString().trim().toUpperCase();
        if (!['A', 'B', 'C', 'D'].includes(correctOption)) {
          correctOption = 'A'; // Default to 'A' if invalid
        }
        
        const question = {
          questionText: q.questionText.trim(),
          optionA: q.optionA.trim(),
          optionB: q.optionB.trim(),
          optionC: q.optionC.trim(),
          optionD: q.optionD.trim(),
          correctOption: correctOption
        };
        
        console.log(`Processed question ${index}:`, {
          ...question,
          hasCorrectOption: question.correctOption !== null && question.correctOption !== undefined
        });
        
        return question;
      });
      
      const assessmentData = {
        title: title.trim(),
        maxScore: parseInt(maxScore, 10),
        courseId,
        questions: processedQuestions
      };
      
      console.log('Final assessment data being submitted:', JSON.stringify(assessmentData, null, 2));
      
      // Validate that all questions have a correctOption
      const invalidQuestions = assessmentData.questions.filter(
        q => !q.correctOption || !['A', 'B', 'C', 'D'].includes(q.correctOption)
      );
      
      if (invalidQuestions.length > 0) {
        console.error('Invalid questions found:', invalidQuestions);
        setError('Please select a correct option for all questions');
        return;
      }
      
      onSave(assessmentData);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Assessment</Modal.Title>
      </Modal.Header>
      {error && (
        <Alert variant="danger" className="m-3">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Assessment Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Maximum Score</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              isInvalid={!!errors.maxScore}
            />
            <Form.Control.Feedback type="invalid">
              {errors.maxScore}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Questions</h6>
              <Button 
                variant="outline-primary" 
                size="sm"
                type="button"
                onClick={handleAddQuestion}
              >
                <FaPlus className="me-1" /> Add Question
              </Button>
            </div>
            
            {questions.map((q, qIndex) => (
              <Card key={qIndex} className="mb-3 border-primary">
                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                  <span>Question {qIndex + 1}</span>
                  {questions.length > 1 && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      isInvalid={!!errors[`question_${qIndex}`]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors[`question_${qIndex}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Row className="g-3 mb-3">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <Col md={6} key={option}>
                        <Form.Group>
                          <div className="input-group">
                            <span className="input-group-text">{option}.</span>
                            <Form.Control
                              type="text"
                              placeholder={`Enter option ${option}`}
                              value={q[`option${option}`]}
                              onChange={(e) => handleQuestionChange(qIndex, `option${option}`, e.target.value)}
                              isInvalid={!!errors[`options_${qIndex}`]}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>
                  
                  {/* Correct Option Selection */}
                  <div className="mb-3">
                    <Form.Label className="fw-bold">Select Correct Option:</Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                      {['A', 'B', 'C', 'D'].map((option) => {
                        const optionKey = `option${option}`;
                        const optionValue = q[optionKey];
                        const isDisabled = !optionValue || !optionValue.trim();
                        
                        return (
                          <Form.Check
                            key={option}
                            type="radio"
                            id={`correct-${qIndex}-${option}`}
                            name={`correct-${qIndex}`}
                            label={`Option ${option}`}
                            value={option}
                            checked={q.correctOption === option}
                            onChange={(e) => {
                              console.log('Selected option:', option, 'Current correctOption:', q.correctOption);
                              handleQuestionChange(qIndex, 'correctOption', option);
                            }}
                            disabled={isDisabled}
                            className="px-3 py-2 border rounded"
                          />
                        );
                      })}
                    </div>
                    {errors[`correct_${qIndex}`] && (
                      <div className="text-danger small mt-2">{errors[`correct_${qIndex}`]}</div>
                    )}
                  </div>
                  
                  {errors[`options_${qIndex}`] && (
                    <div className="text-danger small mt-2">
                      {errors[`options_${qIndex}`]}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Assessment
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateAssessmentForm;
