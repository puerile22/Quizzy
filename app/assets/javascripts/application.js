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
//= require question
// Your Quizzy code should go here.
var user;

$(document).ready(function(){
  $('#new-user').click(function(){
    user = $('input').val();
    question.showQuiz();
    $('#topbar').click(function(e){
      e.preventDefault();
      question.showQuiz();
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
          setTimeout(function(){question.showQuiz();},2000);
        });
      });
    });
  });

});
$(function(){ $(document).foundation(); });
