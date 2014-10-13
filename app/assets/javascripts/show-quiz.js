var showQuiz = function() {
  var template = _.template($('.quizzestemplate').html());
  $.get('/quizzes',function(data){
    $('.main').empty();
    $('.main').append("<h3>Select the quiz you want to take</h3>");
    for (var i = 0;i<data.length;i++) {
      var quizz = template({
        title: data[i].title,
        id: data[i].id
      });
      $('.main').append(quizz);
      newQuestion(data[i].id);
      topScore(data[i].id);
      showStats(data[i].id);
      showquestion(data[i].id);
    }
  });
};