var question = {
  answerQuestion:function(id,num,score){
    $('button').click(function(){
      if ($('.answer').text() === $('input:checked').val()) {
        $('.main').append('<h3 class=result>Correct!</h3>');
        num++;
        score++;
        setTimeout(function(){question.singleQuestion(id,num,score);},1000);
      } else {
        $('.main').append('<h3 class=result>Incorrect!</h3>');
        num++;
        setTimeout(function(){question.singleQuestion(id,num,score);},1000);
      }
    });
  },
  answerQuestionBlank:function(id,num,score){
    $('button').click(function(){
      if ($('.answer').text() === $('#answer').val()) {
        $('.main').append('<h3 class=result>Correct!</h3>');
        num++;
        score++;
        setTimeout(function(){question.singleQuestion(id,num,score);},1000);
      } else {
        $('.main').append('<h3 class=result>Incorrect!</h3>');
        num++;
        setTimeout(function(){question.singleQuestion(id,num,score);},1000);
      }
    });
  },
  multipleQuestion:function(id,num,score,questionId) {
    var multiTemplate = _.template($('.multitemplate').html());
    $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
      var newquestion = multiTemplate({
        question:questionData.question,
        choices:questionData.choices.split(";"),
        answer:questionData.answer
      });
      $('.main').append(newquestion);
      $('input:eq(0)').attr("checked",true);
      question.answerQuestion(id,num,score);
    });
  },
  booleanQuestion:function(id,num,score,questionId) {
    var booleanQuestionList = _.template($('.booleantemplate').html());
    $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
      var newquestion = booleanQuestionList({question:questionData.question,answer:questionData.answer});
      $('.main').append(newquestion);
      $('input:eq(0)').attr("checked",true);
      question.answerQuestion(id,num,score);
    });
  },
  blankQuestion:function(id,num,score,questionId) {
    var blankQuestionList = _.template($('.blanktemplate').html());
    $.get('/quizzes/'+id+'/questions/'+questionId+'',function(questionData){
      var newquestion = blankQuestionList({question:questionData.question,answer:questionData.answer});
      $('.main').append(newquestion);
      question.answerQuestionBlank(id,num,score);
    });
  },
  showquestion:function(id){
    $('#'+id+'').click(function(e){
      e.preventDefault();
      question.singleQuestion(id,0,0);
    });
  },
  singleQuestion:function(id,num,score) {
    $.get('/quizzes/'+id+'/questions',function(data){
      data.sort(function(a,b){
        return a.id-b.id;
      });
      $('.main').empty();
      if (num < data.length) {
        var questionId = data[num].id;
        if (data[num].question_type === 'multiple') {
          question.multipleQuestion(id,num,score,questionId);
        } else if (data[num].question_type === 'boolean') {
          question.booleanQuestion(id,num,score,questionId);
        } else {
          question.blankQuestion(id,num,score,questionId);
        }
      } else {
        score = ((score/data.length) * 100).toFixed(0) ;
        $('.main').append("<h2>Final score:"+score+"</h2>");
        $.ajax({
          type:'POST',
          url:'/scores',
          data:{score:{score:score,user:user},quiz_id:id}
        });
      }
    });
  },
  newQuestion:function(id) {
    $('.'+id+'').click(function(e){
      e.preventDefault();
      var quizId = $(this).attr('class');
      $('.main').empty();
      $('.main').append("<h2>Add new question</h2><label for='newquestion'>Question:</label><br><input type='text' id='newquestion'><br><label for='type'>Question type:</label><br><select id='type'><option>multiple</option><option>boolean</option><option>blank</option></select>");
      $('.main').append("<div class='option'></div>");
      $('.option').append("<label for='choices'>Choices:</label><br>");
      $('.option').append("<input type='text' id='choices' disabled><br>");
      $('.option').append("<label for='newchoice'>Add choice:</label><br>");
      $('.option').append("<input type='text' id='choice'><br>");
      $('.option').append("<button type='button' id='addchoice'>Add choice!</button>");
      question.addChoice();
      $('.option').append("<label for='answer'>Answer:</label>");
      $('.option').append("<select id='answer'></select>");
      $('.main').append("<button type='button' id='submit'>Add!</button>");
      question.questionType();
      question.addQuestion(quizId);
    });
  },
  questionType:function() {
    $('#type').change(function(){
      if ($('select').val() === 'blank') {
        $('.option').empty();
        $('.option').append("<label for='answer'>Answer:</label>");  
        $('.option').append("<input type='text' id='answer'>");
      } else if ($('select').val() === 'boolean') {
        $('.option').empty();
        $('.option').append("<label for='answer'>Answer:</label>");  
        $('.option').append("<input type='radio' id='answer' name='answer' value='true' checked>True!<br><input type='radio' id='answer' name='answer' value='false'>False!<br>");
      } else {
        $('.option').empty();
        $('.option').append("<label for='choices'>Choices:</label><br>");
        $('.option').append("<input type='text' id='choices' disabled><br>");
        $('.option').append("<label for='newchoice'>Add choice:</label><br>");
        $('.option').append("<input type='text' id='choice'><br>");
        $('.option').append("<button type='button' id='addchoice'>Add choice!</button>");
        question.addChoice();
        $('.option').append("<label for='answer'>Answer:</label>");
        $('.option').append("<select id='answer'></select>");
      }
    });
  },
  addQuestion:function(id) {
    $('#submit').click(function(){
      if ($('select').val() === 'multiple') {
        var newquestion = $('#newquestion').val();
        var answer = $('#answer').val();
        var quizId = id;
        var questionType = 'multiple';
        var choices = $('#choices').val();
        choices = choices.substring(0,choices.length-1); 
        $.ajax({
          type:'POST',
          url:'/questions',
          data:{question:{
            question:newquestion,
            answer:answer,
            quiz_id:quizId,
            question_type:questionType,
            choices:choices
          },
          quiz_id:quizId
        }
        });
      } else {
        var newquestion = $('#newquestion').val();
        var answer = $('#answer').val();
        var quizId = id;
        var questionType = $('#submit').val();
        $.ajax({
          type:'POST',
          url:'/questions',
          data:{question:{
            question:newquestion,
            answer:answer,
            quiz_id:quizId,
            question_type:questionType
          },
          quiz_id:quizId
        }
        });
      }
      $('.main').empty();
      $('.main').append("<h2>Successfully add a new question!</h2>");
      setTimeout(function(){question.showQuiz();},2000);
    });
  },
  answerSelect:function(){
    var choices = $('#choices').val();
    choices = choices.substring(0,choices.length-1).split(";");
    $('#answer').empty();
    for (var i = 0;i < choices.length;i++) {
      $('#answer').append("<option>"+choices[i]+"</option>");
    }
  },
  addChoice:function(){
    $('#addchoice').click(function(){
      if ($('#choice').val() !== "") {
        var choices = $('#choices').val();
        $('#choices').val(choices+$('#choice').val()+';');
        $('#choice').val("");
      }
      question.answerSelect();
    });
  },
  deleteQuestion:function(){
    $('#delete')
  }
};