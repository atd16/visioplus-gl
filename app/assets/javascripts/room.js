// BigBlueButton open source conferencing system - http://www.bigbluebutton.org/.
//
// Copyright (c) 2018 BigBlueButton Inc. and by respective authors (see below).
//
// This program is free software; you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free Software
// Foundation; either version 3.0 of the License, or (at your option) any later
// version.
//
// BigBlueButton is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License along
// with BigBlueButton; if not, see <http://www.gnu.org/licenses/>.

// Room specific js for copy button and email link.
$(document).on('turbolinks:load', function(){
  var controller = $("body").data('controller');
  var action = $("body").data('action');


  // highlight current room
  $('.room-block').removeClass('current');
  $('a[href="' + window.location.pathname + '"] .room-block').addClass('current');

  // Only run on room pages.
  if (controller == "rooms" && action == "show"){
    // Display and update all fields related to creating a room in the createRoomModal
    $("#create-room-block").click(function(){
      showCreateRoom(this)
    })

    checkIfAutoJoin()
  }

    // Autofocus on the Room Name label when creating a room only
  $('#createRoomModal').on('shown.bs.modal', function (){
    if ($(".create-only").css("display") == "block"){
      $('#create-room-name').focus()
    }
  })

  if (controller == "rooms" && action == "show" || controller == "admins" && action == "server_rooms"){
    // Display and update all fields related to creating a room in the createRoomModal
    $(".update-room").click(function(){
      showUpdateRoom(this)
    })

    $(".delete-room").click(function() {
      showDeleteRoom(this)
    })

    $('.selectpicker').selectpicker({
      liveSearchPlaceholder: getLocalizedString('javascript.search.start')
    });
    // Fixes turbolinks issue with bootstrap select
    $(window).trigger('load.bs.select.data-api');

    $(".share-room").click(function() {
      // Update the path of save button
      $("#save-access").attr("data-path", $(this).data("path"))
      $("#room-owner-uid").val($(this).data("owner"))

      // Get list of users shared with and display them
      displaySharedUsers($(this).data("users-path"))
    })

    $("#shareRoomModal").on("show.bs.modal", function() {
      $(".selectpicker").selectpicker('val','')
    })

    $(".bootstrap-select").on("click", function() {
      $(".bs-searchbox").siblings().hide()
    })

    $('.dropdown-menu a.trigger-submenu').on("click", function(e){
      $('.dropdown-submenu .dropdown-menu').not($(this).next('div')).hide();
      $(this).next('div').toggle();
      e.stopPropagation();
      e.preventDefault();
    });
    $("#share-room-select ~ button").on("click", function() {
      $(".bs-searchbox").siblings().hide()
    })

    $(".bs-searchbox input").on("input", function() {
      if ($(".bs-searchbox input").val() == '' || $(".bs-searchbox input").val().length < 3) {
        $(".select-options").remove()
        $(".bs-searchbox").siblings().hide()
      } else {
        // Manually populate the dropdown
        $.get($("#share-room-select").data("path"), { search: $(".bs-searchbox input").val(), owner_uid: $("#room-owner-uid").val() }, function(users) {
          $(".select-options").remove()
          if (users.length > 0) {
            users.forEach(function(user) {
              let opt = document.createElement("option")
              $(opt).val(user.uid)
              $(opt).text(user.name)
              $(opt).addClass("select-options")
              $(opt).attr("data-subtext", user.uid)
              $("#share-room-select").append(opt)
            })
            // Only refresh the select dropdown if there are results to show
            $('#share-room-select').selectpicker('refresh');
          } 
          $(".bs-searchbox").siblings().show()
        })     
      }
    })

    $(".remove-share-room").click(function() {
      $("#remove-shared-confirm").parent().attr("action", $(this).data("path"))
    })
  
    // Why target blank is not working ???
    $('.room-signs').on('click', function() {
        window.open(this.href,'_blank');return false;
    });
    $('.room-votes').on('click', function() {
        window.open(this.href,'_blank');return false;
    });

    // User selects an option from the Room Access dropdown
    $(".bootstrap-select").on("changed.bs.select", function(){
      // Get the uid of the selected user
      let uid = $(this).find(".selectpicker").selectpicker('val')

      // If the value was changed to blank, ignore it
      if (uid == "") return

      let currentListItems = $("#user-list li").toArray().map(user => $(user).data("uid"))

      // Check to make sure that the user is not already there
      if (!currentListItems.includes(uid)) {
        // Create the faded list item and display it
        let option = $("option[value='" + uid + "']")

        let listItem = document.createElement("li")
        listItem.setAttribute('class', 'list-group-item text-left not-saved add-access');
        listItem.setAttribute("data-uid", uid)

        /*let spanItemAvatar = document.createElement("span"),
            spanItemName = document.createElement("span"),
            spanItemUser = document.createElement("span");
        spanItemAvatar.setAttribute('class', 'avatar float-left mr-2');
        spanItemAvatar.innerText = option.text().charAt(0);
        spanItemName.setAttribute('class', 'shared-user');
        spanItemName.innerText = option.text();
        spanItemUser.setAttribute('class', 'text-muted');
        spanItemUser.innerText = option.data('subtext');
        spanItemName.append(spanItemUser);

        listItem.innerHTML = "<span class='text-primary float-right shared-user cursor-pointer' onclick='removeSharedUser(this)'><i class='fas fa-times'></i></span>"
        listItem.prepend(spanItemName);
        listItem.prepend(spanItemAvatar);*/

	// TIC

	let spanItem = "<span class='avatar float-left mr-2'>" + option.text().charAt(0) + "</span> <span class='shared-user'>" +
          option.text() + " <span class='text-muted'>" + option.data("subtext") + "</span></span>" +
          getCustomForm()+
          "<span class='text-primary float-right shared-user cursor-pointer' style='position: absolute; top:5px; right:15px;' onclick='removeSharedUser(this)'><i class='fas fa-times'></i></span>"
        listItem.innerHTML = spanItem	

	// END TIC

        $("#user-list").append(listItem)

        $('.status_input').on("change", function() {
          status = $(this).find(":selected").val()
          $(this).parent().parent().find(".proc_input").attr("style", "display: none !important")
          $(this).parent().find("input").show()
          if(status == "nv")
            $(this).parent().find("input").hide()
          if(status == "p")
            $(this).parent().parent().find(".proc_input").attr("style", "display: block !important")
        })

        $('.proc_input').each(function() {
          reloadProcList($(this))
        })
      }
    })

    $("#presentation-upload").change(function(data) {
      var file = data.target.files[0]

      // Check file type and size to make sure they aren't over the limit
      if (validFileUpload(file)) {
        $("#presentation-upload-label").text(file.name)
      } else {
        $("#invalid-file-type").show()
        $("#presentation-upload").val("")
        $("#presentation-upload-label").text($("#presentation-upload-label").data("placeholder"))
      }
    })

    $(".preupload-room").click(function() {
      updatePreuploadPresentationModal(this)
    })

    $("#remove-presentation").click(function(data) {
      removePreuploadPresentation($(this).data("remove"))
    })

    // trigger initial room filter
    filterRooms();
  }
});

