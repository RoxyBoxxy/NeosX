const fs = require('fs');
// Create an empty menubar
var menu = new nw.Menu({type: 'menubar'});

// Create a submenu as the 2nd level menu
var submenu = new nw.Menu();
var account = new nw.Menu();
submenu.append(new nw.MenuItem({ label: 'Item A', click: function(){alert('You have clicked at "Item A"');} }));
submenu.append(new nw.MenuItem({ label: 'Item B' }));
account.append(new nw.MenuItem({ label: 'Clear Cache', click: function(){localStorage.clear();} }));
// Create and append the 1st level menu to the menubar
menu.append(new nw.MenuItem({
  label: 'First Menu',
  submenu: submenu
}));
menu.append(new nw.MenuItem({
    label: 'Account',
    submenu: account
  }));

// Assign it to `window.menu` to get the menu displayed
nw.Window.get().menu = menu;

function store(e){
    fs.writeFileSync('account.json', e)
}
function get(){
    return fs.readFileSync('account.json', JSON.parse)

}