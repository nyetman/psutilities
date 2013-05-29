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

            $("div#pthdr2container").append("<div id='pthdr2myshortcuts'><ul class='dropdown'><li id='dropdownlist'>My Shortcuts<ul class='sub_menu'>");

            var $myshortcuts = $('.sub_menu');

            // Get shortcuts from storage
            chrome.storage.sync.get('shortcutstable', function(r) {
               var shortcutstablex = r['shortcutstable'];

               // Create array to hold groups
               var arrGroups = new Array();

               // Loop through shortcuts and get unique list of groups
               for (var i = 0 ; i < shortcutstablex.length ; i++) {
                  if (shortcutstablex[i].Group != "") {
                     if ($.inArray(shortcutstablex[i].Group, arrGroups) === -1) {
                        arrGroups.push(shortcutstablex[i].Group);
                        $myshortcuts.append("<li>" + shortcutstablex[i].Group + "&gt;&gt;<ul id='psutil_" + shortcutstablex[i].Group.replace(/\s+/g, '') + "'>");
                     }
                  }
               }

               for (var i = 0 ; i < shortcutstablex.length ; i++) {
                  // reconstruct urls for defined compoents
                  var urlx = baseURL;
                  urlx += '/psp'; // force portal servlet
                  urlx += '/' + site + '_newwin'; // force new window
                  urlx += '/' + portal;
                  urlx += '/' + node;
                  urlx += '/c';
                  urlx += '/' + shortcutstablex[i].Menu;
                  urlx += '.' + shortcutstablex[i].Component;
                  urlx += '.' + shortcutstablex[i].Market;

                  if (shortcutstablex[i].Parameters != "") {
                     urlx += '?' + shortcutstablex[i].Parameters
                  }

                  var lix = $('<li><a target="_blank" href="' + urlx + '">' + shortcutstablex[i].Description + '</a></li>');

                  if (shortcutstablex[i].Group != "") {
                     var $shortcuttemp = $('#psutil_' + shortcutstablex[i].Group.replace(/\s+/g, ''));

                     $shortcuttemp.append(lix);
                  }
                  else {
                     $myshortcuts.prepend(lix);
                  }
               }
            });
         }
      }
   });
   //
   // SHORTCUTS END
   //

function click(elm) {
   var evt = document.createEvent('MouseEvents');
   evt.initMouseEvent('click', true, true, window, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
   elm.dispatchEvent(evt);
}

