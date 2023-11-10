import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles'
import { Countdown } from './Countdown'
import { NewCyclesForm } from './NewCyclesForm'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Informe a tarefa'),
	minutesAmount: zod
		.number()
		.min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
	const { activeCycle, CreateNewCycle, InterruptCurrentCycle } =
		useContext(CyclesContext)

	const newCycleForm = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		},
	}) // newCycleForm

	const { handleSubmit, watch /*, reset */ } = newCycleForm

	const task = watch('task')
	const isSubmitDisable = !task

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(CreateNewCycle)}>
				<FormProvider {...newCycleForm}>
					<NewCyclesForm />
				</FormProvider>
				<Countdown />

				{activeCycle ? (
					<StopCountdownButton onClick={InterruptCurrentCycle} type="button">
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisable} type="submit">
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	)
}
