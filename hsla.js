Colors = new Mongo.Collection("colors");
Users = new Mongo.Collection("users");

if (Meteor.isClient) {
  // runs when the page is first loaded
  Template.container.rendered = function(){
    Session.setDefault("h", 209);
    Session.setDefault("s", 72);
    Session.setDefault("l", 21);
    Session.setDefault("a", 99);
    placeSelectors(this);
    setHSLA(this);
    window.onresize = function(){
      setHSLA(this);
      placeSelectors(this);
    }
    //if (!this.rendered){ // waits until DOM is loaded }
  }

  Template.container.events({
    'click .color-picker': function(event, template){
      setHSLA(template);
    },
    'click .h ': function(event, template){
      setSelector(template.find('.h .selector'),'h', 360);
    },
    'click .s ': function(event, template){
      setSelector(template.find('.s .selector'),'s', 100);
    },
    'click .l ': function(event, template){
      setSelector(template.find('.l .selector'),'l', 100);
    },
    'click .a ': function(event, template){
      setSelector(template.find('.a .selector'),'a', 100);
    },
    'click .preview': function(event, template){
      Session.set('a', 100);
      placeSelectors(template);
      setHSLA(template);
    },
    'click .output input[name="hsla"]': function(event, template){
      template.find('input[name="hsla"]').select();
    },
    'click .output input[name="hex"]': function(event, template){
      template.find('input[name="hex"]').select();
    },
    'click .output input[name="link"]': function(event, template){
      template.find('input[name="link"]').select();
    },
    'click .palet .item': function(event, template){
      //console.log(Colors.findOne(this._id).h);
      var color = Colors.findOne(this._id);
      Session.set("h", Colors.findOne(this._id).h);
      Session.set("s", Colors.findOne(this._id).s);
      Session.set("l", Colors.findOne(this._id).l);
      Session.set("a", Colors.findOne(this._id).a);
      placeSelectors(template);
      setHSLA(template);
    },
    'dblclick .palet .item': function(event, template){
      Colors.remove(this._id);
    },
    'click .palet .add': function(event, template){
      //console.log(event.target);
      Colors.insert({hsla: getHSLA(), h: Session.get("h"), s: Session.get("s"), l: Session.get("l"), a: Session.get("a")});
    }

  });
  Template.container.helpers({
    colors: function(){
      return Colors.find();
    }
  });
}

// changes the hsla values based on click location
function setSelector(object, type, ratio){
    var target = event.clientX+4; // click location
    object.style.left = target+"px";

    var total_width = window.innerWidth;
    var width = total_width / ratio;

    for(var i=0; i<=ratio; i++){
      var off_left = i*width;
      var off_right = off_left+width;

      if(target > off_left && target < off_right){
        //window.alert(type+i);
        Session.set(type, i);
      }
    }
}
// visualy places the selectors
function placeSelectors(container){
  var total_width = window.innerWidth;
  var h_width = total_width / 360;
  var s_width = total_width / 100;
  container.find('.h .selector').style.left = Session.get("h")*h_width+"px";
  container.find('.s .selector').style.left = Session.get("s")*s_width+"px";
  container.find('.l .selector').style.left = Session.get("l")*s_width+"px";
  container.find('.a .selector').style.left = Session.get("a")*s_width+"px";
}

function getHSLA(){
  var h = Session.get('h').toString();
  var s = Session.get('s').toString();
  var l = Session.get('l').toString();
  var a = (Session.get('a')/100).toString();
  return "hsla("+h+", "+s+"%, "+l+"%, "+a+")";
}

// makes a lot of changes in the site
function setHSLA(object){
  var h = Session.get('h').toString();
  var s = Session.get('s').toString();
  var l = Session.get('l').toString();
  var a = (Session.get('a')/100).toString();

  // adjust the color picker based on new settings;
  object.find('.s').style.background = "linear-gradient(to right, hsl("+h+", 0%, 50%) 0%, hsl("+h+", 100%, 50%) 100%)";
  object.find('.l').style.background = "linear-gradient(to right, hsl("+h+", "+s+"%, 0%) 0%, hsl("+h+", "+s+"%, 50%) 50%, hsl("+h+", "+s+"%, 100%) 100%)";
  object.find('.a').style.background = "linear-gradient(to right, transparent 0%, hsla("+h+", "+s+"%, "+l+"%, 1) 100%)";

  // adjust the preview window
  object.find('.preview .mask').style.background = getHSLA();

  object.find('.output input[name="hsla"]').value = getHSLA();

  object.find('.output input[name="hsla"]').style.border = '2px solid '+getHSLA();
  object.find('.output input[name="hex"]').style.border = '2px solid '+getHSLA();
  object.find('.output input[name="link"]').style.border = '2px solid '+getHSLA();

  //console.log(object.find('.output input').value = getHSLA());
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
