var quizListModel = function(){
  $.get('/quizzes',function(data){
    $(document).trigger('quiz-list',data);
  });
};
