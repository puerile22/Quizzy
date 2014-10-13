// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require turbolinks
//= require underscore
// Your Quizzy code should go here.
var answerQuestion = function(id,num,score){
  $('button').click(function(){
    if ($('.answer').text() === $('input:checked').val()) {
      $('.main').append('<h3 class=result>Correct!</h3>');
      num++;
      score++;
      setTimeout(function(){singleQuestion(id,num,score);},1000);
    } else {
      $('.main').append('<h3 class=result>Incorrect!</h3>');
      num++;
      setTimeout(function(){singleQuestion(id,num,score);},1000);
    }
  });
};
var answerQuestionBlank = function(id,num,score){
  $('button').click(function(){
    if ($('.answer').text() === $('#answer').val()) {
      $('.main').append('<h3 class=result>Correct!</h3>');
      num++;
      score++;
      setTimeout(function(){singleQuestion(id,num,score);},1000);
    } else {
      $('.main').append('<h3 class=result>Incorrect!</h3>');
      num++;
      setTimeout(function(){singleQuestion(id,num,score);},1000);
    }
  });
};
var multipleQuestion = function(id,num,score,questionId) {
  var multiTemplate = _.template($('.multitemplate').html());
  $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
    var question = multiTemplate({
      question:questionData.question,
      choices:questionData.choices.split(";"),
      answer:questionData.answer
    });
    $('.main').append(question);
    $('input:eq(0)').attr("checked",true);
    answerQuestion(id,num,score);
  });
};
var booleanQuestion = function(id,num,score,questionId) {
  var booleanQuestionList = _.template($('.booleantemplate').html());
  $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
    var question = booleanQuestionList({question:questionData.question,answer:questionData.answer});
    $('.main').append(question);
    $('input:eq(0)').attr("checked",true);
    answerQuestion(id,num,score);
  });
};
var blankQuestion = function(id,num,score,questionId) {
  var blankQuestionList = _.template($('.blanktemplate').html());
  $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
    var question = blankQuestionList({question:questionData.question,answer:questionData.answer});
    $('.main').append(question);
    answerQuestionBlank(id,num,score);
  });
};
var showquestion = function(id){
  $('#'+id+'').click(function(e){
    e.preventDefault();
    singleQuestion(id,0,0);
  });
};
var singleQuestion = function(id,num,score) {
  $.get('/quizzes/'+id+'/questions',function(data){
    $('.main').empty();
    if (num < data.length) {
      var questionId = data[num].id;
      if (data[num].question_type === 'multiple') {
        multipleQuestion(id,num,score,questionId);
      } else if (data[num].question_type === 'boolean') {
        booleanQuestion(id,num,score,questionId);
      } else {
        blankQuestion(id,num,score,questionId);
      }
    } else {
      score = Math.floor((score/data.length) * 100) ;
      $('.main').append("<h2>Final score:"+score+"</h2>");
      $.ajax({
        type:'POST',
        url:'/scores',
        data:{score:{score:score,quiz_id:id},quiz_id:id}
      });
    }
  });
};
var showQuiz = function() {
  var template = _.template($('.quizzestemplate').html());
  $.get('/quizzes',function(data){
    $('.main').empty();
    for (var i = 0;i<data.length;i++) {
      var quizz = template({
        title: data[i].title,
        id: data[i].id
      });
      $('.main').append(quizz);
      newQuestion(data[i].id);
      topScore(data[i].id);
      showquestion(data[i].id);
    }
  });
};
var newQuestion = function(id) {
  $('.'+id+'').click(function(e){
    e.preventDefault();
    var quizId = $(this).attr('class');
    $('.main').empty();
    $('.main').append("<h2>Add new question</h2><label for='newquestion'>Question:</label><br><input type='text' id='newquestion'><br><label for='type'>Question type:</label><br><select id='type'><option>multiple</option><option>boolean</option><option>blank</option></select>");
    $('.main').append("<div class='option'></div>");
    $('.option').append("<label for='choices'>Choices:</label><br>");
    $('.option').append("<input type='text' id='choices' disabled><br>");
    $('.option').append("<label for='newchoice'>Add choice:</label><br>");
    $('.option').append("<input type='text' id='choice'><br>");
    $('.option').append("<button type='button' id='addchoice'>Add choice!</button>");
    addChoice();
    $('.option').append("<label for='answer'>Answer:</label>");
    $('.option').append("<input type='text' id='answer'><br>");
    $('.main').append("<button type='button' id='submit'>Add!</button>");
    questionType();
    addQuestion(quizId);
  });
};
var topScore = function(id) {
  var topScoreTemplate = _.template($('.topscore').html());
  $('.scores-'+id+'').click(function(e){
    e.preventDefault();
    $.get('/scores',{quiz_id:id},function(data){
      data.sort(function(a,b){
        return a.score-b.score
      });
      data = data.reverse().splice(0,10); 
      $('.main').empty();
      var scores = topScoreTemplate({scores:data});
      $('.main').append(scores);
    });
  });
};
var addQuestion = function(id) {
  $('#submit').click(function(){
    if ($('select').val() === 'multiple') {
      var question = $('#newquestion').val();
      var answer = $('#answer').val();
      var quizId = id;
      var questionType = 'multiple';
      var choices = $('#choices').val();
      choices = choices.substring(0,choices.length-1); 
      $.ajax({
        type:'POST',
        url:'/questions',
        data:{question:{
          question:question,
          answer:answer,
          quiz_id:quizId,
          question_type:questionType,
          choices:choices
        },
        quiz_id:quizId
      }
      });
    } else {
      var question = $('#newquestion').val();
      var answer = $('#answer').val();
      var quizId = id;
      var questionType = $('#submit').val();
      $.ajax({
        type:'POST',
        url:'/questions',
        data:{question:{
          question:question,
          answer:answer,
          quiz_id:quizId,
          question_type:questionType
        },
        quiz_id:quizId
      }
      });
    }
    $('.main').empty();
    $('.main').append("<h2>Successfully add a new question!</h2>");
  });
};
var questionType = function() {
  $('select').change(function(){
    if ($('select').val() === 'blank') {
      $('.option').empty();
      $('.option').append("<label for='answer'>Answer:</label>");  
      $('.option').append("<input type='text' id='answer'>");
    } else if ($('select').val() === 'boolean') {
      $('.option').empty();
      $('.option').append("<label for='answer'>Answer:</label>");  
      $('.option').append("<input type='radio' id='answer' name='answer' value='true' checked>True!<br><input type='radio' id='answer' name='answer' value='false'>False!<br>");
    } else {
      $('.option').empty();
      $('.option').append("<label for='choices'>Choices:</label><br>");
      $('.option').append("<input type='text' id='choices' disabled><br>");
      $('.option').append("<label for='newchoice'>Add choice:</label><br>");
      $('.option').append("<input type='text' id='choice'><br>");
      $('.option').append("<button type='button' id='addchoice'>Add choice!</button>");
      addChoice();
      $('.option').append("<label for='answer'>Answer:</label>");
      $('.option').append("<select id='answer'></select>");
    }
  });
};
var answerSelect = function(){
  var choices = $('#choices').val();
  choices = choices.substring(0,choices.length-1).split(";");
  $('#answer').empty();
  // $('.option').append("<select id='answer'></select>");
  for (var i = 0;i < choices.length;i++) {
    $('#answer').append("<option>"+choices[i]+"</option>");
  }
};
var addChoice = function(){
  $('#addchoice').click(function(){
    if ($('#choice').val() !== "") {
      var choices = $('#choices').val();
      $('#choices').val(choices+$('#choice').val()+';');
      $('#choice').val("");
    }
    answerSelect();
  });
};
$(document).ready(function(){
  showQuiz();
  $('#topbar').click(function(e){
    e.preventDefault();
    showQuiz();
  });
  $('#addquiz').click(function(e){
    e.preventDefault();
    $('.main').empty();
    $('.main').append("<h2>Create new quiz</h2><label for='newquiz'>Quiz name</label><br><input type='text' id='newquiz'><br><button type='button'>Create!</button>");
    $('button').click(function(){
      var quiz = $('#newquiz').val();
      $.ajax({
        type:"POST",
        url:"/quizzes",
        data:{quiz:{title:quiz}}
      }).done(function(data){
        var title = data.entity.title;
        $('.main').empty();
        $('.main').append("<h2>Successfully create new quiz '"+title+"'");
      });
    });
  });

});
$(function(){ $(document).foundation(); });
