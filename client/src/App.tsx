import React, {FunctionComponent, Fragment} from 'react'
import {Button, Input} from 'antd'
import {useEmailInputs} from './emailInputsHook'

const App: FunctionComponent = () => {

	const {
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
	} = useEmailInputs()

	const renderEmailsSent = () => (
		<Fragment>
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
		</Fragment>
	)

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
			{emailsSent
				? renderEmailsSent()
				: <Fragment>
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
				</Fragment>}
		</div>
	)
}

export default App
