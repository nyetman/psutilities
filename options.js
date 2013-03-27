function saveOptions() {
   var select = document.getElementById("greeting");
   var greeting = select.children[select.selectedIndex].value;

   chrome.storage.sync.set({'greetingOption': greeting}, function() {
      var status = document.getElementById("status");
      status.innerHTML = "Options Saved.";
      setTimeout(function() {
         status.innerHTML = "";
      }, 750);
   });
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
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("saveButton").addEventListener('click', saveOptions);
