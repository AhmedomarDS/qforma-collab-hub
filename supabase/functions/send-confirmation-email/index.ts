
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  user: {
    email: string;
    user_metadata: {
      name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const generateConfirmationEmail = (name: string, confirmationUrl: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to QForma - Confirm Your Email</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                margin-top: 40px;
                margin-bottom: 40px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .logo {
                background: rgba(255, 255, 255, 0.2);
                width: 60px;
                height: 60px;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-message {
                font-size: 18px;
                margin-bottom: 20px;
                color: #374151;
            }
            .confirmation-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                text-align: center;
                min-width: 200px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                transition: transform 0.2s ease;
            }
            .confirmation-button:hover {
                transform: translateY(-2px);
            }
            .features {
                background: #f8fafc;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }
            .feature-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .feature-list li {
                padding: 8px 0;
                position: relative;
                padding-left: 25px;
            }
            .feature-list li::before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
                font-size: 16px;
            }
            .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .security-note {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                color: #92400e;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 20px;
                    border-radius: 8px;
                }
                .header, .content, .footer {
                    padding: 25px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Q</div>
                <h1>Welcome to QForma!</h1>
                <p>Your Quality Assurance Platform</p>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <strong>Hi ${name}!</strong><br>
                    Thank you for joining QForma. We're excited to have you on board! 🎉
                </div>
                
                <p>To get started with your quality assurance journey, please confirm your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" class="confirmation-button">
                        Confirm Email Address
                    </a>
                </div>
                
                <div class="features">
                    <h3 style="margin-top: 0; color: #374151;">What you can do with QForma:</h3>
                    <ul class="feature-list">
                        <li>Create and manage comprehensive test plans</li>
                        <li>Track requirements and maintain traceability</li>
                        <li>Execute test cases and manage defects</li>
                        <li>Generate detailed reports and analytics</li>
                        <li>Collaborate with your team in real-time</li>
                        <li>Automate testing workflows</li>
                    </ul>
                </div>
                
                <div class="security-note">
                    <strong>Security Note:</strong> This confirmation link will expire in 24 hours. If you didn't create an account with QForma, please ignore this email.
                </div>
                
                <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
                    ${confirmationUrl}
                </p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>The QForma Team</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>© 2024 QForma. All rights reserved.</p>
                <p>Questions? Contact us at <a href="mailto:support@qforma.com" style="color: #3b82f6;">support@qforma.com</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhook: EmailData = await req.json();
    
    console.log('Email webhook received:', webhook);
    
    const { user, email_data } = webhook;
    const userName = user.user_metadata?.name || 'QForma User';
    
    // Build the confirmation URL that redirects to our auth page
    const confirmationUrl = `https://icwrgkzkljvlrmobxpux.supabase.co/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;
    
    // For now, we'll log the email content. In a real implementation, 
    // you would use a service like Resend or SendGrid to send the email
    const emailHtml = generateConfirmationEmail(userName, confirmationUrl);
    
    console.log('Confirmation email generated for:', user.email);
    console.log('Confirmation URL:', confirmationUrl);
    console.log('Email HTML length:', emailHtml.length);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email processed',
        user_email: user.email,
        user_name: userName
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error processing email webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
