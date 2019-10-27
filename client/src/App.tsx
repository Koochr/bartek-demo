import React, {FunctionComponent, useState, Fragment, ChangeEvent} from 'react'
import {Button, Input} from 'antd'
import {useSendInvitationsMutation} from './generated'

const App: FunctionComponent = () => {

	const emailRegex = /[\w.]+@\w+\.\w+/
	const delimiterRegex = /[:,\n;\t]/
	const initialInputValues = [
		{value: '', validation: true},
		{value: '', validation: true},
		{value: '', validation: true}
	]

	const [sendInvitations] = useSendInvitationsMutation()
	const [emailsSent, setEmailsSent] = useState('')
	const [isMultiple, setIsMultiple] = useState(false)
	const [singleInputs, setSingleInputs] = useState(initialInputValues)
	const [multiInput, setMultiInput] = useState('')
	const [multiInputValidation, setMultiInputValidation] = useState(false)

	const handleInputAdd = () => {
		setSingleInputs([...singleInputs, {value: '', validation: true}])
	}

	const handleInputRemove = (index: number) => {
		setSingleInputs(singleInputs.slice(0, index).concat(singleInputs.slice(index + 1)))
	}

	const handleSingleInputChange = (value: string, index: number) => {
		const updatedSingleInputs = [...singleInputs]
		updatedSingleInputs[index] = {
			value,
			validation: emailRegex.test(value)
		}
		setSingleInputs(updatedSingleInputs)
	}

	const handleMultiInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMultiInput(e.target.value)
		const multiInputEmails = multiInput.split(delimiterRegex).filter(email => email !== '')
		setMultiInputValidation(
			multiInputEmails.length > 0
      && multiInputEmails.reduce((acc: boolean, cur) => acc && emailRegex.test(cur), true)
		)
	}

	const handleSwitchToMulti = () => {
		setMultiInput(singleInputs.filter(item => !!item.value).map(item => item.value).join(',\n'))
		setIsMultiple(true)
		setMultiInputValidation(singleInputs.reduce((acc: boolean, cur) => acc && cur.validation, true))
	}

	const handleSingleSubmit = () => {
		const updatedSingleInputs = singleInputs
			.filter(item => !!item.value)
			.map(item => ({...item, validation: emailRegex.test(item.value)}))
		if(!updatedSingleInputs.reduce((acc: boolean, cur) => acc && cur.validation, true)) {
			setSingleInputs(updatedSingleInputs)
			return
		}
		sendInvitations({variables: {emails: updatedSingleInputs.map(input => input.value)}})
			.then(res => {
				setSingleInputs(initialInputValues)
				setMultiInput('')
				setIsMultiple(false)
				setEmailsSent(res!.data!.sendInvitations.emails.length > 0
					? `Emails were successfully sent: ${res!.data!.sendInvitations.emails.join(', ')}`
					: 'No emails were sent. This can happen if all of the emails were already sent in the past')
			})
	}

	const handleMultiSubmit = () => {
		if (!multiInputValidation) return
		sendInvitations({variables: {emails: multiInput.split(delimiterRegex).filter(email => email !== '')}})
			.then(res => {
				setSingleInputs(initialInputValues)
				setMultiInput('')
				setIsMultiple(false)
				setEmailsSent(res!.data!.sendInvitations.emails.length > 0
					? `Emails were successfully sent: ${res!.data!.sendInvitations.emails.join(', ')}`
					: 'No emails were sent. This can happen if all of the emails were already sent in the past')
			})
	}

	if (emailsSent) {
		return (
			<div className='container'>
				<div className='success-text'>
					{emailsSent}
				</div>
				<div className='button-wrapper'>
					<Button
						type='primary'
						onClick={() => {setEmailsSent('')}}
					>
            Go back
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='container'>
			{isMultiple
				? (
					<Fragment>
            Enter multiple email addresses separated by commas
						<Input.TextArea
							rows={5}
							value={multiInput}
							onChange={handleMultiInputChange}
						/>
						<div className='validation-error'>
							{!multiInputValidation && 'Please enter multiple valid email addresses'}
						</div>
					</Fragment>
				)
				: <Fragment>
					<div className='container-inner'>
						{(singleInputs.map((input, index) => (
							<div className='input-wrapper-outer' key={index}>
								<div className='input-wrapper'>
									<Input
										value={input.value}
										onChange={e => {handleSingleInputChange(e.target.value, index)}}
									/>
									<Button
										onClick={() => {handleInputRemove(index)}}
										type='danger'
										ghost
										disabled={singleInputs.length === 1}
									>
                    X
									</Button>
								</div>
								<div className='validation-error'>
									{!input.validation && 'Invalid email address'}
								</div>
							</div>
						)))}
					</div>
					<div className='buttons-wrapper'>
						<Button
							onClick={handleInputAdd}
							type='link'
						>
              Add another
						</Button>
						<div className='or'>
              or
						</div>
						<Button
							onClick={handleSwitchToMulti}
							type='link'
						>
              Add many at once
						</Button>
					</div>
				</Fragment>}
			<Button
				onClick={isMultiple ? handleMultiSubmit : handleSingleSubmit}
				type='primary'
			>
        Send invites
			</Button>
		</div>
	)
}

export default App
