const { sequelize, DataTypes } = require('../config/database');

// Define Inquiry model with Sequelize
const Inquiry = sequelize.define('Inquiry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 50]
    }
  },
  productRequired: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'quoted', 'closed'),
    defaultValue: 'new'
  }
}, {
  tableName: 'inquiries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Static validation method
Inquiry.validateInquiry = (inquiryData) => {
  const errors = [];

  if (!inquiryData.name || inquiryData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!inquiryData.companyName || inquiryData.companyName.trim().length < 2) {
    errors.push('Company name is required');
  }

  if (!inquiryData.email || !Inquiry.isValidEmail(inquiryData.email)) {
    errors.push('Valid email address is required');
  }

  if (!inquiryData.phone || inquiryData.phone.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!inquiryData.productRequired || inquiryData.productRequired.trim().length < 2) {
    errors.push('Product requirement is required');
  }

  if (!inquiryData.quantity || inquiryData.quantity.trim().length < 1) {
    errors.push('Quantity specification is required');
  }

  return errors;
};

Inquiry.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Instance method for email formatting
Inquiry.prototype.formatForEmail = function() {
  return `
New B2B Mushroom Inquiry Received

Company Details:
- Company Name: ${this.companyName}
- Contact Person: ${this.name}
- Email: ${this.email}
- Phone: ${this.phone}

Product Requirements:
- Product: ${this.productRequired}
- Quantity: ${this.quantity}
- Purpose: ${this.purpose || 'Not specified'}

Additional Message:
${this.message || 'No additional message'}

Inquiry ID: ${this.id}
Submitted: ${this.created_at ? this.created_at.toLocaleString() : new Date().toLocaleString()}

Please respond to this inquiry promptly to maintain our B2B service standards.
  `;
};

// Instance method for dashboard formatting
Inquiry.prototype.formatForDashboard = function() {
  return {
    id: this.id,
    company: this.companyName,
    contact: this.name,
    email: this.email,
    phone: this.phone,
    product: this.productRequired,
    quantity: this.quantity,
    purpose: this.purpose,
    status: this.status,
    submittedAt: this.created_at ? this.created_at.toISOString() : new Date().toISOString(),
    summary: `${this.companyName} requested ${this.quantity} of ${this.productRequired}`
  };
};

module.exports = { Inquiry };