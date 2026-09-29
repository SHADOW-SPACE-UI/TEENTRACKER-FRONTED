import React, { useState } from 'react';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../constants';
import { getTodayDateString } from '../utils/formatters';

export default function ExpenseForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    category: initialData?.category || 'Food',
    customCategory: '',
    date: initialData?.date || getTodayDateString(),
    merchant: initialData?.merchant || '',
    description: initialData?.description || '',
    payment_method: initialData?.payment_method || 'UPI',
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isCustomCategory = formData.category === 'Custom';

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (isCustomCategory && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Please specify custom category name';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
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
        amount: Number(formData.amount),
        category: isCustomCategory ? formData.customCategory.trim() : formData.category,
        date: formData.date,
        merchant: formData.merchant.trim() || null,
        description: formData.description.trim() || null,
        payment_method: formData.payment_method,
        notes: formData.notes.trim() || null
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {/* Amount (Required) */}
      <div className="form-group">
        <label className="form-label">
          <span>Amount *</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required</span>
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="any"
          placeholder="0.00"
          className="form-input"
          style={{ fontSize: '1.25rem', fontWeight: 700 }}
          autoFocus
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      {/* Category (Required) */}
      <div className="form-group">
        <label className="form-label">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Custom">+ Custom Category</option>
        </select>
      </div>

      {/* Custom Category Input if selected */}
      {isCustomCategory && (
        <div className="form-group">
          <label className="form-label">Custom Category Name *</label>
          <input
            type="text"
            name="customCategory"
            value={formData.customCategory}
            onChange={handleChange}
            placeholder="e.g. Skateboarding, Art Supplies"
            className="form-input"
          />
          {errors.customCategory && <span className="form-error">{errors.customCategory}</span>}
        </div>
      )}

      {/* Date (Required) */}
      <div className="form-group">
        <label className="form-label">Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="form-input"
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      {/* Merchant / Store */}
      <div className="form-group">
        <label className="form-label">Merchant / Store (Optional)</label>
        <input
          type="text"
          name="merchant"
          value={formData.merchant}
          onChange={handleChange}
          placeholder="e.g. Campus Canteen, Steam, Amazon"
          className="form-input"
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Afternoon smoothie and samosa"
          className="form-input"
        />
      </div>

      {/* Payment Method */}
      <div className="form-group">
        <label className="form-label">Payment Method</label>
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          className="form-select"
        >
          {PAYMENT_METHODS.map((pm) => (
            <option key={pm} value={pm}>
              {pm}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label">Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          placeholder="Any extra context or reminders..."
          className="form-textarea"
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? 'Saving...' : initialData ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