function copyInvite() {
  $('#invite-url').select()
  if (document.execCommand("copy")) {
    $('#invite-url').blur();
    copy = $("#copy-invite")
    copy.addClass('btn-success');
    copy.html("<i class='fas fa-check mr-1'></i>" + getLocalizedString("copied"))
    setTimeout(function(){
      copy.removeClass('btn-success');
      copy.html("<i class='fas fa-copy mr-1'></i>" + getLocalizedString("copy"))
    }, 1000)
  }
}

function copyAccess() {
  $('#copy-code').attr("type", "text")
  $('#copy-code').select()
  if (document.execCommand("copy")) {
    $('#copy-code').attr("type", "hidden")
    copy = $("#copy-access")
    copy.addClass('btn-success');
    copy.html("<i class='fas fa-check mr-1'></i>" + getLocalizedString("copied"))
    setTimeout(function(){
      copy.removeClass('btn-success');
      copy.html("<i class='fas fa-copy mr-1'></i>" + getLocalizedString("room.copy_access"))
    }, 1000)
  }
}

function showCreateRoom(target) {
  var modal = $(target)
  $("#create-room-name").val("")
  $("#create-room-access-code").text(getLocalizedString("modal.create_room.access_code_placeholder"))
  $("#room_access_code").val(null)

  $("#createRoomModal form").attr("action", $("body").data('relative-root'))
  $("#room_mute_on_join").prop("checked", $("#room_mute_on_join").data("default"))
  $("#room_require_moderator_approval").prop("checked", $("#room_require_moderator_approval").data("default"))
  $("#room_anyone_can_start").prop("checked", $("#room_anyone_can_start").data("default"))
  $("#room_all_join_moderator").prop("checked", $("#room_all_join_moderator").data("default"))
  $("#room_recording").prop("checked", $("#room_recording").data("default"))

  //show all elements & their children with a create-only class
  $(".create-only").each(function() {
    $(this).show()
    if($(this).children().length > 0) { $(this).children().show() }
  })

  //hide all elements & their children with a update-only class
  $(".update-only").each(function() {
    $(this).attr('style',"display:none !important")
    if($(this).children().length > 0) { $(this).children().attr('style',"display:none !important") }
  })
}

