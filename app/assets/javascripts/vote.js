$(document).on("turbolinks:load", function(){
  var controller = $("body").data('controller');
  var action = $("body").data('action');

  if(controller == "rooms" && action == "show"){
    App.vote = App.cable.subscriptions.create({
      channel: "VoteChannel",
      meetingid: $(".background").data("meeting"),
      useruid: $(".background").data("user")
    }, {
      connected: function() {
        console.log("connected");
      },

      disconnected: function(data) {
        console.log("disconnected");
        console.log(data);
      },

      rejected: function() {
        console.log("rejected");
      },

      received: function(data){
        console.log("received");
        console.log(data);
      },

      /*
       * vote: {
       *   anonymous: boolean,
       *   description: string,
       * }
       */
      startVote: function(vote) {
        this.perform('start_vote', vote);
      },

      /*
       * vote: {
       *   id: integer,
       *   anonymous: boolean,
       *   description: string,
       * }
       */
      updateVote: function(vote) {
        this.perform('update_vote', vote);
      },

     /*
      * vote_result: {
      *   vote_id: integer,
      *   value: string,
      * }
      */
      registerVoteResult: function(vote_result) {
        this.perform('register_vote_result', vote_result);
      },

      /*
       * vote_result: {
       *   vote_id: integer,
       *   useruid: string,
       *   value: string,
       * }
       */
      registerProxyVoteResult: function(vote_result) {
        this.perform('register_proxy_vote_result', vote_result);
      },

      /*
       * vote: {
       *   id: integer,
       * }
       */
      closeVote: function(vote) {
        this.perform('close_vote', vote);
      },

      /*
       * vote: {
       *   id: integer,
       * }
       */
      voteInfo: function(vote) {
        this.perform('vote_info', vote);
      },
    });
  }
});