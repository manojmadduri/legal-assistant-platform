const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const { LegalAlert, User } = require('../models');

// Configure email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Create the worker
const worker = new Worker('legal-alerts', async (job) => {
  try {
    const { alertId, userId, title, dueDate } = job.data;

    // Get user email
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Send email reminder
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Legal Alert Reminder: ${title}`,
      html: `
        <h2>Legal Alert Reminder</h2>
        <p>This is a reminder for your upcoming legal deadline:</p>
        <p><strong>${title}</strong></p>
        <p>Due Date: ${new Date(dueDate).toLocaleDateString()}</p>
        <p>Please log in to your Legal Assistant Platform to take necessary action.</p>
      `
    });

    // Update alert status if it's due
    if (new Date(dueDate) <= new Date()) {
      await LegalAlert.update(
        { status: 'EXPIRED' },
        { where: { id: alertId } }
      );
    }

    console.log(`Reminder sent for alert ${alertId} to user ${userId}`);
  } catch (error) {
    console.error('Error processing alert:', error);
    throw error;
  }
}, {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

// Handle worker events
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

module.exports = worker;