function showUpdateRoom(target) {
  var modal = $(target)
  var update_path = modal.closest(".room-block").data("path")
  var settings_path = modal.data("settings-path")
  $("#create-room-name").val(modal.closest(".room-block").find(".room-name-text").text().trim())
  $("#createRoomModal form").attr("action", update_path)

  //show all elements & their children with a update-only class
  $(".update-only").each(function() {
    $(this).show()
    if($(this).children().length > 0) { $(this).children().show() }
  })

  //hide all elements & their children with a create-only class
  $(".create-only").each(function() {
    $(this).attr('style',"display:none !important")
    if($(this).children().length > 0) { $(this).children().attr('style',"display:none !important") }
  })

  updateCurrentSettings(settings_path)

  var accessCode = modal.closest(".room-block").data("room-access-code")

  if(accessCode){
    $("#create-room-access-code").text(getLocalizedString("modal.create_room.access_code") + ": " + accessCode)
    $("#room_access_code").val(accessCode)
  } else {
    $("#create-room-access-code").text(getLocalizedString("modal.create_room.access_code_placeholder"))
    $("#room_access_code").val(null)
  }
}

function showDeleteRoom(target) {
  $("#delete-header").text(getLocalizedString("modal.delete_room.confirm").replace("%{room}", $(target).data("name")))
  $("#delete-confirm").parent().attr("action", $(target).data("path"))
}

//Update the createRoomModal to show the correct current settings
function updateCurrentSettings(settings_path){
  // Get current room settings and set checkbox
  $.get(settings_path, function(settings) {
    $("#room_mute_on_join").prop("checked", $("#room_mute_on_join").data("default") || settings.muteOnStart)
    $("#room_require_moderator_approval").prop("checked", $("#room_require_moderator_approval").data("default") || settings.requireModeratorApproval)
    $("#room_anyone_can_start").prop("checked", $("#room_anyone_can_start").data("default") || settings.anyoneCanStart)
    $("#room_all_join_moderator").prop("checked", $("#room_all_join_moderator").data("default") || settings.joinModerator)
    $("#room_recording").prop("checked", $("#room_recording").data("default") || Boolean(settings.recording))
  })
}

