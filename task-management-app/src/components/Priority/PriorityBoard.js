import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import PriorityColumn from './PriorityColumn';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const PriorityBoard = () => {
  const { getTasksByPriority, moveToPriority } = useTask();
  const [draggedTask, setDraggedTask] = useState(null);
  
  const tasksByPriority = getTasksByPriority();

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (newPriority) => {
    if (draggedTask && draggedTask.priority !== newPriority) {
      try {
        await moveToPriority(draggedTask.id, newPriority);
      } catch (error) {
        console.error('Error moving task:', error);
        alert('Error moving task: ' + error.message);
      }
    }
    setDraggedTask(null);
  };

  const priorityConfig = {
    high: {
      title: 'High Priority',
      icon: AlertTriangle,
      color: '#dc3545',
      bgColor: '#fff5f5',
      borderColor: '#dc3545'
    },
    medium: {
      title: 'Medium Priority',
      icon: Clock,
      color: '#ffc107',
      bgColor: '#fff8e1',
      borderColor: '#ffc107'
    },
    low: {
      title: 'Low Priority',
      icon: CheckCircle,
      color: '#28a745',
      bgColor: '#f0f9ff',
      borderColor: '#28a745'
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2 className="card-title">Priority Board</h2>
          <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: '14px' }}>
            Drag and drop tasks between priority columns to reorganize them.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {Object.entries(priorityConfig).map(([priority, config]) => (
          <PriorityColumn
            key={priority}
            priority={priority}
            title={config.title}
            icon={config.icon}
            color={config.color}
            bgColor={config.bgColor}
            borderColor={config.borderColor}
            tasks={tasksByPriority[priority] || []}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            isDraggedOver={draggedTask && draggedTask.priority !== priority}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">How to Use the Priority Board</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ color: '#dc3545', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={18} />
              High Priority
            </h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Urgent tasks that need immediate attention. These are highlighted in red.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ffc107', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} />
              Medium Priority
            </h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Important tasks that should be completed soon. These are highlighted in yellow.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#28a745', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={18} />
              Low Priority
            </h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Tasks that can be completed when time allows. These are highlighted in green.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityBoard;

