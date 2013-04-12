function insertShortcutRow() {
   var table = document.getElementById("shortcutsTable");
   var row = table.insertRow(-1);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   var cell4 = row.insertCell(3);
   var cell5 = row.insertCell(4);
   cell1.innerHTML = " ";
   cell2.innerHTML = " ";
   cell3.innerHTML = " ";
   cell4.innerHTML = " ";
   cell5.innerHTML = " ";
   cell1.contentEditable = "true";
   cell2.contentEditable = "true";
   cell3.contentEditable = "true";
   cell4.contentEditable = "true";
   cell5.contentEditable = "true";
}

function buildHtmlTable(mylist) {
    var columns = addAllColumnHeaders(mylist);

    for (var i = 0 ; i < mylist.length ; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
            var cellValue = mylist[i][columns[colIndex]];

            if (cellValue == null) { cellValue = ""; }

            row$.append($('<td contentEditable="true" />').html(cellValue));
        }
        $("#shortcutsTable").append(row$);
    }
}

// Adds column headers to array which is returned.
function addAllColumnHeaders(mylist)
{
    var columnSet = [];

    for (var i = 0 ; i < mylist.length ; i++) {
        var rowHash = mylist[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1){
                columnSet.push(key);
            }
        }
    }

    return columnSet;
}

function saveOptions() {
   var select = document.getElementById("greeting");
   var greeting = select.children[select.selectedIndex].value;

   chrome.storage.sync.set({'greetingOption': greeting}, function() {
   });

   var select = document.getElementById("shortcuts");
   var shortcuts = select.children[select.selectedIndex].value;

   chrome.storage.sync.set({'shortcutsOption': shortcuts}, function() {
   });

   var table = $('#shortcutsTable').tableToJSON();
   chrome.storage.sync.set({'shortcutstable': table}, function() {
   });

   var status = document.getElementById("status");

   status.innerHTML = "Options Saved.";

   setTimeout(function() {
      status.innerHTML = "";
   }, 750);
}

function restoreOptions() {
   chrome.storage.sync.get('greetingOption', function(r) {
      var greetingvalue = r['greetingOption'];
      if (!greetingvalue) {
         document.getElementById("greeting").value = 'No';
      }
      else {
         document.getElementById("greeting").value = greetingvalue;
      }
   });

   chrome.storage.sync.get('shortcutsOption', function(r) {
      var greetingvalue = r['shortcutsOption'];
      if (!greetingvalue) {
         document.getElementById("shortcuts").value = 'No';
      }
      else {
         document.getElementById("shortcuts").value = greetingvalue;
      }
   });

   chrome.storage.sync.get('shortcutstable', function(r) {
      var shortcutstable = r['shortcutstable'];
      buildHtmlTable(shortcutstable);
   });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("saveButton").addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', function() {
   document.getElementById("insertShortcutRowButton").addEventListener('click', insertShortcutRow);
});