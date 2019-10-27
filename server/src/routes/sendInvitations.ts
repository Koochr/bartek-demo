import {UserInputError} from 'apollo-server'
import {Invitation} from '../generated/index'
import {sendMail} from '../sendMail'

const sentEmails = []

export const sendInvitations = async (_: any, {emails}: Invitation): Promise<Invitation> => {
	const emailRegex = /[\w.]+@\w+\.\w+/
	for (const email of emails) {
		if (!emailRegex.test(email)) {
			throw new UserInputError(`Wrong email format: ${email}`)
		}
	}
	const successfullySentEmails = []
	for (const email of emails) {
		if (!sentEmails.includes(email)) {
			// eslint-disable-next-line no-console
			console.log(`Sending email to ${email}...`)
			await sendMail(email)
			sentEmails.push(email)
			successfullySentEmails.push(email)
		} else {
			// eslint-disable-next-line no-console
			console.log(`Email to ${email} already sent, skipping...`)
		}
	}
	return {emails: successfullySentEmails}
}
