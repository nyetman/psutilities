
pthNav.origdoClickBC = pthNav.doClickBC;

pthNav.psuShortcutPrefix = 'PSUSHORTCUTS';

pthNav.doClickBC = function(bc,flyoutId) {
	pthNav.origdoClickBC(bc,flyoutId);
	
	var flyoutId = pthNav.flyoutPrefix + bc.id.slice(pthNav.bcAncPrefix.length);
	var flyout = ptUtil.id(flyoutId);
	
	if (bc.parentNode.id==pthNav.bcLiPrefix + pthNav.psuShortcutPrefix) {
		
    var rootLi = ptUtil.id(pthNav.bcLiPrefix + pthNav.psuShortcutPrefix);
    rootLi.appendChild(flyout);
    
		flyout.style.left = "0px";
	}
}

/* var shortcutsUl = ptUtil.id('pthnavpsushortcuts'); 
pthNav.addEvents(shortcutsUl); */

	
