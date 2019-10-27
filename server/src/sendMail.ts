import nodemailer = require('nodemailer')
let transporter

export const init = async (): Promise<void> => {
	const testAccount = await nodemailer.createTestAccount()
	transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		}
	})
}

export const sendMail = async (target: string): Promise<void> => {
	const info = await transporter.sendMail({
		from: '"Test Account" <test@example.com>',
		to: target,
		subject: 'Test email',
		text: 'Hello!',
		html: '<b>Hello!</b>'
	})

	// eslint-disable-next-line no-console
	console.log('Message sent: %s', info.messageId)
	// eslint-disable-next-line no-console
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
