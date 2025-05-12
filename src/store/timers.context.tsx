import { type ReactNode , createContext, useContext, useReducer } from "react";

type Timer = {
    name: string;
    duration: number;
};

type TimersState = {
    isRunning: boolean;
    timers: Timer[];
};

const initialState: TimersState = {
    isRunning: true,
    timers: []
}
//Create a new context type to contain the data and the methods to manage the state of the timers across
//the different componets in the app.
type TimersContextValue = TimersState & {
    addTimer: (timerData : Timer) => void,
    startTimers: () => void,
    stopTimers: () => void
};

export const TimersContext = createContext<TimersContextValue | null>(null);

//Create a custom hook to expose a context
export function useTimersContext(){
    const timersCtx = useContext(TimersContext);  
    if(timersCtx === null){
        throw new Error('TimersContext is null- that should never be null');
    }
    return timersCtx; 
}

type TimersContextProviderProps = {
    children: ReactNode;
}
type StartTimersAction = {
    type: 'START_TIMERS';
}

type StopTimersAction = {
    type: 'STOP_TIMERS';
}

type AddTimerAction = {
    type: 'ADD_TIMER',
    payload: Timer
}

type Action = StartTimersAction | StopTimersAction | AddTimerAction;

function timersReducer(state: TimersState, action: Action) : TimersState{
    if(action.type === 'START_TIMERS'){
        return {
            ...state,
            isRunning: true
        }
    }

    if(action.type === 'STOP_TIMERS'){
        return {
            ...state,
            isRunning: false
        }
    }

    if(action.type === 'ADD_TIMER'){
        return{
            ...state,
            timers: [
                ...state.timers,
                {
                    name: action.payload.name,
                    duration: action.payload.duration
                }
            ]
        }
    }
    return state;
}

export default function TimersContextProvider({children} : TimersContextProviderProps){
    const [timersState, dispatch] = useReducer(timersReducer,initialState)
    const ctx: TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,
        addTimer(timerData){
            dispatch({type : "ADD_TIMER", payload: timerData});
        },
        startTimers(){
            dispatch({type: 'START_TIMERS'});
        },
        stopTimers() {
            dispatch({type: 'STOP_TIMERS'});
        },
    }
    return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
}