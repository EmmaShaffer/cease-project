// JavaScript Document
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}




 var quiztitle = "Is this Item in a Cigarette?";

    /**
    * Set the information about your questions here. The correct answer string needs to match
    * the correct choice exactly, as it does string matching. (case sensitive)
    *
    */
    var quiz = [	 
		{
            "question"      :   "Paint",
            "image"         :   "paint2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Tolulene is used to manufacture paint.",
        },
		{
            "question"      :   "Roof Top",
            "image"         :   "roof1.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Tar is used for paving roads and coating roofs.",
        },
		{
            "question"      :   "Batteries",
            "image"         :   "batteries2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Both lead & Cadmium are found inside of batteries.",
        },
		{
            "question"      :   "Rocket",
            "image"         :   "rockets2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Methanol is the main component in rocket fuel.",
        },
		{
            "question"      :   "Soap",
            "image"         :   "handsoap2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "No",
            "explanation"   :   "Most soaps do NOT contain the same toxins as cigarettes.",
        },
		{
            "question"      :   "Roads",
            "image"         :   "roads2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Acetone is used for paving roads, coating roofs & removing nail polish.",
        },
		{
            "question"      :   "Lotion",
            "image"         :   "lotion2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "No",
            "explanation"   :   "Most Lotions do NOT contain the same toxins as cigarettes.",
        },
		{
            "question"      :   "Lighter Fluid",
            "image"         :   "lighter Fluid2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Butane is used in lighter fluid.",
        },
		{
            "question"      :   "Candle wax",
            "image"         :   "Candle Wax1.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "No",
            "explanation"   :   "Most candles do NOT contain the same toxins as cigarettes.",
        },
        {
            "question"      :   "Rat poison",
            "image"         :   "rat poison2.jpg",
            "choices"       :   [
                                    "Yes",
                                    "No"
                                ],
            "correct"       :   "Yes",
            "explanation"   :   "Arsenic is used in rat poison.",
        },

    ];


    /******* No need to edit below this line *********/
    var currentquestion = 0, submt=true, picked;

    jQuery(document).ready(function($){

        /**
         * HTML Encoding function for alt tags and attributes to prevent messy
         * data appearing inside tag attributes.
         */
        function htmlEncode(value){
          return $(document.createElement('div')).text(value).html();
        }

        /**
         * This will add the individual choices for each question to the ul#choice-block
         *
         * @param {choices} array The choices from each question
         */
        function addChoices(choices){
            if(typeof choices !== "undefined" && $.type(choices) == "array"){
                $('#choice-block').empty();
                for(var i=0;i<choices.length; i++){
                    $(document.createElement('li')).addClass('choice choice-box').attr('data-index', i).text(choices[i]).appendTo('#choice-block');                    
                }
            }
        }
        
        /**
         * Resets all of the fields to prepare for next question
         */
        function nextQuestion(){
            submt = true;
            $('#explanation').empty();
            $('#question').text(quiz[currentquestion]['question']);
            $('#pager').text('Question ' + Number(currentquestion + 1) + ' of ' + quiz.length);
           
			if(quiz[currentquestion].hasOwnProperty('image') && quiz[currentquestion]['image'] != ""){
                if($('#question-image').length == 0){
                    $(document.createElement('img')).addClass('question-image').attr('id', 'question-image').attr('src', quiz[currentquestion]['image']).attr('alt', htmlEncode(quiz[currentquestion]['question'])).insertAfter('#question');
                } else {
                    $('#question-image').attr('src', quiz[currentquestion]['image']).attr('alt', htmlEncode(quiz[currentquestion]['question']));
                }
            } else {
                $('#question-image').remove();
            }
            addChoices(quiz[currentquestion]['choices']);
            setupButtons();
        }

        /**
         * After a selection is submitted, checks if its the right answer
         *
         * @param {choice} number The li zero-based index of the choice picked
         */
        function processQuestion(choice){
            if(quiz[currentquestion]['choices'][choice] == quiz[currentquestion]['correct']){
                $('.choice').eq(choice).css({'background-color':'#50D943'});
                $('#explanation').html('<strong><center>Correct!</center></strong> ' + htmlEncode(quiz[currentquestion]['explanation']));
            } else {
                $('.choice').eq(choice).css({'background-color':'#D92623'});
                $('#explanation').html('<strong>Incorrect!</strong> ' + htmlEncode(quiz[currentquestion]['explanation']));
            }
            currentquestion++;
            $('#submitbutton').html('Submit &raquo;').on('click', function(){
                if(currentquestion === quiz.length){
                    sendAnswerToDatabaseA1(currentquestion - 1, quiz[currentquestion - 1]['choices'][choice]).then(() =>{
                        completeActivityOnDatabaseA1().then(() =>{
                            endQuiz();
                        });
                    }); 
					
				} else {
                    $(this).text('Check Answer').css({'color':'#222'}).off('click');
                    sendAnswerToDatabaseA1(currentquestion - 1, quiz[currentquestion - 1]['choices'][choice]).then(() =>{
                        nextQuestion();
                    }); 
                }
            })
		}
			/*$('#submitbutton').html('SUBMIT &raquo;').on('click', function(){
				if(currentquestion == quiz.length){
					endQuiz();
				}*/
		
        
		function endQuiz(){
			
			window.location.replace("video1.html")
		}
        /**
         * Sets up the event listeners for each button.
         */
        function setupButtons(){
            $('.choice').on('mouseover', function(){
                $(this).css({'background-color':'#e1e1e1'});
            });
            $('.choice').on('mouseout', function(){
                $(this).css({'background-color':'#fff'});
            })
            $('.choice').on('click', function(){
                picked = $(this).attr('data-index');
                $('.choice').removeAttr('style').off('mouseout mouseover');
                $(this).css({'border-color':'#222','font-weight':700,'background-color':'#c1c1c1'});
                if(submt){
                    submt=false;
                    $('#submitbutton').css({'color':'#000'}).on('click', function(){
                        $('.choice').off('click');
                        $(this).off('click');
                        processQuestion(picked);
                    });
                }
            })
        }
        
        /*
         * Quiz ends, display a message
         
        function endQuiz(){
			quiz[currentquestion]['choices'][choice]
            /*$('#explanation').empty();
            $('#question').empty();
            $('#choice-block').empty();
            $('#submitbutton').remove();
            $('#question').text("You got " + score + " out of " + quiz.length + " correct.");
            $(document.createElement('h2')).css({'text-align':'center', 'font-size':'4em'}).text(Math.round(score/quiz.length * 100) + '%').insertAfter('#question');
        }

        /**
         * Runs the first time and creates all of the elements for the quiz
         */
function init(){
            //add title
            if(typeof quiztitle !== "undefined" && $.type(quiztitle) === "string"){
                $(document.createElement('h1')).text(quiztitle).appendTo('#frame');
            } else {
                $(document.createElement('h1')).text("Quiz").appendTo('#frame');
            }

            //add pager and questions
            if(typeof quiz !== "undefined" && $.type(quiz) === "array"){
                //add pager
                $(document.createElement('p')).addClass('pager').attr('id','pager').text('Question 1 of ' + quiz.length).appendTo('#frame');
                //add first question
                $(document.createElement('h2')).addClass('question').attr('id', 'question').text(quiz[0]['question']).appendTo('#frame');
                //add image if present
                if(quiz[0].hasOwnProperty('image') && quiz[0]['image'] != ""){
                    $(document.createElement('img')).addClass('question-image').attr('id', 'question-image').attr('src', quiz[0]['image']).attr('alt', htmlEncode(quiz[0]['question'])).appendTo('#frame');
                }
                $(document.createElement('p')).addClass('explanation').attr('id','explanation').html('&nbsp;').appendTo('#frame');
            
                //questions holder
                $(document.createElement('ul')).attr('id', 'choice-block').appendTo('#frame');
            
                //add choices
                addChoices(quiz[0]['choices']);
            
                //add submit button
                $(document.createElement('div')).attr('id', 'submitbutton').text('Check Answer').css({'font-weight':700,'color':'#222','padding':'30px '}).appendTo('#frame');
            
                setupButtons();
            }
        }
        
        init();
    });


$(function(){
  var introguide = introJs();
  // var startbtn   = $('#startdemotour');

  introguide.setOptions({
    steps: [
        {
          element: '.sidebar-area',
          intro: 'Use this bar as a reference for your progress in Lesson 1.',
          position: 'bottom'
        },
        {
          element: '.progress1',
          intro: 'The "clock" symbol shows the present activity you are working on',
          position: 'bottom'
        },
        {
          element: '.site-main',
          intro: 'Select "Yes" if you think any of the items in the pictures contain chemicals that can be found in a cigarette. Learn and have fun!',
          position: 'bottom'
        }
        ],
 hints: [
        { hint: 'First hint', element: '.choice',
          hintAnimation: true
		},
        { hint: 'Second hint', element: '#question', hintAnimation: true }
    ]  
});
introguide.start();
});

