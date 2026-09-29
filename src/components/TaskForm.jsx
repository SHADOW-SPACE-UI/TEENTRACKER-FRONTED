import React, { useState, useEffect } from 'react';
import { TASK_PRIORITIES, TASK_CATEGORIES } from '../constants';
import { savingsService } from '../services/savingsService';
import { getTodayDateString } from '../utils/formatters';

export default function TaskForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'Medium',
    category: initialData?.category || 'Personal',
    due_date: initialData?.due_date || getTodayDateString(),
    related_goal_id: initialData?.related_goal_id || '',
    notes: initialData?.notes || ''
  });

  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadGoals() {
      try {
        const res = await savingsService.getGoals();
        if (res.success && res.data) {
          setGoals(res.data);
        }
      } catch (err) {
        // Goals optional
      }
    }
    loadGoals();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        priority: formData.priority,
        category: formData.category,
        due_date: formData.due_date || null,
        related_goal_id: formData.related_goal_id || null,
        notes: formData.notes.trim() || null
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {/* Title */}
      <div className="form-group">
        <label className="form-label">
          <span>Task Title *</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Finish Math homework, Save ₹300 from pocket money"
          className="form-input"
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Priority */}
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Due Date */}
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Link to Financial Savings Goal */}
        <div className="form-group">
          <label className="form-label">Link Savings Goal</label>
          <select
            name="related_goal_id"
            value={formData.related_goal_id}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">None (Independent Task)</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          placeholder="Details or specific steps..."
          className="form-textarea"
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
