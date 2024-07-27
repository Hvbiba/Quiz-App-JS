class Settings {
    constructor() {
        // Get all elements from the HTML
        this.settingDom = document.getElementById('container');
        this.categoryButtons = [
            document.getElementById('9'),
            document.getElementById('18'),
            document.getElementById('19')
        ];
        this.numberButtons = [
            document.getElementById('5'),
            document.getElementById('10'),
            document.getElementById('15')
        ];
        this.levelButtons = [
            document.getElementById('easy'),
            document.getElementById('medium'),
            document.getElementById('hard')
        ];

        this.startBtn = document.getElementById('start-btn');
        this.quizContainer = document.getElementById('quizContainer');
        this.header = document.getElementById('header');
        this.endBtn = document.getElementById('endBtn')

        // Add event listeners to buttons
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (event) => this.selectCategory(event.target.id));
        });
        this.numberButtons.forEach(button => {
            button.addEventListener('click', (event) => this.selectNumber(event.target.id));
        });
        this.levelButtons.forEach(button => {
            button.addEventListener('click', (event) => this.selectLevel(event.target.id));
        });

        // Add event listener to start button
        this.startBtn.addEventListener('click', () => this.startQuizApp());
    }

    // Method to select category
    selectCategory(id) {
        this.selectedCategory = id;
        console.log('Selected category:', this.selectedCategory);
        document.getElementById('categories').innerHTML = `Category ID:${this.selectedCategory} `;
    }

    // Method to select number of questions
    selectNumber(id) {
        this.selectedNumber = id;
        console.log('Selected number of questions:', this.selectedNumber);
        document.getElementById('number').innerHTML = `${this.selectedNumber} `;
    }

    // Method to select difficulty level
    selectLevel(id) {
        this.selectedLevel = id;
        console.log('Selected difficulty level:', this.selectedLevel);
        document.getElementById('level').innerHTML = `${this.selectedLevel} `;
    }

    // Method to start the quiz
    async startQuizApp(){
        console.log("Quiz started");

        const n = this.selectedNumber;
        const id = this.selectedCategory;
        const x = this.selectedLevel;

        if (n && id && x) {
            try {
                const key = `https://opentdb.com/api.php?amount=${n}&category=${id}&difficulty=${x}&type=multiple`;
                const response = await fetch(key);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data.results);
                
                
                if (data.results.length > 0) {
                    this.toggleToStart(data.results);
                    this.toggleToResult(data.results);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    }

    // Method to toggle settings and questions page
    toggleToStart(result) {
        let html = '';
        let count = 1;

        // Generate HTML content for quiz questions and answers
        result.forEach(element => {
            html += `
            <div id='full-quiz'>
                <div id="display-Q">
                    <div id="count"><h5>Question: ${count++}</h5></div>
                    <div class="container">
                        <h5 id="question">${element.question}</h5>
                        <form id="quiz-form">
                            <div>
                                <input type="radio" name="answer" value="a">
                                <label for="a">${element.correct_answer}</label>
                            </div>
                            <div>
                                <input type="radio" name="answer" value="b">
                                <label for="b">${element.incorrect_answers[0]}</label><br>
                            </div>
                            <div>
                                <input type="radio" name="answer" value="c">
                                <label for="c">${element.incorrect_answers[1]}</label><br>
                            </div>
                            <div>
                                <input type="radio" name="answer" value="d">
                                <label for="d">${element.incorrect_answers[2]}</label><br>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            `;
        });

        if (this.settingDom) {
            this.settingDom.style.display = 'none';
        }
        if (this.quizContainer) {
            this.quizContainer.innerHTML = html;
        }


        // Add button in header next to Quiz app
        const head = `
           <h2>Quiz App</h2>
            <div>
                <button type="button" class="btn btn-danger" id="endBtn">End Quiz</button>
                <button type="button" class="btn btn-primary" id="home-link">Try Again</button>
            </div>
        `;
        if (this.header) {
            this.header.innerHTML = head;
            this.header.classList = 'header';
            document.getElementById('home-link').addEventListener('click', () => {
                this.resetQuiz();
            });
        }


        // Save the quiz state to local storage
        localStorage.setItem('quizState', JSON.stringify({ questions: result, count: count }));
    }

    // Method to display finnal result and message
    toggleToResult(arr) {
        let result = 0;
        let labels = document.querySelectorAll('label');
        let inputs = document.querySelectorAll('#quiz-form input');

    
        arr.forEach(function(question) {
            inputs.forEach(function(input) {
                input.addEventListener('click', function() {
                    // Check if the selected input matches the correct answer
                    if (input.nextElementSibling.textContent === question.correct_answer) {
                        if(input.checked){
                            console.log('true');
                            result++;
                        }else{
                            console.log('answred')
                        }
                       
                    }
                });
            });
        });
        // Method to update result UI
        document.getElementById('endBtn').addEventListener('click', () => this.displayresult(result, arr.length));
    }
    

    //methode to update result ui
    displayresult(reslt , finnal){
        let html='';
        let finnalResult = document.getElementById('result');
        this.quizContainer.style.display='none';
        document.getElementById('endBtn').innerHTML='Quiz Ended';
        let percentage = (+reslt / +finnal)*100;
        if(percentage >= 75){
            html=`
                <h4>You Got ${reslt} / ${finnal} <br>Grad : A</h4>
                <h2>Good Job,Friend</h2>
            `;
        }else if(percentage >= 75){
            html=`
            <h4>You Got ${reslt} / ${finnal}<br>Grad : B</h4>
            <h2>U Can Do Better</h2> `;
        }else{
            html=`
            <h4>You Got ${reslt} / ${finnal} <br>Grad : D</h4>
            <h2>Never Give Up,Try Again</h2> `;
        }
        

        if(finnalResult){
            finnalResult.innerHTML= html; 
            finnalResult.classList.add('result');
        }
    }

       // Method to restore quiz state from local storage
       restoreQuizState() {
        let savedState = localStorage.getItem('quizState');
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.questions && state.questions.length > 0) {
                this.toggleToStart(state.questions);
            }
        }
    }


    // Method to reset quiz and clear local storage
    resetQuiz() {
        localStorage.removeItem('quizState');
        location.href = './index.html';
    }
}


// Instantiate the Settings class after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const settings = new Settings();
    settings.restoreQuizState();
    settings.startQuizApp();
});
