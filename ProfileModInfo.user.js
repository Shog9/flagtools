// ==UserScript==
// @name          ProfileModInfo
// @description   put more info in the mod block on profiles
// @namespace     http://rubberduck.echoreply.us/
// @updateURL     https://github.com/Shog9/flagtools/raw/master/ProfileModInfo.user.js
// @downloadURL   https://github.com/Shog9/flagtools/raw/master/ProfileModInfo.user.js
// @version       2.0
// @include       http*://stackoverflow.com/users/*
// @include       http*://*.stackoverflow.com/users/*
// @include       http*://dev.stackoverflow.com/users/*
// @include       http*://askubuntu.com/users/*
// @include       http*://superuser.com/users/*
// @include       http*://serverfault.com/users/*
// @include       http*://mathoverflow.net/users/*
// @include       http*://*.stackexchange.com/users/*
// @include       http*://local.mse.com/users/*
// @exclude       http*://chat.*.com/*
// ==/UserScript==
 
function with_jquery(f) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.textContent = "if (window.jQuery) (" + f.toString() + ")(window.jQuery)" + "\n\n//# sourceURL=" + encodeURI(GM_info.script.namespace.replace(/\/?$/, "/")) + encodeURIComponent(GM_info.script.name); // make this easier to debug;
  document.body.appendChild(script);
};
 
with_jquery(function ($) {

   //
   // User page
   //
   if ( !/^\/users\/\d+\/?/.test(window.location.pathname) )
      return;

   var userId = +window.location.pathname.match(/^\/users\/(\d+)\//)[1];
   var modPanel = $(".profile-mod-info");

   // expand account info by default
   if ( !modPanel.is(":visible") )
      $(".account-toggle").click();
   
   $("<a href='#' id='showPII' style='display: block;text-align: center;border: 1px solid #eee;padding: 2px;'><b>Show all info</b></a>").appendTo(".profile-mod-info")
      .click(function(e)
      {
         e.preventDefault();
         $(this).remove();

         $(".pii:contains('(click to show)')").click();

         // load additional PII, because privacy is an illusion anyway
         $.post("/admin/all-pii", {id: userId, fkey: StackExchange.options.user.fkey})
            .then(function(pii)
            {
               for (let nv in $(pii).find(".row>.col-2").map(function() { return { name: this.textContent, value: $(this).next(".col-4").text() } }).toArray())
               {
                   if ( nv.name = "Real Name:" )
                       AddInfo("real name", nv.value);
               }
            });
      });

   // load "member since" info and bio. Why this is on only one page, I don't know, but it is annoying
   $.get("/users/"+userId+"?tab=profile")
      .then(function(result)
      {
         var editor = $(result);
         AddInfo("member since", editor.find(".user-card .profile-links li").has("svg.iconHistory").find("span[title]").attr("title"));

         var type = editor.find(".about .profile-user--name .fs-subheading").text().replace(/[()]/g, '');

         AddInfo("user type", type || 'registered');
         AddInfo(editor.find(".profile-user--bio").text());
      });

   function AddInfo(label, value)
   {
      if ( arguments.length === 1 )
         $("<tr><td colspan='5'></td></tr>").appendTo(".profile-mod-info table tbody")
            .find("td").text(label);
      else
         $("<tr><td colspan='2'></td><td class='mod-label'><span></span></td><td colspan='2'></td></tr>")
            .appendTo(".profile-mod-info table tbody")
            .find('.mod-label span').text(label).end()
            .find('td:eq(2)').text(value).end();
   }

   var container = $("<div id='profile-mod-info-tools' style='border-bottom: 1px solid rgba(100,100,100,0.1); margin-bottom: 2px; padding-bottom: 2px;'>")
      .prependTo(".profile-mod-info");

   // ...now add info tools
      
   $("<a href='/users/history/" + userId + "'>history</a>")
      .appendTo(container)
      .after("<span class='lsep' style='font-size:inherit;visibility:visible;'>|</span>");
   $("<a href='/admin/show-user-votes/" + userId + "'>votes</a>")
      .appendTo(container)
      .after("<span class='lsep' style='font-size:inherit;visibility:visible;'>|</span>");
   $("<a href='/admin/users/" + userId + "/post-comments'>comments</a>")
      .appendTo(container)
      .after("<span class='lsep' style='font-size:inherit;visibility:visible;'>|</span>");
   $("<a href='/users/" + userId + "?tab=activity'>activity</a>")
      .appendTo(container)
      .after("<span class='lsep' style='font-size:inherit;visibility:visible;'>|</span>");
   $("<a href='/admin/show-user-ips/" + userId + "'>IPs</a>")
     .appendTo(container);
   $("<span> (<a href='/admin/xref-user-ips/" + userId + "'>xref</a>)</span>")
     .appendTo(container)   
      ;//.after("<span class='lsep' style='font-size:inherit;visibility:visible;'>|</span>");
      
    
});
