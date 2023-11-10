import { ReactNode, createContext, useState } from 'react'

interface CreateCycleData {
	task: string
	minutesAmount: number
}

interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptDate?: Date
	finishedDate?: Date
}

interface CycleContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	markCurrentCycleAsFinished: () => void
	amountSecondsPassed: number
	setSecondsPassed: (seconds: number) => void
	CreateNewCycle: (data: CreateCycleData) => void
	InterruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CycleContextType)

interface CyclesContextProviderProps {
	children: ReactNode
}

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

	function markCurrentCycleAsFinished() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, finishedDate: new Date() }
				} else {
					return cycle
				}
			}),
		)
	}

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function CreateNewCycle(data: CreateCycleData) {
		const id = String(new Date().getTime())

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		setCycles((state) => [...state, newCycle])
		setActiveCycleId(id)
		setAmountSecondsPassed(0)

		/* reset() */
	}

	function InterruptCurrentCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptDate: new Date() }
				} else {
					return cycle
				}
			}),
		)

		setActiveCycleId(null)
	}

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				amountSecondsPassed,
				setSecondsPassed,
				CreateNewCycle,
				InterruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	)
}
