import Container from './UI/Container.tsx';
import { useTimersContext, type Timer as TimerProps } from '../store/timers.context.tsx';
import { useEffect, useRef, useState } from 'react';

export default function Timer( {name ,duration} : TimerProps) {
  const intervalRef = useRef<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(duration * 1000);
  const {isRunning} = useTimersContext();
  //Stop the progress bar once it reaches 0 and clear the interval
  if(remainingTime <=0 && intervalRef.current){
    clearInterval(intervalRef.current);
  }
  //Update the progress bar every 50 miliseconds
  useEffect(() => {
    let timer: number;
    if(isRunning){
        timer = setInterval(function() {
        setRemainingTime((previousTime) => {
          if(previousTime <= 0){
            return previousTime;
          }
          return previousTime - 50;
        });
      }, 50);
      intervalRef.current = timer;
    }else if(intervalRef.current){
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  //Display the formatted remaining time upto 2 decimal places
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
  return (
    <Container as="article">
      <h2>{name}</h2>
      <p><progress max={duration * 1000} value={remainingTime} /></p>
      <p>{formattedRemainingTime}</p>
    </Container>
  );
}
