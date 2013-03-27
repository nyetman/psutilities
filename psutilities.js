   //
   // PS GREETING BEGIN
   //

   chrome.storage.sync.get('greetingOption', function(r) {
      var greetingvalue = r['greetingOption'];

   if(greetingvalue=='Yes') {

   var locStr=window.location.href;

   //Find psp in URL
   var envBegin = locStr.search('psp');

   //Substring the URL starting 4 positions after psp (this should be where the environment starts
   var tempLocStr = locStr.substring(envBegin+4);

   //Split the URL by / and get everything to the left of the first / (this should be our entire environment name
   var envString = tempLocStr.split('/')[0];

   //If multiple windows are open, they will have _ followed by a number appended to the environment, remove this
   var finalEnv   = envString.split('_')[0];

   //If greeting doesn't exist in header then add it
   if($("#pthdr2greeting").length == 0) {
      $("div#pthdr2container").append("<div id='pthdr2greeting'><span class='greeting'>&nbsp;</span></div>");
   }

   //Select greeting in the header
    var $greet   = $('#pthdr2greeting .greeting');

   //Populate greeting in header with environment
   if ($.trim($greet.text()) == '') {
      $greet.text(finalEnv);
   }
			}

   });

   //
   // PS GREETING END
   //

$("div#pthdr2container").append("<div id='pthdr2shortcuts'><span class='shortcuts'>Shortcuts</span></div>");
var $shortcuts = $('#pthdr2container .shortcuts');

// Array of Menu/Component/Markets/Descriptions of Peoplesoft "menuItem" objects
var menuItems = [];
menuItems.add = function(menu, component, market, descr) {
  var self = this;
  self.push({
    menu: menu,
    component: component,
    market: market,
    descr: descr,
    speedKey: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".charCodeAt(self.length)
  });
  return self;
}

//        .../ps[c|p] /site     /portal   /node     /c /menuname   .component  .market
var urlRe = /(.*)\/(ps[cp])\/([^\/]*)\/([^\/]*)\/([^\/]*)\/c\/([^\/\.]*)\.([^\/\.]*)\.([^\?]*).*/gi;
var urlResult = urlRe.exec(window.location.href);

// if not component URL, check for homepage URL
if (!urlResult) {
  //        .../ps[c|p] /site     /portal   /node     /h /?tab=TABNAME
  urlRe = /(.*)\/(ps[cp])\/([^\/]*)\/([^\/]*)\/([^\/]*)\/h\/\?tab\=([^\/\.]*)/gi;
  urlResult = urlRe.exec(window.location.href);
}

// if url format recognised
if (urlResult) {
  // get url parts
  var baseURL = urlResult[1];
  var servlet = urlResult[2];
  var site = urlResult[3].replace(/\_\d+/ig,'');
  var portal = urlResult[4];
  var node = urlResult[5];

  // Add Menu/Component/Markets/Description menuItems...
  menuItems
    .add('UTILITIES'                    , 'PEOPLECODE_TRACE'             , 'GBL', 'PeopleTools: Trace PeopleCode'     )
    .add('UTILITIES'                    , 'TRACE_SQL'                    , 'GBL', 'PeopleTools: Trace SQL'            )
    .add('UTILITIES'                    , 'URL_TABLE'                    , 'GBL', 'PeopleTools: URLs'                 )
    .add('UTILITIES'                    , 'MESSAGE_CATALOG1'             , 'GBL', 'PeopleTools: Message Catalogue'    )
    .add('PROCESS_SCHEDULER'            , 'PRCSDEFN'                     , 'GBL', 'Processes:   Process Definitions'  )
    .add('PROCESSMONITOR'               , 'PROCESSMONITOR'               , 'GBL', 'Processes:   Process Monitor'      )
    .add('MAINTAIN_SECURITY'            , 'USERMAINT'                    , 'GBL', 'Security:    User Profiles'        )
    .add('MAINTAIN_SECURITY'            , 'ACCESS_CNTRL_LISTX'           , 'GBL', 'Security:    Permission Lists'     )
    .add('MAINTAIN_SECURITY'            , 'ROLEMAINT'                    , 'GBL', 'Security:    Roles'                )
    .add('MAINTAIN_SECURITY'            , 'PSTREEMGRACC'                 , 'GBL', 'Query:       Query Access Manager' )
    .add('QUERY_MANAGER'                , 'QUERY_MANAGER'                , 'GBL', 'Query:       Query Manager'        )
    .add('PORTAL_ADMIN'                 , 'PORTAL_OBJ_LIST'              , 'GBL', 'Portal:      Structure and Content')
    .add('UOG_MIG_REQUEST'              , 'UM_MIGRATION_SRCH'            , 'GBL', 'Migration:   Migration Search'     )
  ;

  // build up menu
  var ul = $('<ul class="pscs-ul">');

  for (var i = 0; i < menuItems.length; i++) {
    // reconstruct urls for defined compoents
    var url = baseURL;
    url += '/psp';                       // force portal servlet
    url += '/' + site + '_newwin';       // force new window
    url += '/' + portal;
    url += '/' + node;
    url += '/c';
    url += '/' + menuItems[i].menu;
    url += '.' + menuItems[i].component;
    url += '.' + menuItems[i].market;

    var li = $('<li class="pscs-li"><a target="_blank" href="' + url + '">' + String.fromCharCode(menuItems[i].speedKey) + ' : ' + menuItems[i].descr + '</a></li>');
    $(li).attr('speedKey', menuItems[i].speedKey);
    $(ul).append(li);
  }

  var sticky_div = $('<div>').append('<div class="pscs-title">Select Component</div>').append(ul);
  sticky_div.hide().appendTo('head');

  var sticky_options = {
    'speed'       : 300,    // animations: fast, slow, or integer
    'duplicates'  : false,  // true or false
    'autoclose'   : 10000,  // integer or false
    'imagePath'   : chrome.extension.getURL("images/close.png") // data encoded image URL (imagePath option provided by danjenkins/Sticky)
  };

$(document).ready(function(){
  $shortcuts.click(function(){
    var s = $('.sticky:visible');

      // hide if already visible
      if ( $(s).size() ) {
        $(s).hide();
      }
      else {
        $(sticky_div).sticky(false, sticky_options);
      }
  });
});

}

/* ===== Click on an element (borrowed from Facebook Fixer, @namespace http://userscripts.org/people/14536) ===== */
function click(elm) {
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, window, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
  elm.dispatchEvent(evt);
}