function generateAccessCode(){
  const accessCodeLength = 6
  var validCharacters = "0123456789"
  var accessCode = ""

  for( var i = 0; i < accessCodeLength; i++){
    accessCode += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length));
  }

  $("#create-room-access-code").text(getLocalizedString("modal.create_room.access_code") + ": " + accessCode)
  $("#room_access_code").val(accessCode)
}

function ResetAccessCode(){
  $("#create-room-access-code").text(getLocalizedString("modal.create_room.access_code_placeholder"))
  $("#room_access_code").val(null)
}

function saveAccessChanges() {
  var finalList = []

  error = ""

  $("#user-list li:not(.remove-shared)").each(function(item){
    var dict = {}
    let status = $(this).find(".status_input :selected").val()
    let weight = $(this).find("#weight_input").val()
    let proc = $(this).find(".proc_input :selected").val()
    dict.uid = $(this).data("uid")
    dict.status = status
    if(status != "nv")
      if(weight)
        dict.weight = weight
      else
        error = getLocalizedString("room.access_invalid_form")
    if(status == "p")
      if(proc)
        dict.proc = proc
      else
        error = getLocalizedString("room.access_invalid_form")
    finalList.push(dict)
  })

  if(error)
    alert(error)
  else
    $.post($("#save-access").data("path"), {add: finalList})
}

function getCustomForm(user=null, users=null) {
  var status_list = {
    v: getLocalizedString("signup.voting"),
    nv: getLocalizedString("signup.not_voting"),
    p: getLocalizedString("signup.proc")
  }

  if(!users){
    users = []
    $("#user-list li:not(.remove-shared)").each(function(item){
      var dict = {}
      dict.uid = $(this).data("uid")
      dict.id = $(this).data("id")
      dict.name = $(this).find(".shared-user").clone().children().remove().end().text()
      users.push(dict)
    })
  }

  str = "<div class='custom_for'>"
  str += "<div class='mt-4 ml-0 mr-0 row justify-content-between'>"
  str += "<select class='selectpicker status_input form-control col col-9' style='display:block !important;'>"
  for(var key in status_list) {
    selected=""
    if(user && user.tic_status && key == user.tic_status){
      selected="selected"
    }
    str += "<option value='"+key+"' "+selected+">"+status_list[key]+"</option>"
  }
  str += "</select>"

  display = ""
  if(user && user.tic_status && user.tic_status == "nv")
    display = "style='display: none'"

  str += "<input type='integer' id='weight_input' class='form-control col col-2' placeholder='"+getLocalizedString("signup.weight")+"' "+display+""
  if(user && user.tic_weight){
    str += " value='"+user.tic_weight+"'"
  }
  str += "/>"
  str += "</div>"

  str += "<div class='mt-4 ml-0 mr-0 row justify-content-between'>"

  display = "style='display: none !important'"
  if(user && user.tic_status && user.tic_status == "p")
    display = "style='display: block !important'"
  str += "<select class='selectpicker proc_input form-control col col-9' "+display+">"
  if(users){
    users.forEach(function(item){
      if(!user || item.uid != user.uid){
        selected = ""
        if(user && user.tic_status && user.tic_status == "p" && user.tic_proc_user == item.user_id)
          selected = "selected"
        str += "<option value='"+item.uid+"' "+selected+">"+item.name+"</option>"
      }
    })
  }
  str += "</select>"
  str += "</div>"
  str += "</div>"

  return str
}

function reloadProcList(proc){
  str = ""
  users = []
  $("#user-list li:not(.remove-shared)").each(function(item){
    var dict = {}
    dict.uid = $(this).data("uid")
    dict.id = $(this).data("id")
    dict.name = $(this).find(".shared-user").clone().children().remove().end().text()
    users.push(dict)
  })

  li = $(proc).parent().parent().parent()
  var user = {}
  user.status = $(li).find(".status_input :selected").val()
  user.weight = $(li).find("#weight_input").val()
  user.proc = $(li).find(".proc_input :selected").val()
  user.uid = $(li).data("uid")

  users.forEach(function(item){
    if(item && item.uid != user.uid){
      selected = ""
      if(user && user.status && user.status == "p" && user.proc == item.uid)
        selected = "selected"
      str += "<option value='"+item.uid+"' "+selected+">"+item.name+"</option>"
    }
  })
  $(proc).html(str)
}


