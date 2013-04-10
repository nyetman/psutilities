pthNav.psuShortcutPrefix = 'PSUSHORTCUTS';

/* rename original onClickCref function to psuVersion. */
pthNav.psuOnClickCref = pthNav.onClickCref;

/* Overwrite old onClickCref function with new code that checks if 
ctrl key press and adjust href and classes accordingly. */
pthNav.onClickCref = function(e) {
	
	/* Taken from original onClickCref function - Begin */
  var aCref = this;
  var liCref = this.parentNode;

  if (this.nodeName.toLowerCase() === "li"){  
    aCref = this.firstChild;
    liCref = this;
  }else if (this.nodeName.toLowerCase() === "div") {
    aCref = this.parentNode.firstChild;  
    liCref = this.parentNode;
  }
	/* Taken from original onClickCref function - End */
	
	/* Now if ctrl key pressed when clicking on link,	change href 
	and add classes that means will open in new window */
	var psuOldCref = aCref.href;
	if (e.ctrlKey && aCref.href) { 
		var reUrl = /(.*\/)(ps[cp]\/)([^\/]*)(\/.*)/gi;
  
    // get servlet/site/portal/node/menu/component/market
    var aReUrlResult = reUrl.exec(aCref.href);
    aReUrlResult[3]=aReUrlResult[3]+'_newwin';
    aReUrlResult.shift();
  
    aCref.href=aReUrlResult.join("");
    /* New window class */
    ptUtil.addClass(aCref, 'ptnnw');
    
    /* No Save Warning class */
    ptUtil.addClass(aCref, 'ptnns');
  }
  /* Call what was the original function. */
  pthNav.psuOnClickCref.call(this, e);
  
  /* Reset href and remove classes. */
  if (psuOldCref != aCref.href) {
  	aCref.href = psuOldCref;
    /* Remove classes */
    ptUtil.removeClass(aCref, 'ptnnw');
    ptUtil.removeClass(aCref, 'ptnns');
  }
  
  return false;
};

pthNav.psuDoClickBC = pthNav.doClickBC;


pthNav.doClickBC = function(bc,flyoutId) {
	pthNav.psuDoClickBC(bc,flyoutId);
	
	var flyoutId = pthNav.flyoutPrefix + bc.id.slice(pthNav.bcAncPrefix.length);
	var flyout = ptUtil.id(flyoutId);
	
	if (bc.parentNode.id==pthNav.bcLiPrefix + pthNav.psuShortcutPrefix) {
		
    var rootLi = ptUtil.id(pthNav.bcLiPrefix + pthNav.psuShortcutPrefix);
    rootLi.appendChild(flyout);
    
		flyout.style.left = "0px";
	}
};

pthNav.psuUl = ptUtil.id("pthnavpsushortcuts");
pthNav.addEvents(pthNav.psuUl);