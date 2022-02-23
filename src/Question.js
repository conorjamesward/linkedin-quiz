import React from "react"
import { useRef } from "react"

export const Question = ({current, recordChoice, testOver = false}) => {
  const choices = useRef()


  //! doesn't quite work
  const lineBreaks = (block, suffix) => {
    let lines = null
    try{
      lines = block.split('\n')
      return (
        <>
          {lines.map((line, i) => 
          <React.Fragment key={`${current.number}-${i}-${suffix}`}>
            {line}
            <br/>
          </React.Fragment>)}
        </>
      )
    } catch {
      lines = block[1].split('\n')
      return (
        <>
          {lines.map((line, i) => 
          <React.Fragment key={`${current.number}-${i}-${suffix}`}>
            {line}
            <br/>
          </React.Fragment>)}
        </>
      )
    }
  }

  const handleSelection = (e) => {
    if(!testOver){
      choices.current.childNodes.forEach(element => {
        if(element.childNodes[1].id === e){
          element.childNodes[1].classList.replace('choice', 'choiceSelected')
        } else {
          element.childNodes[1].classList.replace('choiceSelected', 'choice')
        }
      });
      recordChoice({answer:e, options:choices, rightAnswer:current.answer, number:current.number})
    }
  }

  return(
    <div className="border-teal-700 border-b-2 border-r-2">
      <div>
        <h5 className="font-bold py-2">Question {current.number}</h5>
        {current.question.type &&
          <div>
            <p>{current.question.content[0]}</p>
            <code>{lineBreaks(current.question.content[1])}</code>
          </div>
        }
        {current.question.type === null &&
          <p>{current.question.content[0]}</p>
        }
      </div>
      <div ref={choices}>
        {current.choices.map(choice => {
          if(choice.type){
            return (
              <label key={choice.id} onClick={() => handleSelection(choice.id)}>
                <input className="hidden" type="radio" name={current.number}/>
                <code id={choice.id} className="choice">
                  {lineBreaks(choice.content)}
                </code>
              </label>
            )
          }
          return (
            <label key={choice.id} onClick={() => handleSelection(choice.id)}>
              <input className="hidden" type="radio" name={current.number}/>
              <p id={choice.id} className="choice">
                {choice.content}
              </p>
            </label>
          )
        })}
      </div>
      {current.sourceOrInfo.length > 0 &&
        <details>
          <summary>References / More Information</summary>
          {
            current.sourceOrInfo.map((source, i) => <p key={`${current.number}-${i}-source`}>{source}</p>)
          }
        </details>
      }
    </div>
  )
}