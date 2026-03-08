const { Inquiry } = require('../models/Inquiry');
const { sendInquiryNotification } = require('../config/emailService');

// Submit new inquiry
const submitInquiry = async (req, res) => {
  try {
    const {
      name,
      companyName,
      email,
      phone,
      productRequired,
      quantity,
      purpose,
      message
    } = req.body;

    // Validate inquiry data
    const validationErrors = Inquiry.validateInquiry(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Create new inquiry in database
    const inquiry = await Inquiry.create({
      name: name.trim(),
      companyName: companyName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      productRequired: productRequired.trim(),
      quantity: quantity.trim(),
      purpose: purpose ? purpose.trim() : null,
      message: message ? message.trim() : null
    });

    // Send email notification
    try {
      await sendInquiryNotification(inquiry);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you within 24 hours.',
      data: {
        inquiryId: inquiry.id,
        submittedAt: inquiry.created_at
      }
    });

  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again.',
      error: error.message
    });
  }
};

// Get all inquiries (admin endpoint)
const getInquiries = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    const inquiries = await Inquiry.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    const formattedInquiries = inquiries.map(inquiry => inquiry.formatForDashboard());
    
    res.json({
      success: true,
      count: formattedInquiries.length,
      data: formattedInquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries',
      error: error.message
    });
  }
};

// Get inquiry by ID
const getInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByPk(id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }
    
    res.json({
      success: true,
      data: inquiry.formatForDashboard()
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiry',
      error: error.message
    });
  }
};

// Update inquiry status (admin endpoint)
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'contacted', 'quoted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const inquiry = await Inquiry.findByPk(id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }
    
    inquiry.status = status;
    await inquiry.save();
    
    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: inquiry.formatForDashboard()
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inquiry',
      error: error.message
    });
  }
};

// Get inquiry statistics (admin endpoint)
const getInquiryStats = async (req, res) => {
  try {
    const [total, newCount, contactedCount, quotedCount, closedCount] = await Promise.all([
      Inquiry.count(),
      Inquiry.count({ where: { status: 'new' } }),
      Inquiry.count({ where: { status: 'contacted' } }),
      Inquiry.count({ where: { status: 'quoted' } }),
      Inquiry.count({ where: { status: 'closed' } })
    ]);
    
    // Get inquiries from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const last30Days = await Inquiry.count({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    const stats = {
      total,
      new: newCount,
      contacted: contactedCount,
      quoted: quotedCount,
      closed: closedCount,
      last30Days
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching inquiry statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiry statistics',
      error: error.message
    });
  }
};

module.exports = {
  submitInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  getInquiryStats
};