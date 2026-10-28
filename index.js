import React from "react"
import ReactDOM from "react-dom"

function App() {
    const [isQuizStarted, setIsQuizStarted] = React.useState(false)
    const [questions, setQuestions] = React.useState([])
    const [submitted, setSubmitted] = React.useState(false)
    const [score, setScore] = React.useState(0)

    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => {
                const fetchedQuestions = data.results.map(q => {
                    return {
                        ...q,
                        allAnswers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                        selectedAnswer: null
                    }
                })
                setQuestions(fetchedQuestions)
            })
    }, [])

    function startQuiz() {
        setIsQuizStarted(true)
    }

    function handleSelect(questionIndex, answer) {
        if (submitted) return
        setQuestions(prevQuestions => {
            return prevQuestions.map((q, index) => {
                if (index === questionIndex) {
                    return { ...q, selectedAnswer: answer }
                }
                return q
            })
        })
    }

    function checkAnswers() {
        let correctCount = 0
        questions.forEach(q => {
            if (q.selectedAnswer === q.correct_answer) {
                correctCount++
            }
        })
        setScore(correctCount)
        setSubmitted(true)
    }

    function playAgain() {
        setIsQuizStarted(false)
        setSubmitted(false)
        setScore(0)
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => {
                const fetchedQuestions = data.results.map(q => {
                    return {
                        ...q,
                        allAnswers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                        selectedAnswer: null
                    }
                })
                setQuestions(fetchedQuestions)
            })
    }

    return (
        <main>
            {isQuizStarted ? (
                <div className="quiz-container">
                    {questions.map((q, index) => (
                        <div key={index} className="question-card">
                            <h3>{q.question}</h3>
                            <div className="answer-container">
                                {q.allAnswers.map((answer, ansIndex) => {
                                    const isSelected = q.selectedAnswer === answer
                                    const isCorrect = answer === q.correct_answer
                                    
                                    let bgColor = "#F5F7FB"
                                    if (submitted) {
                                        if (isCorrect) {
                                            bgColor = "#94D7A2"
                                        } else if (isSelected && !isCorrect) {
                                            bgColor = "#F8BCBC"
                                        }
                                    } else if (isSelected) {
                                        bgColor = "#D6DBF5"
                                    }
                                    
                                    const style = { backgroundColor: bgColor }

                                    return (
                                        <button 
                                            key={ansIndex}
                                            className="answer-btn"
                                            style={style}
                                            onClick={() => handleSelect(index, answer)}
                                        >
                                            {answer}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {submitted ? (
                        <div className="finish-container">
                            <span className="score-text">You scored {score}/{questions.length} correct answers</span>
                            <button className="check-btn" onClick={playAgain}>Play again</button>
                        </div>
                    ) : (
                        <button className="check-btn" onClick={checkAnswers}>Check answers</button>
                    )}
                </div>
            ) : (
                <div className="start-screen">
                    <h1>Quizzical</h1>
                    <p>Test your knowledge with trivia!</p>
                    <button className="start-btn" onClick={startQuiz}>
                        Start Quiz
                    </button>
                </div>
            )}
        </main>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))