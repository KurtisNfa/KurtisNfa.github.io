// Sélection des éléments du DOM
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const errorSound = new Audio('sounds/error.mp3');
const successSound = new Audio('sounds/success.mp3');

// Événement déclenché lorsqu'on clique sur le bouton de démarrage
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); // Affiche la boîte d'informations
}

// Événement pour le bouton "Quitter"
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); // Cache la boîte d'informations
}

// Événement pour le bouton "Continuer" qui démarre le quiz
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); 
    quiz_box.classList.add("activeQuiz"); 
    showQuetions(0); // Affiche la première question
    queCounter(1); // Initialise le compteur de questions
    startTimer(15); // Démarre le chronomètre avec 15 secondes par question
    startTimerLine(0); // Initialise la barre de progression du temps
}

// Variables pour gérer l'état du quiz
let timeValue =  15; // Temps par question
let que_count = 0; // Compteur de la question actuelle
let que_numb = 1; // Numéro de la question affichée
let userScore = 0; // Score de l'utilisateur
let counter; // Chronomètre pour le temps par question
let counterLine; // Chronomètre pour la barre de progression
let widthValue = 0; // Largeur de la barre de progression

// Boutons de redémarrage et de sortie du quiz
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// Événement pour redémarrer le quiz après la fin
restart_quiz.onclick = ()=> {
    quiz_box.classList.add("activeQuiz"); 
    result_box.classList.remove("activeResult"); 
    // Réinitialisation des variables
    timeValue = 15; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); // Affiche la première question
    queCounter(que_numb); // Réinitialise le compteur de questions
    clearInterval(counter); // Stoppe les chronomètres
    clearInterval(counterLine); 
    startTimer(timeValue); // Redémarre le timer
    startTimerLine(widthValue); // Réinitialise la barre de progression
    timeText.textContent = "Time Left"; // Réinitialise le texte du timer
    next_btn.classList.remove("show"); // Cache le bouton "Suivant"
}

// Pour quitter le quiz et recharger la page
quit_quiz.onclick = ()=>{
    window.location.reload(); // Recharge la page
}

// Sélection du bouton "Suivant" et du compteur de questions
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// Événement pour passer à la question suivante
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ // Vérifie s'il reste des questions
        que_count++; // Passe à la question suivante
        que_numb++; 
        showQuetions(que_count); // Affiche la question suivante
        queCounter(que_numb); // Met à jour le compteur de questions
        clearInterval(counter); // Réinitialise le timer
        clearInterval(counterLine); 
        startTimer(timeValue); // Redémarre le timer
        startTimerLine(widthValue); 
        timeText.textContent = "Time Left"; // Réinitialise le texte
        next_btn.classList.remove("show"); // Cache le bouton "Suivant"
    }else{
        clearInterval(counter); 
        clearInterval(counterLine); 
        showResult(); // Affiche les résultats si toutes les questions sont terminées
    }
}

// Afficher les questions et options de réponse
function showQuetions(index){
    const que_text = document.querySelector(".que_text"); 
    // Affiche la question actuelle
    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    // Affiche les options de réponse
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';
    que_text.innerHTML = que_tag; 
    option_list.innerHTML = option_tag;
    
    // Ajoute un événement "onclick" à chaque option de réponse
    const option = option_list.querySelectorAll(".option");
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Lorsque l'utilisateur sélectionne une option de réponse
function optionSelected(answer){
    clearInterval(counter); // Stoppe le chronomètre principal
    clearInterval(counterLine); // Stoppe la barre de progression
    let userAns = answer.textContent; // Récupère le texte de l'option sélectionnée par l'utilisateur
    let correcAns = questions[que_count].answer; // Récupère la première bonne réponse de la question actuelle
    let correcAns2 = questions[que_count].answer2; // Récupère une éventuelle deuxième bonne réponse de la question actuelle
    const allOptions = option_list.children.length; // Récupère le nombre total d'options

    // Si l'utilisateur a sélectionné la bonne réponse
    if(userAns == correcAns || userAns == correcAns2){ 
        successSound.play(); // Joue le son de réussite
        answer.classList.add("correct"); // Ajoute la classe "correct" à l'option sélectionnée
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Ajoute une icône de validation
        userScore++; // Incrémente le score de l'utilisateur
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);

    // Si l'utilisateur a sélectionné la mauvaise réponse
    }else{
        answer.classList.add("incorrect"); // Ajoute la classe "incorrect" à l'option sélectionnée
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Ajoute une icône de croix
        console.log("Wrong Answer");
        errorSound.play(); // Joue le son d'erreur

        // Recherche et marque automatiquement la bonne réponse
        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns) {  
                option_list.children[i].setAttribute("class", "option correct"); 
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                console.log("Auto selected correct answer.");
            }
        }
    }
    // Désactive toutes les options de réponse après la sélection
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); 
    }
    next_btn.classList.add("show"); // Affiche le bouton "Suivant"
}

// Boîte de résultats après la fin du quiz
function showResult(){
    info_box.classList.remove("activeInfo"); 
    quiz_box.classList.remove("activeQuiz"); 
    result_box.classList.add("activeResult"); 
    const scoreText = result_box.querySelector(".score_text");

    // Affiche le score en fonction de la performance de l'utilisateur
    if (userScore >= 5 && userScore <= 9){ 
        let scoreTag = '<span>and congrats! 🎉, You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore >= 1 && userScore < 5){ 
        let scoreTag = '<span>and nice 😎, You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else if(userScore = 10){ 
        let scoreTag = '<span>AMAZING! 🤯, You got <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{ 
        let scoreTag = '<span>and sorry 😐, You got only <p>'+ userScore +'</p> out of <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

// Fonction pour démarrer le timer pour chaque question
function startTimer(time){
    counter = setInterval(timer, 1000); // Démarre un intervalle de 1 seconde
    function timer(){
        timeCount.textContent = time; // Démarre un intervalle de 1 seconde
        time--;
        if(time < 9){ // Ajoute un zéro pour les secondes < 10
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; 
        }
        if(time < 0){ // Si le temps est écoulé
            clearInterval(counter); // Si le temps est écoulé
            timeText.textContent = "Time Off"; // Affiche "Temps écoulé"
            const allOptions = option_list.children.length; 
            let correcAns = questions[que_count].answer; // Récupère la bonne réponse

            // Sélectionne et affiche la bonne réponse automatiquement
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ 
                    option_list.children[i].setAttribute("class", "option correct"); 
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                    console.log("Time Off: Auto selected correct answer.");
                }
            }

            // Désactive toutes les options
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show"); // Affiche le bouton "Suivant"
        }
    }
}

// Démarre la barre de progression pour le temps
function startTimerLine(time){
    counterLine = setInterval(timer, 29); // Démarre l'intervalle avec une petite durée
    function timer(){
        time += 1; // Augmente la largeur de la barre
        time_line.style.width = time + "px"; // Met à jour la largeur de la barre de progression
        if(time > 549){ // Stoppe la progression lorsque la largeur maximale est atteinte
            clearInterval(counterLine);
        }
    }
}

// Met à jour le compteur de questions affiché
function queCounter(index){
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag; // Affiche le numéro de la question actuelle par rapport au total
}