// Get list of users shared with and display them
function displaySharedUsers(path) {
  $.get(path, function(users) {
    // Create list element and add to user list
    var user_list_html = ""

    users.forEach(function(user) {
      user_list_html += "<li class='list-group-item text-left ' data-id='"+user.user_id+"' data-uid='" + user.uid + "'>"

      if (user.image) {
        user_list_html += "<img id='user-image' class='avatar float-left mr-2' src='" + user.image + "'></img>"
      } else {
        user_list_html += "<span class='avatar float-left mr-2'>" + user.name.charAt(0) + "</span>"
      }
      user_list_html += "<span class='shared-user'>" + user.name + "<span class='text-muted ml-1'>" + user.uid + "</span></span>"
      user_list_html += getCustomForm(user, users)
      user_list_html += "<span class='text-primary float-right shared-user cursor-pointer' style='position: absolute; top:5px; right:15px;' onclick='removeSharedUser(this)'><i class='fas fa-times'></i></span>"
      user_list_html += "</li>"
    })

    $("#user-list").html(user_list_html)

    $('.status_input').on("change", function() {
      status = $(this).find(":selected").val()
      $(this).parent().parent().find(".proc_input").attr("style", "display: none !important")
      $(this).parent().find("input").show()
      if(status == "nv")
        $(this).parent().find("input").hide()
      if(status == "p")
        $(this).parent().parent().find(".proc_input").attr("style", "display: block !important")
    })
  });
}

// Removes the user from the list of shared users
function removeSharedUser(target) {
  let parentLI = target.closest("li")

  if (parentLI.classList.contains("not-saved")) {
    parentLI.parentNode.removeChild(parentLI)
  } else {
    parentLI.removeChild(target)
    parentLI.classList.add("remove-shared")
  }

  $('.proc_input').each(function() {
    reloadProcList($(this))
  })
}

function updatePreuploadPresentationModal(target) {
  $.get($(target).data("settings-path"), function(presentation) {
    if(presentation.attached) {
      $("#current-presentation").show()
      $("#presentation-name").text(presentation.name)
      $("#change-pres").show()
      $("#use-pres").hide()
    } else {
      $("#current-presentation").hide()
      $("#change-pres").hide()
      $("#use-pres").show()
    }
  });
  
  $("#preuploadPresentationModal form").attr("action", $(target).data("path"))
  $("#remove-presentation").data("remove",  $(target).data("remove"))
  
  // Reset values to original to prevent confusion
  $("#presentation-upload").val("")
  $("#presentation-upload-label").text($("#presentation-upload-label").data("placeholder"))
  $("#invalid-file-type").hide()
}

function removePreuploadPresentation(path) {
  $.post(path, {})
}

function validFileUpload(file) {
  return file.size/1024/1024 <= 30
}

// Automatically click the join button if this is an action cable reload
function checkIfAutoJoin() {
  var url = new URL(window.location.href)

  if (url.searchParams.get("reload") == "true") {
    $("#joiner-consent").click()
    $("#room-join").click()
  }
}

function filterRooms() {
  let search = $('#room-search').val()

  if (search == undefined) { return }

  let search_term = search.toLowerCase(),
        rooms = $('#room_block_container > div:not(:last-child)');
        clear_room_search = $('#clear-room-search');

  if (search_term) {
    clear_room_search.show();
  } else {
    clear_room_search.hide();
  }

  rooms.each(function(i, room) {
    let text = $(this).find('h4').text();
    room.style.display = (text.toLowerCase().indexOf(search_term) < 0) ? 'none' : 'block';
  })
}

function clearRoomSearch() {
  $('#room-search').val(''); 
  filterRooms()
}
