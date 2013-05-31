function insertShortcutRow() {
   var table = document.getElementById("shortcutsTable");
   var row = table.insertRow(-1);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   var cell4 = row.insertCell(3);
   var cell5 = row.insertCell(4);
   var cell6 = row.insertCell(5);
   var cell7 = row.insertCell(6);
   cell1.innerHTML = " ";
   cell2.innerHTML = " ";
   cell3.innerHTML = " ";
   cell4.innerHTML = " ";
   cell5.innerHTML = " ";
   cell6.innerHTML = " ";
   cell7.innerHTML = "<a href='#' Title='Remove Shortcut' id='removeShortcut'><img src='images/delete.png' alt='Remove'/></a>"
   cell1.contentEditable = "true";
   cell2.contentEditable = "true";
   cell3.contentEditable = "true";
   cell4.contentEditable = "true";
   cell5.contentEditable = "true";
   cell6.contentEditable = "true";
   cell7.style.border = "none";
   cell7.addEventListener('click', deleteShortcutRow);
}

function buildShortcutsTable(shortcutsTable) {
   for (var i = 0 ; i < shortcutsTable.length ; i++) {
      var table = document.getElementById("shortcutsTable");
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      cell1.innerHTML = shortcutsTable[i].Menu;
      cell2.innerHTML = shortcutsTable[i].Component;
      cell3.innerHTML = shortcutsTable[i].Market;
      cell4.innerHTML = shortcutsTable[i].Parameters;
      cell5.innerHTML = shortcutsTable[i].Group;
      cell6.innerHTML = shortcutsTable[i].Description;
      cell7.innerHTML = "<a href='#' Title='Remove Shortcut' id='removeShortcut'><img src='images/delete.png' alt='Remove'/></a>"
      cell1.contentEditable = "true";
      cell2.contentEditable = "true";
      cell3.contentEditable = "true";
      cell4.contentEditable = "true";
      cell5.contentEditable = "true";
      cell6.contentEditable = "true";
      cell7.style.border = "none";
      cell7.addEventListener('click', deleteShortcutRow);
   }
}

function insertcell(arrayValue) {
   if (arrayValue == null) { arrayValue = ""; }
   return arrayValue;
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

    table.sort(function(a, b){
        //note the array comparison [...] < [...]
        return [a.Group, a.Description] < [b.Group, b.Description] ? -1 : 1;
    });

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
      var greetingoptionvalue = r['greetingOption'];
      if (!greetingoptionvalue) {
         document.getElementById("greeting").value = 'No';
      }
      else {
         document.getElementById("greeting").value = greetingoptionvalue;
      }
   });

   chrome.storage.sync.get('shortcutsOption', function(r) {
      var shortcutsoptionvalue = r['shortcutsOption'];
      if (!shortcutsoptionvalue) {
         document.getElementById("shortcuts").value = 'No';
      }
      else {
         document.getElementById("shortcuts").value = shortcutsoptionvalue;
      }
   });

   chrome.storage.sync.get('shortcutstable', function(r) {
      var shortcutstable = r['shortcutstable'];
      buildShortcutsTable(shortcutstable);
   });
}

function deleteShortcutRow(e) {
   document.getElementById("shortcutsTable").deleteRow(this.parentNode.rowIndex);
}

function importShortcuts() {
   var input = $('#importExportArea').val();
   var data = $.csv.toObjects(input);
   buildShortcutsTable(data);
}

function exportShortcuts() {
   var output = "";
   var headerRow = true;

   $('#shortcutsTable tr').each(function () {
       if (!($(this).is(":first-child"))) {
           output += "\n";
       }

       $.each(this.cells, function () {
           if (headerRow || (!($(this).is(":last-child")))) {
               if (!($(this).is(":first-child"))) {
                   output += ",";
               }
               output += "\"" + $(this).html() + "\"";
           }
       });
       headerRow = false;
   });

   $('#importExportArea').html(output);
}

document.getElementById("saveButton").addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', function() {
   restoreOptions();
   document.getElementById("insertShortcutRowButton").addEventListener('click', insertShortcutRow);
   document.getElementById("importButton").addEventListener('click', importShortcuts);
   document.getElementById("exportButton").addEventListener('click', exportShortcuts);
})
;