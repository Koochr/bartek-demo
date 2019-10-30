import React, {FunctionComponent, useState, Fragment, ChangeEvent, useRef, useEffect, MutableRefObject} from 'react'
import {Button, Input} from 'antd'
import {useSendInvitationsMutation} from './generated'

const usePrevious = <T, >(value: T): T => {
	const ref = useRef<T>()
	useEffect(() => {
		ref.current = value
	})
	return (ref as MutableRefObject<T>).current
}

const App: FunctionComponent = () => {

	const emailRegex = /^\s*[\w.]+@\w+\.\w+\s*$/
	const delimiterRegex = /[:,\n;\t]/
	const initialInputValues = [{value: '', validation: true}]

	const [sendInvitations] = useSendInvitationsMutation()

	const [emailsSent, setEmailsSent] = useState('')
	const [isMultiple, setIsMultiple] = useState(false)

	const [singleInputs, setSingleInputs] = useState(initialInputValues)

	const [multiInput, setMultiInput] = useState('')
	const [multiInputValidation, setMultiInputValidation] = useState(false)

	const singleInputsRefs = useRef<Input[]>([])
	const prevSingleInputs = usePrevious(singleInputs)
	useEffect(() => {
		if (prevSingleInputs && (prevSingleInputs!.length < singleInputs.length)) {
			singleInputsRefs.current[singleInputs.length - 1].focus()
		}
	}, [prevSingleInputs, singleInputs.length])

	const handleInputAdd = () => {
		setSingleInputs([...singleInputs, {value: '', validation: true}])
	}

	const handleInputRemove = (index: number) => {
		setSingleInputs(singleInputs.slice(0, index).concat(singleInputs.slice(index + 1)))
	}

	const handleSingleInputChange = (value: string, index: number) => {
		const updatedSingleInputs = [...singleInputs]
		updatedSingleInputs[index] = {
			...updatedSingleInputs[index],
			value
		}
		setSingleInputs(updatedSingleInputs)
	}

	const validateSingleInputChange = (index: number) => {
		const updatedSingleInputs = [...singleInputs]
		updatedSingleInputs[index] = {
			...updatedSingleInputs[index],
			validation: !updatedSingleInputs[index].value || emailRegex.test(updatedSingleInputs[index].value)
		}
		setSingleInputs(updatedSingleInputs)
	}

	const handleEnterPress = (index: number) => {
		index === singleInputs.length - 1 ? handleInputAdd() : singleInputsRefs.current[index + 1].focus()
	}

	const handleMultiInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMultiInput(e.target.value)
		const multiInputEmails = e.target.value.split(delimiterRegex).filter(email => email !== '')
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

	const handleSwitchToSingle = () => {
		setMultiInput('')
		setMultiInputValidation(false)
		setIsMultiple(false)
	}

	const handleSingleSubmit = () => {
		const updatedSingleInputs = singleInputs
			.filter((item, index) => !!item.value || index === 0)
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

	const renderSingleInput = () => (
		<Fragment>
			<div className='container-inner'>
				{(singleInputs.map((input, index) => (
					<div className='input-wrapper-outer' key={index}>
						<div className='input-wrapper'>
							<Input
								ref={ref => singleInputsRefs.current[index] = ref!}
								value={input.value}
								onChange={e => {handleSingleInputChange(e.target.value, index)}}
								placeholder="name@company.com"
								onPressEnter={() => {handleEnterPress(index)}}
								onBlur={() => {validateSingleInputChange(index)}}
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
		</Fragment>
	)

	const renderMultipleInput = () => (
		<Fragment>
      Enter multiple email addresses separated by commas
			<Input.TextArea
				rows={5}
				value={multiInput}
				onChange={handleMultiInputChange}
				placeholder="name@company.com, name@company.com, name@company.com"
			/>
			<div className='validation-error'>
				{!multiInputValidation && 'Please enter multiple valid email addresses'}
			</div>
		</Fragment>
	)

	return (
		<div className='container'>
			{isMultiple ? renderMultipleInput() : renderSingleInput()}
			<div className="submit-buttons-wrapper">
				<Button
					onClick={isMultiple ? handleMultiSubmit : handleSingleSubmit}
					type='primary'
				>
          Send invites
				</Button>
				{isMultiple && <Button
					onClick={handleSwitchToSingle}
					type='default'
				>
          Cancel
				</Button>}
			</div>
		</div>
	)
}

export default App
