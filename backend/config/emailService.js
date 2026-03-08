const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send inquiry notification email to company
const sendInquiryNotification = async (inquiry) => {
  try {
    const transporter = createTransporter();

    // Email to company admin
    const adminMailOptions = {
      from: `"B2B Mushroom Supply" <${process.env.EMAIL_FROM}>`,
      to: process.env.COMPANY_EMAIL,
      subject: `New B2B Inquiry from ${inquiry.companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #2d5a27; }
            .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🍄 New B2B Inquiry Received</h2>
              <p>B2B Mushroom Supply Company</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⚡ Action Required:</strong> New bulk inquiry from ${inquiry.companyName}. 
                Please respond within 24 hours to maintain service excellence.
              </div>
              
              <h3>Company Information</h3>
              <div class="field"><span class="label">Company Name:</span> ${inquiry.companyName}</div>
              <div class="field"><span class="label">Contact Person:</span> ${inquiry.name}</div>
              <div class="field"><span class="label">Email:</span> ${inquiry.email}</div>
              <div class="field"><span class="label">Phone:</span> ${inquiry.phone}</div>
              
              <h3>Product Requirements</h3>
              <div class="field"><span class="label">Product Required:</span> ${inquiry.productRequired}</div>
              <div class="field"><span class="label">Quantity:</span> ${inquiry.quantity}</div>
              <div class="field"><span class="label">Purpose:</span> ${inquiry.purpose || 'Not specified'}</div>
              
              ${inquiry.message ? `
                <h3>Additional Message</h3>
                <div style="background: white; padding: 15px; border-left: 4px solid #2d5a27;">
                  ${inquiry.message}
                </div>
              ` : ''}
              
              <h3>Inquiry Details</h3>
              <div class="field"><span class="label">Inquiry ID:</span> ${inquiry.id}</div>
              <div class="field"><span class="label">Submitted:</span> ${inquiry.createdAt.toLocaleString()}</div>
            </div>
            
            <div class="footer">
              <p>B2B Mushroom Supply Company - Premium Quality, Reliable Supply</p>
              <p>This is an automated notification. Please respond directly to the customer email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send admin notification
    await transporter.sendMail(adminMailOptions);

    // Auto-reply to customer
    const customerMailOptions = {
      from: `"B2B Mushroom Supply" <${process.env.EMAIL_FROM}>`,
      to: inquiry.email,
      subject: `Thank you for your inquiry - B2B Mushroom Supply`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .highlight { background: #e8f5e8; padding: 15px; border-left: 4px solid #2d5a27; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🍄 Thank You for Your Inquiry</h2>
              <p>B2B Mushroom Supply Company</p>
            </div>
            
            <div class="content">
              <p>Dear ${inquiry.name},</p>
              
              <p>Thank you for your interest in our premium mushroom products. We have received your inquiry regarding <strong>${inquiry.productRequired}</strong> and appreciate you considering us for your bulk supply needs.</p>
              
              <div class="highlight">
                <h4>🎯 Next Steps:</h4>
                <ul>
                  <li>Our B2B sales team will review your requirements</li>
                  <li>You will receive a detailed quote within <strong>24 hours</strong></li>
                  <li>We'll include pricing, specifications, and delivery terms</li>
                </ul>
              </div>
              
              <h4>📋 Your Inquiry Summary:</h4>
              <ul>
                <li><strong>Company:</strong> ${inquiry.companyName}</li>
                <li><strong>Product:</strong> ${inquiry.productRequired}</li>
                <li><strong>Quantity:</strong> ${inquiry.quantity}</li>
                <li><strong>Inquiry ID:</strong> ${inquiry.id}</li>
              </ul>
              
              <p>Our commitment to you:</p>
              <ul>
                <li>✅ Premium quality products with certifications</li>
                <li>✅ Competitive bulk pricing</li>
                <li>✅ Reliable supply chain and logistics</li>
                <li>✅ Full compliance with industry standards</li>
              </ul>
              
              <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
              
              <p>Best regards,<br>
              <strong>B2B Sales Team</strong><br>
              B2B Mushroom Supply Company</p>
            </div>
            
            <div class="footer">
              <p>📧 Email: ${process.env.COMPANY_EMAIL} | 🌐 Professional Mushroom Supply Solutions</p>
              <p>This is an automated confirmation. We will respond personally within 24 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send customer auto-reply
    await transporter.sendMail(customerMailOptions);

    console.log(`📧 Email notifications sent for inquiry ID: ${inquiry.id}`);
    return true;

  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    throw error;
  }
};

// Test email configuration
const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
};

module.exports = {
  sendInquiryNotification,
  testEmailConfiguration
};