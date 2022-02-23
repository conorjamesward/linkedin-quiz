import {useState, useEffect} from 'react'
import { Question } from './Question'

export const ShortQuiz = ({quiz, submitAnswers}) => {

  const [shortQuiz, setShortQuiz] = useState(null)

  const getRandomShortQuiz = () => {
    const randomIndex = () => Math.floor(Math.random() * quiz.questions.length - 1) 
    const itorator = Array(10).fill(0)
    let newShortQuiz = []
    itorator.forEach(() => {
      const getNewQuestion = () => {
        let newQuestion = quiz.questions[randomIndex()]
        if(newShortQuiz.includes(newQuestion)){
          return getNewQuestion()
        }
        return newQuestion
      }
      newShortQuiz.push(getNewQuestion())
    })
    return newShortQuiz
  }

  useEffect(() => {
    setShortQuiz(getRandomShortQuiz())
  },[])

  const [testOver, setTestOver] = useState(false)
  const [answers, setAnswers] = useState({})

  const recordChoice = (question) => {
    const updateAnswers = answers
    updateAnswers[question.number] = question
    setAnswers(updateAnswers)
  }

  const getTestResults = () => {
    setTestOver(true)
    submitAnswers(answers, shortQuiz.length)
  }

  return (
    <div>
      <h1>{quiz.quizTitle}</h1>
      {shortQuiz &&
        shortQuiz.map(question => <Question key={question.number} current={question} recordChoice={recordChoice} testOver={testOver}/>)
      }
      <button onClick={getTestResults}>Finish</button>
    </div>
  )
}