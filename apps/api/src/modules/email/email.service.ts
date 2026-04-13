import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: email,
        subject: 'Welcome to EShop!',
        html: `
          <h1>Welcome, ${firstName}!</h1>
          <p>Thank you for joining EShop. We're excited to have you!</p>
          <p>Start browsing our amazing products today.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  async sendOrderConfirmationEmail(email: string, orderId: string, totalAmount: number) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: email,
        subject: 'Order Confirmation',
        html: `
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          <p>You will receive tracking information soon.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  async sendPaymentConfirmationEmail(email: string, orderId: string, amount: number) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: email,
        subject: 'Payment Received',
        html: `
          <h1>Payment Confirmed!</h1>
          <p>We've received your payment.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Amount Paid:</strong> $${amount.toFixed(2)}</p>
          <p>Your order is being processed.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
    }
  }

  async sendShippingNotificationEmail(email: string, orderId: string, trackingNumber: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: email,
        subject: 'Your Order Has Shipped!',
        html: `
          <h1>Order Shipped!</h1>
          <p>Your order is on its way!</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p>Click <a href="https://tracking.example.com/${trackingNumber}">here</a> to track your package.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send shipping notification email:', error);
    }
  }

  async sendDeliveryConfirmationEmail(email: string, orderId: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: email,
        subject: 'Delivery Confirmed',
        html: `
          <h1>Your Order Has Been Delivered!</h1>
          <p>We hope you enjoy your purchase.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p>Please leave a review and let us know about your experience!</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send delivery confirmation email:', error);
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: email,
        subject: 'Reset Your Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p>This link expires in 1 hour.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  async sendContactFormEmail(name: string, email: string, message: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@eshop.com',
        to: process.env.ADMIN_EMAIL,
        subject: 'New Contact Form Submission',
        html: `
          <h1>New Message from ${name}</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send contact form email:', error);
    }
  }
}
