import axios from 'axios'
import {useState, useRef} from 'react'
import { Quiz } from './Quiz'
import {convertToKeys, textList, URLMap} from './URLData'

//https://www.bigomega.dev/markdown-parser

function App() {
  
  const [quiz, setQuiz] = useState(null)
  const [currentURL, setCurrentURL] = useState(null)
  const [quizType, setQuizType] = useState(null)

  const flashcard = useRef()
  const ten = useRef()
  const all = useRef()

  const updateURL = (e) => {
    console.log(convertToKeys(e.target.value))
    setCurrentURL(URLMap[convertToKeys(e.target.value)])
  }

  const getMarkdown = () => {
    axios.get(currentURL)
    .then(res => {
      setQuiz(res)
    })
  }

  const changeQuizType = (type) => { 
    setQuizType(type)
    if(type === 'flashcard'){
      flashcard.current.classList.replace('quizType', 'quizTypeSelected')
      ten.current.classList.replace('quizTypeSelected', 'quizType')
      all.current.classList.replace('quizTypeSelected', 'quizType')
    } else if (type === 'ten'){
      flashcard.current.classList.replace('quizTypeSelected', 'quizType')
      ten.current.classList.replace('quizType', 'quizTypeSelected')
      all.current.classList.replace('quizTypeSelected', 'quizType')
    } else {
      flashcard.current.classList.replace('quizTypeSelected', 'quizType')
      ten.current.classList.replace('quizTypeSelected', 'quizType')
      all.current.classList.replace('quizType', 'quizTypeSelected')
    }
  }

  const startQuiz = () => {
    getMarkdown()
  }

  const startOver = () => {
    setQuizType(null)
    setQuiz(null)
    setCurrentURL(null)
  }

  return (
    <div className='text-teal-900 space-y-2 border-teal-700 p-2'>
      {!quiz &&
        <select className='border-2 border-teal-700 space-x-4'
          onChange={updateURL} defaultValue="choose">
          {textList.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      }
      {
      currentURL && !quiz &&
          <div className='space-y-2'>
            <h4>Select Quiz Type To Take</h4>
            <label className='quizType'
              ref={flashcard}>
              <input className="hidden" type="radio" name="quizType" value="flashcard" onClick={() => changeQuizType('flashcard')}/>
              <i>Flashcard</i>
            </label>
            <label className='quizType'
              ref={ten}>
              <input className="hidden" type="radio" name="quizType" value="ten" onClick={() => changeQuizType('ten')}/>
              <i>Sample of 10</i>
            </label>
            <label className='quizType'
              ref={all}>
              <input className="hidden" type="radio" name="quizType" value="all" onClick={() => changeQuizType('all')}/>
              <i>All Questions</i>
            </label>
          </div>
      }
      {quizType && !quiz && <button onClick={startQuiz}>Start Quiz</button>}
      {
        quiz &&
        <div>
          <button onClick={startOver}>Start Over</button>
          <Quiz quiz={quiz} type={quizType}/>
        </div>
      }
    </div>
  );
}

export default App;
