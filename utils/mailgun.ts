import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere',
	url: process.env.MAILGUN_API_URL || undefined, // Set for EU domains if needed
});

export interface SendMailOptions {
	to: string | string[];
	subject: string;
	text?: string;
	html?: string;
	from?: string;
}

/**
 * Send an email using Mailgun
 * @param {SendMailOptions} options - Email options
 */
export async function sendMail(options: SendMailOptions) {
	if (!options.text && !options.html) {
		throw new Error('Either text or html content must be provided');
	}
	const domain = process.env.MAILGUN_DOMAIN || 'sandbox-123.mailgun.org';
	const from = options.from || `Mailgun Sandbox <mailgun@${domain}>`;
	try {
		   const payload: any = {
			   from,
			   subject: options.subject,
		   };
		   payload.to = options.to;
		   if (options.text) payload.text = options.text;
		   if (options.html) payload.html = options.html;
		   const result = await mg.messages.create(domain, payload);
		return result;
	} catch (error) {
		throw error;
	}
}
