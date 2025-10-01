

export interface SendEmailRequest {
  subject: string;
  message: string;
  actionUrl?: string;
  name?: string;
  email?: string;
}