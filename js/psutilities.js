   //
   // GREETING BEGIN
   //
   chrome.storage.sync.get('greetingOption', function(r) {
      var greetingvalue = r['greetingOption'];

      if (greetingvalue == 'Yes') {
         var locStr = window.location.href;

         //Find psp in URL
         var envBegin = locStr.search('psp');

         //Substring the URL starting 4 positions after psp (this should be where the environment starts
         var tempLocStr = locStr.substring(envBegin + 4);

         //Split the URL by / and get everything to the left of the first / (this should be our entire environment name
         var envString = tempLocStr.split('/')[0];

         //If multiple windows are open, they will have _ followed by a number appended to the environment, remove this
         var finalEnv = envString.split('_')[0];

         //If greeting doesn't exist in header then add it
         if ($("#pthdr2greeting").length == 0) {
            $("div#pthdr2container").append("<div id='pthdr2greeting'><span class='greeting'>&nbsp;</span></div>");
         }

         //Select greeting in the header
         var $greet = $('#pthdr2greeting .greeting');

         //Populate greeting in header with environment
         if ($.trim($greet.text()) == '') {
            $greet.text(finalEnv);
         }
      }
   });

   //
   // GREETING END
   //

   //
   // SHORTCUTS BEGIN
   //
   chrome.storage.sync.get('shortcutsOption', function(r) {
      var shortcutsvalue = r['shortcutsOption'];

      if (shortcutsvalue == 'Yes') {
         $("div#pthdr2container").append("<div id='pthdr2shortcuts'><span class='shortcuts'>Shortcuts</span></div>");

         var $shortcuts = $('#pthdr2container .shortcuts');

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
            var site = urlResult[3].replace(/\_\d+/ig, '');
            var portal = urlResult[4];
            var node = urlResult[5];

            // build up menu
            var ul = $('<ul class="pscs-ul">');

            // COMMENT OUT FOR NOW, BUT THIS GETS THE SHORTCUTS TABLE FROM STORAGE
            chrome.storage.sync.get('shortcutstable', function(r) {
               var shortcutstable = r['shortcutstable'];
               for (var i = 0 ; i < shortcutstable.length ; i++) {
                  // reconstruct urls for defined compoents
                  var url = baseURL;
                  url += '/psp'; // force portal servlet
                  url += '/' + site + '_newwin'; // force new window
                  url += '/' + portal;
                  url += '/' + node;
                  url += '/c';
                  url += '/' + shortcutstable[i].Menu;
                  url += '.' + shortcutstable[i].Component;
                  url += '.' + shortcutstable[i].Market;
                  if (shortcutstable[i].Parameters != "") {url += '?' + shortcutstable[i].Parameters}
                  var li = $('<li class="pscs-li"><a target="_blank" href="' + url + '">' + shortcutstable[i].Description + '</a></li>');
                  $(ul).append(li);
               }
            });

            var sticky_div = $('<div>').append('<div class="pscs-title">Shortcuts</div>').append(ul);
            sticky_div.hide().appendTo('head');

            var sticky_options = {
               'speed': 300, // animations: fast, slow, or integer
               'duplicates': false, // true or false
               'autoclose': 5000, // integer or false
               'imagePath': chrome.extension.getURL("images/close.png") // data encoded image URL (imagePath option provided by danjenkins/Sticky)
            };
            
            $("ul.pthnav").prepend("<li id='pthnavfavsep'>&nbsp;</li>");
            $("ul.pthnav").prepend("<li id='pthnavbc_PSUSHORTCUTS' class='pthnavbarfldr'><a id='pthnavbca_PSUSHORTCUTS' role='menuitem' aria-haspopup='true' class='pthnavbcanchor' href=''>Shortcuts</a></li>");
            $("#pthnavbc_PSUSHORTCUTS").append('<div id="pthnavfly_PSUSHORTCUTS" class="pthnavflyout pthnavflyoutclose" role="menu" style=""><div class="pthnavflyoutscroll" role="presentation"><ul class="pthnavscrollul"><li class="pthnavfakeli">&nbsp;</li></ul></div></div>');
          	$("#pthnavfly_PSUSHORTCUTS").append('<div class="pthnavshadow" role="presentation"><div class="pthnavscrollup" role="presentation">&nbsp;</div><div class="pthnavscroll" role="menu" style="overflow: hidden; height: auto;"><ul id="pthnavpsushortcuts" style="position: relative; top: 0px;"></ul></div><div class="pthnavscrolldown">&nbsp;</div></div>');
          
            // build up menu
            var $ul = $("#pthnavfly_PSUSHORTCUTS ul#pthnavpsushortcuts");
          
            for (var i = 0; i < menuItems.length; i++) {
              // reconstruct urls for defined compoents
              var url = baseURL;
              url += '/psp';                       // force portal servlet
              url += '/' + site;       // force new window
              url += '/' + portal;
              url += '/' + node;
              url += '/c';
              url += '/' + menuItems[i].menu;
              url += '.' + menuItems[i].component;
              url += '.' + menuItems[i].market;
          
              var $li = $('<li class="pthnavcref pthnav-mouse" id="crefli_PSUSHORTCUT' + i + '"><a href="' + url + '" role="menuitem">' + menuItems[i].descr + '</a><div class="pthnavcrefimg">&nbsp;</div></li>');
          
              $($ul).append($li);
            }
          
            var s = document.createElement('script');
            s.src = chrome.extension.getURL("js/inject.js");
            s.onload = function() {
              this.parentNode.removeChild(this);
            };
            (document.head||document.documentElement).appendChild(s);

            $(document).ready(function() {

               $shortcuts.click(function() {
                  var s = $('.sticky:visible');

                  // hide if already visible
                  if ($(s).size()) {
                     $(s).hide();
                  }
                  else {
                     $(sticky_div).sticky(false, sticky_options);
                  }
               });
            });
         }
      }
   });
   //
   // SHORTCUTS END
   //

/* ===== Click on an element (borrowed from Facebook Fixer, @namespace http://userscripts.org/people/14536) ===== */
function click(elm) {
   var evt = document.createEvent('MouseEvents');
   evt.initMouseEvent('click', true, true, window, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
   elm.dispatchEvent(evt);
}