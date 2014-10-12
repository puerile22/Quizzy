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
var template = _.template("<a href='' id='<%= id %>'><%= title %></a><br>");
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
      $('.main').append("<h2>Final score:"+score+"</h2>")
    }
  });
};
var showQuiz = function() {
  $.get('/quizzes',function(data){
    $('.main').empty();
    for (var i = 0;i<data.length;i++) {
      var quizz = template({
        title: data[i].title,
        id: data[i].id
      });
      $('.main').append(quizz);
      showquestion(data[i].id);
    }
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
        console.log(data);
      });
    });
  });

});
$(function(){ $(document).foundation(); });
