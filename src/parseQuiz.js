const sourceParser = (source, questionNumber, i) => {
  return source
}

const blockParser = (blockToParse, questionNumber, suffix, i) => {
  const blankLine = /\n{2}/
  //console.log(blockToParse)

  const block = (() => {
    if (blockToParse.match(/```/)){
      /*
      ``` indicates start or end of block, returning array from those splits should get something like: 
      [array type or \n, ...content lines, \n+ (end of block)]
      */
      return blockToParse.split(/```/) 
    }
    return [blockToParse.replace(blankLine,'')]// if not block, return minus any blank lines
  })()
  
  const type = (() => {
    return (
      block.length > 1 ? //if not a block (array longer than 1), type is null
      //after splitting on a newline, item 0 should be the type if any exists
      block[1].split(/\n/)[0] 
      : null
    )
  })()

  const content = block.map(line => line.startsWith(type) ? line.replace(type,'') : line)

  const newBlock = {
    id:(() => i !== undefined ? `${questionNumber}-${i}-${suffix}` : `${questionNumber}-${suffix}`)(),
    type:type,
    content:content
  }

  return newBlock
}

const questionParser = (questionToParse) => {
  const choiceStart = /-\s\[/

  const questionArray = questionToParse.split(choiceStart)

  const handleLastQuestionAndSources = questionArray.pop().split(/\n/)
    //didn't feel like figuring one regex for all of these
  const sourceArray = []
  const lastQuestion = []
  handleLastQuestionAndSources.forEach(line => {
    if(
      /^\[/.test(line) ||
      /^[0-9]+.\s/.test(line) ||
      /^NOTE:/.test(line) ||
      line.startsWith('**')
    ){
      sourceArray.push(line)
    } else {
      lastQuestion.push(line)
    }
  })
  questionArray.push(lastQuestion.join('\n'))

  //questions start with a number, that basically becomes the question ID
  const questionNumber = parseInt(questionArray[0].match(/^[0-9]+/))

  const newQuestion = {
    question: blockParser(questionArray.shift().replace(/^[0-9]+.\s/, ''), questionNumber, 'question'),
    number:questionNumber,
    answer:`${questionNumber}-${questionArray.findIndex((item) => /^x]\s/.test(item))}`,
    choices:questionArray.map((choice, i) => blockParser(choice.replace(/^\s\]/,'').replace(/^x\]/, ''), questionNumber, 'choice', i)),
    sourceOrInfo:sourceArray.map((source, i) => sourceParser(source, questionNumber, i))
  }

  return newQuestion
}

export const parseQuiz = (quiz) => {
  const hashtag = /#/g
  const startWithHashtag = /^#/
  const questionStart = /#+\sQ/

  let quizArray = quiz.data.split(questionStart)

  const quizDataStructure = {
    quizTitle:quizArray.shift().replace(hashtag, '').replace(/^\s/,'').replace(/\n+/, ''),
    questions:quizArray.map(question => questionParser(question.replace(startWithHashtag, '')))
  }

  return quizDataStructure
}