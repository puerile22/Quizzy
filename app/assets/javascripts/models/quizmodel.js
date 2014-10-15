var QuizModel = function(data){
  this.id = data.id;
  this.title = data.title;
};

QuizModel.get = function(quizId) {
  $.get('/quizzes/'+quizId,function(data){
    var quiz = new QuizModel(data);
    $(document).trigger('quiz',quiz);
  });
};

QuizModel.fetch = function() {
  $.get('/quizzes',function(data){
    $(document).trigger('quiz-list',data);
  });
};