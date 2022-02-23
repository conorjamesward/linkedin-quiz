import { Question } from "./Question"
import { useState } from "react"

export const FullQuiz = ({quiz, submitAnswers}) => {

  const [testOver, setTestOver] = useState(false)
  const [answers, setAnswers] = useState({})

  const recordChoice = (question) => {
    const updateAnswers = answers
    updateAnswers[question.number] = question
    setAnswers(updateAnswers)
  }

  const getTestResults = () => {
    setTestOver(true)
    submitAnswers(answers, quiz.questions.length)
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map(question => 
        <Question key={question.number} current={question} recordChoice={recordChoice} testOver={testOver}/>)
      }
      <button onClick={getTestResults}>Submit</button>
    </div>
  )
}