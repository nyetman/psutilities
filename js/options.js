function insertShortcutRow() {
   var table = document.getElementById("shortcutsTable");
   var row = table.insertRow(-1);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   var cell4 = row.insertCell(3);
   cell1.innerHTML = "New";
   cell2.innerHTML = "New";
   cell3.innerHTML = "New";
   cell4.innerHTML = "New";
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
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("saveButton").addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', function() {
   document.getElementById("insertShortcutRowButton").addEventListener('click', insertShortcutRow);
});