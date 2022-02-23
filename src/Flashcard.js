import {useState, useEffect, useCallback} from 'react'
import {Question} from './Question'

export const Flashcard = ({quiz, submitAnswer}) => {

  const [randomIndex, setRandomIndex] = useState(null)

  const getRandomIndex = useCallback(() => setRandomIndex(Math.floor(Math.random() * quiz.questions.length - 1)),[quiz])

  useEffect(()=>{
    quiz && getRandomIndex()
  },[quiz, getRandomIndex])

  return(
    <div>
      <h1>{quiz.quizTitle}</h1>
      {quiz && randomIndex && <Question current={quiz.questions[randomIndex]} recordChoice={submitAnswer}/> }
      <button className='border-2 border-teal-700 p-1 m-2 hover:bg-zinc-200' onClick={getRandomIndex}>Next</button>
    </div>
  )
}