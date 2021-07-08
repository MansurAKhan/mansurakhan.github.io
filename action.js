var character = document.getElementById("character");
var car = document.getElementById("car");
var potatoman = document.getElementById("potatoman");
let count;
let accident;
let counterDisplayElem = document.querySelector('.counter-display');
let Stop = document.querySelector('.stop');
let Start = document.querySelector('.start');

function initialize(){
    count = 10;
    counterDisplayElem.innerHTML = count;
    accident = false;
}
initialize()

function count_decrease(){
    count--;
    counterDisplayElem.innerHTML = count;
}


function jump(){
    if(character.classList != "animate"){
    character.classList.add("animate");
    }
    setTimeout(function(){
        character.classList.remove("animate");
    },500);
}

document.body.onkeyup = function(a){
    if(a.keyCode == 32){
        jump()
    }
}
 
function person_standup(){

}

function person_falldown(){
    
}

var checkDeadpotatoman = setInterval(function(){
    var charactertop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var potatomanleft = parseInt(window.getComputedStyle(potatoman).getPropertyValue("left"));
    
    if(potatomanleft<80 && potatomanleft>40 && charactertop>=290 && accident==false){
        count_decrease();
        accident = true;
        person_falldown();
    }

    if((potatomanleft>80 || potatomanleft<40) && accident==true){
        accident = false;
        person_standup();
    }
},200);


var checkDeadCar = setInterval(function(){
    var charactertop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var carleft = parseInt(window.getComputedStyle(car).getPropertyValue("left"));
    
    if(carleft<80 && carleft>40 && charactertop>=290 && accident==false){
        count_decrease()
        accident = true;
        person_falldown();
    }

    if((carleft>80 || carleft<40) && accident==true){
        accident = false;
        person_standup();
    }
},100);


setInterval(function(){
if (count<=0){
    p_animation = potatoman.style.animation;
    potatoman.style.animation="none";
    c_animation = car.style.animation;
    car.style.animation="none";
    alert("Mario: Mamma mia!");
    potatoman.style.animation=p_animation;
    car.style.animation=c_animation;
    initialize()
    location.reload()
}},10)