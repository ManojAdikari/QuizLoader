document.addEventListener('DOMContentLoaded', (event) => {

	

	//variables 
	const initialTime = 75;
	var time = 75;
	var score = 0;
	var qCount = 0;
	var timeset;
	var answers = document.querySelectorAll('#questionscontainer button');
    var questions = [
        {
          title: "Commonly used data types DO NOT include:",
          choices: ["strings", "booleans", "alerts", "numbers"],
          answer: "alerts"
        },
        {
          title: "The condition in an if / else statement is enclosed within ____.",
          choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
          answer: "parentheses"
        },
        {
          title: "Arrays in Javascript can be used to store ____.",
          choices: ["numbers and stringsr", "other arrays", "booleans", "all of the above"],
          answer: "all of the above"
        },
        {
          title: "String values must be enclosed within ____ when being assigned to variables.",
          choices: ["commas", "curly brackets", "quotes", "parenthesis"],
          answer: "quotes"
        },
        {
          title: "A very useful tool for used during development and debugging for printing content to the debugger is",
          choices: ["Javascript", "terminal / bash", "for loops", "console log"],
          answer: "console log"
        },
      
      ];



	
	let recordsArray = [];
	
	(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];



	let queryElement = (element) => {
		return document.querySelector(element);
	}

	
	let onlyDisplaySection = (element) => {
		let sections = document.querySelectorAll("section");
		Array.from(sections).forEach((userItem) => {
			userItem.classList.add('hide');
		});
		queryElement(element).classList.remove('hide');
	}

	
	let recordsHtmlReset = () => {
		queryElement('#highScores div').innerHTML = "";
		var i = 1;
		recordsArray.sort((a, b) => b.score - a.score);
		Array.from(recordsArray).forEach(check =>
		{
			var scores = document.createElement("div");
			scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
			queryElement('#highScores div').appendChild(scores);
			i = i + 1
		});
		i = 0;
		Array.from(answers).forEach(answer => {
			answer.classList.remove('disable');
		});
	}

	//  set the question 
	let setQuestionData = () => {

        var btnquestion1 =queryElement('#questionscontainer button:nth-of-type(1)');
        var btnquestion2 =queryElement('#questionscontainer button:nth-of-type(2)');
        var btnquestion3 =queryElement('#questionscontainer button:nth-of-type(3)');
        var btnquestion4 =queryElement('#questionscontainer button:nth-of-type(4)');
		queryElement('#questionscontainer p').innerHTML = questions[qCount].title;
		btnquestion1.innerHTML = `1. ${questions[qCount].choices[0]}`;
		btnquestion2.innerHTML = `2. ${questions[qCount].choices[1]}`;
		btnquestion3.innerHTML = `3. ${questions[qCount].choices[2]}`;
		btnquestion4.innerHTML = `4. ${questions[qCount].choices[3]}`;
	}


	let quizUpdate = (answerCopy) => {
		queryElement('#lblscore p').innerHTML = answerCopy;
		queryElement('#lblscore').classList.remove('invisible', scoreIndicator());
		Array.from(answers).forEach(answer =>
		{
			answer.classList.add('disable');
		});


		setTimeout(() => {
			if (qCount === questions.length) {
				onlyDisplaySection("#finish");
				time = 0;
				queryElement('#time').innerHTML = time;
			} else {
			
				setQuestionData();
			
				Array.from(answers).forEach(answer => {
					answer.classList.remove('disable');
				});
			}
		}, 1000);
	}


	let myTimer = () => {
		if (time > 0) {
			time = time - 1;
			queryElement('#time').innerHTML = time;
		} else {
			clearInterval(clock);
			queryElement('#score').innerHTML = score;
			onlyDisplaySection("#finish");
		}
	}


	// starts questions timer
	let clock;
	queryElement("#intro button").addEventListener("click", (e) => {

		setQuestionData();
		onlyDisplaySection("#questionscontainer");
		clock = setInterval(myTimer, 1000);
	});



	let scoreIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
		    queryElement('#lblscore').classList.add('invisible');
		}, 1000);
	}


	// check  answer. 
    Array.from(answers).forEach(check => {
		check.addEventListener('click', function (event) {
			
			if (this.innerHTML.substring(3, this.length) === questions[qCount].answer) {
				score = score + 1;
				qCount = qCount + 1;
				quizUpdate("Correct");
			}else{
				
				time = time - 10;
				qCount = qCount + 1;
				quizUpdate("Wrong");
			}
		});
	});


	
	let errorIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
			queryElement('#errorIndicator').classList.add('invisible');
		}, 3000);
	}

	// Record scores
	queryElement("#records button").addEventListener("click", () => {
		let initialsRecord = queryElement('#initials').value;
		if (initialsRecord === ''){
			queryElement('#errorIndicator p').innerHTML = "Please enter your name";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
			queryElement('#errorIndicator p').innerHTML = "Only letters for initials allowed.";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} 
         else {
			
			recordsArray.push({
				"initialRecord": initialsRecord,
				"score": score
			});
		
			localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
			queryElement('#highScores div').innerHTML = '';
			onlyDisplaySection("#highScores");
			recordsHtmlReset();
			queryElement("#initials").value = '';
		}
	});

	

	// Clears highscores 
	queryElement("#clearScores").addEventListener("click", () => {
		recordsArray = [];
		queryElement('#highScores div').innerHTML = "";
		localStorage.removeItem('recordsArray');
	});

	// Clear all 
	queryElement("#reset").addEventListener("click", () => {
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#intro");
	});

	// view the high scores.
	queryElement("#scores").addEventListener("click", (e) => {


	
		e.preventDefault();
		clearInterval(clock);
		queryElement('#time').innerHTML = 0;
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#highScores");
		recordsHtmlReset();
	});

});