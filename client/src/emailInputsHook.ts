import {useSendInvitationsMutation} from './generated'
import {ChangeEvent, MutableRefObject, useEffect, useRef, useState} from 'react'
import {Input} from 'antd'

const usePrevious = <T, >(value: T): T => {
	const ref = useRef<T>()
	useEffect(() => {
		ref.current = value
	})
	return (ref as MutableRefObject<T>).current
}

export const useEmailInputs = () => {
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
		setSingleInputs(prevSingleInputs => prevSingleInputs
			.map((item, _index) => _index === index
				? {
					value,
					validation: item.validation || emailRegex.test(value)
				}
				: item
			))
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
		setMultiInputValidation(singleInputs.reduce((acc: boolean, cur) => acc && (!cur.value || cur.validation), true))
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
		const emails = multiInput.split(delimiterRegex).filter(email => email !== '')
		if (emails.length === 0) {
			setMultiInputValidation(false)
			return
		}
		sendInvitations({variables: {emails}})
			.then(res => {
				setSingleInputs(initialInputValues)
				setMultiInput('')
				setIsMultiple(false)
				setEmailsSent(res!.data!.sendInvitations.emails.length > 0
					? `Emails were successfully sent: ${res!.data!.sendInvitations.emails.join(', ')}`
					: 'No emails were sent. This can happen if all of the emails were already sent in the past')
			})
	}

	return {
		isMultiple,
		singleInputs,
		singleInputsRefs,
		multiInput,
		multiInputValidation,
		emailsSent,
		setEmailsSent,
		handleInputAdd,
		handleInputRemove,
		handleSingleInputChange,
		validateSingleInputChange,
		handleEnterPress,
		handleMultiInputChange,
		handleSwitchToMulti,
		handleSwitchToSingle,
		handleSingleSubmit,
		handleMultiSubmit
	}
}
