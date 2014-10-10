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
//= require turbolinks
//= require underscore
// Your Quizzy code should go here.
var template = _.template("<a href='' id='<%= id %>'><%= title %></a><br>");
var list = "<h4><%= question %></h4><% _.each(choices,function(choice){ %> <input type='radio' name='choice' id='<%= choice %>' value='<%= choice %>'><label for='<%= choice %>'><%= choice %></label><br/>  <% }); %><button type='button'>Submit!</button><p class='answer'><%= answer %></p>";
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
        $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
          var question = _.template(list,{question:questionData.question,choices:questionData.choices.split(";"),answer:questionData.answer});
          $('.main').append(question);
          answerQuestion(id,num,score);
        });
      }
    } else {
      score = (score/data.length) * 100 ;
      $('.main').append("<h2>Final score:"+score+"</h2>")
    }
  });
};
$(document).ready(function(){
  $.get('/quizzes',function(data){
    for (var i = 0;i<data.length;i++) {
      var quizz = template({
        title: data[i].title,
        id: data[i].id
      });
      $('.main').append(quizz);
      showquestion(data[i].id);
    }
  });

});