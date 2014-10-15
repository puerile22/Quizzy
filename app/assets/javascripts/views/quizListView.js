var quizListView = function(){
  var view = this;
  $(document).on('quiz-list',function(e){
    $('.main').empty();
    $('.main').append("<h3>Select the quiz you want to take</h3>");
    for (var i = 1;i < arguments.length;i++) {
      view.showList(arguments[i]);
    }
  });
};

quizListView.prototype.showList = function(data){
  var template = _.template($('.quizzestemplate').html());
  var list = template(data);
  $('.main').append(list);
};