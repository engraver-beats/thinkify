# Task Management System

A comprehensive React-based task management application with user authentication, priority management, and visual organization features.

## 🚀 Features

### ✅ Core Functionality
- **Task Creation**: Create tasks with title, description, due date, and priority
- **Task Management**: View, edit, delete, and update task status
- **Task Details**: Detailed view of individual tasks with all information
- **Task List**: Paginated list view with filtering and search capabilities
- **Priority Management**: Organize tasks by priority (High, Medium, Low)
- **Visual Board**: Drag-and-drop priority board with color-coded columns

### 🔐 User Authentication
- **Login/Register**: Secure user authentication system
- **User Roles**: Admin and regular user roles with different permissions
- **User Management**: Admin can add/remove users and manage permissions
- **Task Assignment**: Assign tasks to specific users

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color-Coded Priorities**: Visual indicators for task priorities
- **Status Badges**: Clear status indicators (Pending, In Progress, Completed)
- **Overdue Alerts**: Visual warnings for overdue tasks
- **Modern UI**: Clean, professional interface with smooth animations

### 📊 Advanced Features
- **Search & Filter**: Search tasks by title/description, filter by status/priority
- **Pagination**: Efficient handling of large task lists
- **Statistics Dashboard**: Overview of task counts and status distribution
- **Drag & Drop**: Move tasks between priority columns
- **AJAX Operations**: Smooth interactions without page refreshes

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router DOM
- **Icons**: Lucide React
- **Storage**: Local Storage (no backend required)
- **Styling**: Custom CSS with modern design principles
- **State Management**: React Context API

## 📦 Installation

1. **Clone or download the project**
   ```bash
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Quick Start

### Demo Account
A demo account is available for testing the application with sample tasks and features.

### Creating Your Own Account
1. Click "Sign up here" on the login page
2. Fill in your details (first user becomes admin automatically)
3. Start creating and managing your tasks!

## 📱 How to Use

### Dashboard
- View task statistics and quick actions
- Switch between List and Board views
- Use filters to find specific tasks
- Search tasks by title or description

### Creating Tasks
1. Click "Create New Task" or the "+" button
2. Fill in task details:
   - **Title**: Required, up to 100 characters
   - **Description**: Optional, up to 500 characters
   - **Due Date**: Optional deadline
   - **Priority**: High (red), Medium (yellow), Low (green)
   - **Assign To**: Select a user (admin feature)

### Managing Tasks
- **View Details**: Click the eye icon or task title
- **Edit Task**: Click the edit icon (if you have permission)
- **Delete Task**: Click the trash icon (with confirmation)
- **Update Status**: Use dropdown in list view or buttons in detail view

### Priority Board
- **Drag & Drop**: Move tasks between priority columns
- **Visual Organization**: See all tasks organized by priority
- **Color Coding**: 
  - 🔴 High Priority (Red)
  - 🟡 Medium Priority (Yellow)
  - 🟢 Low Priority (Green)

### User Management (Admin Only)
- **Add Users**: Create new user accounts
- **Manage Roles**: Assign admin or user roles
- **Delete Users**: Remove users from the system
- **View Statistics**: See task counts per user

## 🔧 Features in Detail

### Task Status Options
- **Pending**: Newly created tasks
- **In Progress**: Tasks currently being worked on
- **Completed**: Finished tasks

### Priority Levels
- **High**: Urgent tasks requiring immediate attention
- **Medium**: Important tasks to be completed soon
- **Low**: Tasks that can be done when time allows

### User Permissions
- **Regular Users**: Can create, edit, and delete their own tasks
- **Admins**: Can manage all tasks and users, assign tasks to others

### Visual Indicators
- **Overdue Tasks**: Highlighted in red with warning icons
- **Priority Colors**: Consistent color coding throughout the app
- **Status Badges**: Clear visual status indicators
- **User Avatars**: Colored circles with user initials

## 📊 Data Storage

This application uses browser Local Storage to persist data:
- **Users**: Stored in `localStorage.users`
- **Tasks**: Stored in `localStorage.tasks`
- **Current User**: Stored in `localStorage.currentUser`

**Note**: Data is stored locally in your browser. Clearing browser data will reset the application.

## 🎨 Customization

### Styling
The application uses custom CSS with CSS variables for easy theming. Main style files:
- `src/App.css`: Global styles and component styles
- Color scheme can be modified by updating CSS custom properties

### Adding Features
The modular component structure makes it easy to add new features:
- Components are organized by feature (Auth, Tasks, Users, etc.)
- Context providers handle state management
- Utility functions are separated for reusability

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `build` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

## 🔍 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## 📞 Support

If you encounter any issues or have questions, please create an issue in the project repository.

---

**Enjoy managing your tasks efficiently! 🎉**
