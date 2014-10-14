var quiz={
  showStats:function(id){
    $('.stats-'+id+'').click(function(e){
      e.preventDefault();
      $.get('/scores',{quiz_id:id},function(data){
        var sum = 0;
        for (var i = 0;i < data.length;i++){
          sum += data[i].score;
        }
        var average = sum/data.length;
        $('.main').empty();
        $('.main').append("<h2>Average score:"+average+"");
      });
    });
  },
  showQuiz:function() {
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
        question.newQuestion(data[i].id);
        quiz.topScore(data[i].id);
        quiz.showStats(data[i].id);
        question.showquestion(data[i].id);
        quiz.deleteQuiz(data[i].id);
        quiz.editQuiz(data[i].id);
      }
    });
  },
  topScore:function(id) {
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
  },
  deleteQuiz:function(id){
    $('.delete-'+id+'').click(function(e){
      e.preventDefault();
      $.ajax({
        type:'DELETE',
        url:'/quizzes/'+id+'',
        data:{id:id}
      });
      $('.delete-'+id+'').parent().remove();
    });
  },
  editQuiz:function(id){
    var editTemplate = _.template($('.editTemplate').html());
    $('.edit-'+id+'').click(function(e){
      e.preventDefault();
      var quizTitle = $('#'+id+'').text();
      $('.main').empty();
      $.get('/quizzes/'+id+'/questions',function(data){
        var display = editTemplate({title:quizTitle,questions:data});
        $('.main').append(display);
        quiz.updateQuiz(id);
        question.deleteQuestion(id);
      });
    });
  },
  updateQuiz:function(id){
    $('button').click(function(){
      var title = $('#title').val();
      $.ajax({
        type:"PUT",
        url:"/quizzes/"+id+"",
        data:{quiz:{title:title},id:id}
      }).done(function(){
        quiz.editQuiz(id);
        $('.main').prepend("<h2 id='success'>Edit successful!</h2>");
        setTimeout(function(){$('#success').remove();},1000);
      });
    });
  }
};