var quizView = function(){
  var view = this;
  $(document).on('quiz',function(e,data){

  });
};

quizView.prototype.showQuiz = function(data){
  var template = _.template($('.quizzestemplate').html());
  var list = template(data);
  $('.main').append(list);
};