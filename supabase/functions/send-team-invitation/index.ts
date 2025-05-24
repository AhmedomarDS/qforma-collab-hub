
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationEmailData {
  email: string;
  company_name: string;
  invited_by_name: string;
  role: string;
  invitation_token: string;
  invitation_url: string;
}

const generateInvitationEmail = (data: InvitationEmailData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're Invited to Join ${data.company_name} on QForma</title>
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
            .content {
                padding: 40px 30px;
            }
            .invitation-button {
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
            }
            .role-badge {
                background: #f0f9ff;
                color: #0369a1;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                display: inline-block;
                margin: 10px 0;
            }
            .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Q</div>
                <h1>You're Invited!</h1>
                <p>Join ${data.company_name} on QForma</p>
            </div>
            
            <div class="content">
                <p><strong>Hi there!</strong></p>
                
                <p>${data.invited_by_name} has invited you to join <strong>${data.company_name}</strong> on QForma, our Quality Assurance platform.</p>
                
                <p>You've been assigned the role of:</p>
                <div class="role-badge">${data.role.charAt(0).toUpperCase() + data.role.slice(1)}</div>
                
                <p>Click the button below to accept the invitation and create your account:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${data.invitation_url}" class="invitation-button">
                        Accept Invitation
                    </a>
                </div>
                
                <p><strong>What is QForma?</strong></p>
                <p>QForma is a comprehensive Quality Assurance platform that helps teams manage test cases, track defects, create test plans, and collaborate on quality assurance activities.</p>
                
                <p>If you have any questions, feel free to reach out to ${data.invited_by_name} or our support team.</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>The QForma Team</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>© 2024 QForma. All rights reserved.</p>
                <p>This invitation will expire in 7 days.</p>
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
    const emailData: InvitationEmailData = await req.json();
    
    console.log('Team invitation email generated for:', emailData.email);
    console.log('Company:', emailData.company_name);
    console.log('Role:', emailData.role);
    console.log('Invitation URL:', emailData.invitation_url);
    
    const emailHtml = generateInvitationEmail(emailData);
    
    // In a real implementation, you would use a service like Resend or SendGrid
    // to actually send the email. For now, we'll just log it.
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email generated successfully',
        recipient: emailData.email
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
    console.error('Error generating invitation email:', error);
    
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
