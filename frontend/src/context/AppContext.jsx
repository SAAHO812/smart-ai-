import React, { createContext, useState, useContext } from 'react';

// Sample data
const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@education.org',
  role: 'teacher',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
};

const mockNotifications = [
  {
    id: '1',
    message: 'New submission from Alex Chen',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '2',
    message: 'High plagiarism detected in Math Assignment',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '3',
    message: 'Assignment "Physics 101" successfully evaluated',
    type: 'success',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];

const mockSubmissions = [
  {
    id: '1',
    studentName: 'Alex Chen',
    assignmentName: 'Advanced Algebra Quiz',
    submittedAt: '2025-04-15T14:30:00',
    status: 'evaluated',
    score: 92
  },
  {
    id: '2',
    studentName: 'Maya Patel',
    assignmentName: 'History Essay',
    submittedAt: '2025-04-15T10:15:00',
    status: 'flagged'
  },
  {
    id: '3',
    studentName: 'Jason Kim',
    assignmentName: 'Chemistry Lab Report',
    submittedAt: '2025-04-14T16:45:00',
    status: 'evaluated',
    score: 88
  },
  {
    id: '4',
    studentName: 'Sophia Martinez',
    assignmentName: 'Literature Analysis',
    submittedAt: '2025-04-14T11:20:00',
    status: 'pending'
  }
];

const mockAssignments = [
  {
    id: '1',
    title: 'Advanced Algebra Quiz',
    dueDate: '2025-04-20T23:59:59',
    subject: 'Mathematics',
    type: 'quiz',
    status: 'published'
  },
  {
    id: '2',
    title: 'History Essay - World War II',
    dueDate: '2025-04-22T23:59:59',
    subject: 'History',
    type: 'essay',
    status: 'published'
  },
  {
    id: '3',
    title: 'Chemistry Lab Report',
    dueDate: '2025-04-18T23:59:59',
    subject: 'Chemistry',
    type: 'problem_set',
    status: 'published'
  },
  {
    id: '4',
    title: 'Programming Fundamentals',
    dueDate: '2025-04-25T23:59:59',
    subject: 'Computer Science',
    type: 'problem_set',
    status: 'draft'
  }
];

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    user: mockUser,
    isLoading,
    isDarkMode,
    toggleDarkMode,
    notifications: mockNotifications,
    recentSubmissions: mockSubmissions,
    assignments: mockAssignments
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
