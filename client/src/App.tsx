import React, {FunctionComponent, useState, Fragment, ChangeEvent} from 'react'
import {Button, Input, Switch} from 'antd'
import {useSendInvitationsMutation} from './generated'

const App: FunctionComponent = () => {
	const emailRegex = /[\w.]+@\w+\.\w+/
	const singleInputShape = {value: '', validation: false}

	const [sendInvitations] = useSendInvitationsMutation()
	const [emailsSent, setEmailsSent] = useState<string[] | []>([])
	const [isMultiple, setIsMultiple] = useState(false)
	const [singleInputs, setSingleInputs] = useState([singleInputShape])
	const [multiInput, setMultiInput] = useState('')
	const [multiInputValidation, setMultiInputValidation] = useState(false)

	const handleInputAdd = () => {
		setSingleInputs([...singleInputs, singleInputShape])
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
		const multiInputEmails = multiInput.split(',')
		setMultiInputValidation(
			multiInputEmails.length > 0
      && multiInputEmails.reduce((acc: boolean, cur) => acc && emailRegex.test(cur), true)
		)
	}

	const handleSingleSubmit = () => {
		sendInvitations({variables: {emails: singleInputs.map(input => input.value)}})
			.then(res => {
				setSingleInputs([singleInputShape])
				setMultiInput('')
				setIsMultiple(false)
				setEmailsSent(res!.data!.sendInvitations.emails)
			})
	}

	const handleMultiSubmit = () => {
		sendInvitations({variables: {emails: multiInput.split(',')}})
			.then(res => {
				setSingleInputs([singleInputShape])
				setMultiInput('')
				setIsMultiple(false)
				setEmailsSent(res!.data!.sendInvitations.emails)
			})
	}

	if (emailsSent.length > 0) {
		return (
			<div className='container'>
				<div className='success-text'>
					{`Emails successfully sent: ${emailsSent.join(', ')}`}
				</div>
				<div className='success-button-wrapper'>
					<Button
						type='primary'
						onClick={() => {setEmailsSent([])}}
					>
            Go back
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='container'>
			<div className='switch-wrapper'>
				<p className='switch-text'>
          Add many at once
				</p>
				<Switch checked={isMultiple} onChange={setIsMultiple}/>
			</div>
			{isMultiple
				? (
					<Fragment>
						<Input.TextArea
							rows={5}
							value={multiInput}
							onChange={handleMultiInputChange}
						/>
						<div className='validation-error'>
							{!multiInputValidation && 'Please enter multiple valid email addresses, separated by comma'}
						</div>
						<Button
							onClick={handleMultiSubmit}
							disabled={!multiInputValidation}
							type='primary'
						>
              Submit
						</Button>
					</Fragment>
				)
				: <Fragment>
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
									disabled={index === 0}
								>
                  Remove
								</Button>
							</div>
							<div className='validation-error'>
								{!input.validation && 'Please enter a valid email'}
							</div>
						</div>
					)))}
					<div className='buttons-wrapper'>
						<Button
							onClick={handleInputAdd}
							disabled={singleInputs.length > 5}
							type='link'
						>
              Add another
						</Button>
						<Button
							onClick={handleSingleSubmit}
							disabled={!singleInputs.reduce((acc, cur) => acc && cur.validation, true)}
							type='primary'
						>
              Submit
						</Button>
					</div>
				</Fragment>}
		</div>
	)
}

export default App
