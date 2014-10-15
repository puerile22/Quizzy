var quizView = function(){
  var view = this;
    }
  });
};

quizView.prototype.showQuiz = function(data){
  var template = _.template($('.quizzestemplate').html());
  var list = template(data);
  $('.main').append(list);
};