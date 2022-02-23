import { useState, useEffect } from "react"
import { Flashcard } from "./Flashcard"
import { ShortQuiz } from "./ShortQuiz"
import { parseQuiz } from "./parseQuiz"
import { FullQuiz } from "./FullQuiz"

export const Quiz = ({quiz, type}) => {

  const [parsedQuiz, setParsedQuiz] = useState(null)
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    setParsedQuiz(parseQuiz(quiz))
  }, [quiz])

  const submitAnswers = (test, testLength) => {
    const checkAnswer = (choice, choices, rightAnswer) => {
      let correctAnswer
      const parseAnswer = () => parseInt(rightAnswer.split('-')[1])
      const parseAttempt = () => parseInt(choice.split('-')[1])
      choices.current.childNodes.forEach(element => {
        if(parseAttempt() === parseAnswer()){
          element.childNodes[1].classList.replace('choiceSelected', 'choiceRightAnswer')
          correctAnswer = true
        } else {
          element.childNodes[1].classList.replace('choiceSelected', 'choiceWrongAnswer')
          correctAnswer = false
        }
      });
      return correctAnswer
    }

    if(type === 'flashcard'){
      checkAnswer(test.answer, test.options, test.rightAnswer)
    } else {
      let right = 0
      let wrong = 0
      const total = testLength
      for (const number in test){
        if(checkAnswer(test[number].answer, test[number].options, test[number].rightAnswer)){
          right++
        } else {
          wrong++
        }
      }
      setStatistics({total:total, right:right, wrong:wrong, answered:right+wrong, skipped:total - (right + wrong)})
    }
    window.scrollTo(0,0)
  }

  return (
    <div>
      { parsedQuiz &&
        <h3 className="font-extrabold text-2xl">{parsedQuiz.title}</h3>
      }
      {statistics &&
        <div>
          <div>
            <div>
              <p>{`Total Questions: ${statistics.total}`}</p>
              <p>{`Skipped Questions: ${statistics.skipped}`}</p>
            </div>
            <div>
              <p>{`Answered Correctly: ${statistics.right}`}</p>
              <p>{`Answered Incorrectly: ${statistics.wrong}`}</p>
            </div>
          </div>
          <div>
            <p>{`Grade excluding skipped: ${(statistics.right / (statistics.total - statistics.skipped)) * 100}%`}</p>
            <p>{`Grade including skipped: ${(statistics.right / statistics.total) * 100}%`}</p>
          </div>
        </div>
      }
      {type === 'flashcard' && parsedQuiz &&
        <Flashcard quiz={parsedQuiz} submitAnswer={submitAnswers}/>
      }
      {type === 'ten' && parsedQuiz &&
        <ShortQuiz quiz={parsedQuiz} submitAnswers={submitAnswers}/>
      }
      {type === 'all' && parsedQuiz &&
        <FullQuiz quiz={parsedQuiz} submitAnswers={submitAnswers}/>
      }
    </div>
  )
}