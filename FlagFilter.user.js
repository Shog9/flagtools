// ==UserScript==
// @name          FlagFilter
// @description   Alternate flag dashboard UI scratchpad
// @author        Shog9
// @namespace     https://github.com/Shog9/flagfilter/
// @version       5
// @include       http*://stackoverflow.com/*
// @include       http*://*.stackoverflow.com/*
// @include       http*://dev.stackoverflow.com/*
// @include       http*://askubuntu.com/*
// @include       http*://superuser.com/*
// @include       http*://serverfault.com/*
// @include       http*://mathoverflow.net/*
// @include       http*://*.stackexchange.com/*
// @exclude       http*://chat.*.com/*
// ==/UserScript==

// this serves only to avoid embarassing mistakes caused by inadvertently loading this script onto a page that isn't a Stack Exchange page
var isSEsite = false;
for (var s of document.querySelectorAll("script")) isSEsite = isSEsite||/StackExchange\.ready\(/.test(s.textContent);

// don't bother running this if the user isn't a moderator on the current site
if (!isSEsite || typeof StackExchange === "undefined" || !StackExchange.options.user.isModerator)
{
   return;
}

function with_jquery(f) 
{
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.textContent = "if (window.jQuery) (" + f.toString() + ")(window.jQuery)" + "\n\n//# sourceURL=FlagFilter.userscript";
  document.body.appendChild(script);
}


with_jquery(function()
{
   window.FlagFilter = window.FlagFilter || {};   

   $(function()
   {
      initRoute();
   });
   
function initRoute()
{
   if (/^\/admin/.test(window.location.pathname))
   {
      // add tab so we can find this thing
      $("#tabs a[href='/admin/dashboard']")
         .after('<a href="/admin/flags" title="a simple list of all pending flags with fast filtering">filtered flags</a>');
   }

   if (/^\/admin\/flags\/?$/.test(window.location.pathname) )
   {
      initStyles();
      initTools();
      initFlagFilter();
   }
   
   if (/^\/questions\//.test(window.location.pathname))
   {
      initStyles();
      initQuestionPage();
   }   
}
   
function initStyles()
{
// crap I'd normally load separately
   
   
// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function() {
	"use strict";

	var doT = {
		version: '1.0.1',
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	'it',
			strip:		true,
			append:		true,
			selfcontained: false
		},
		template: undefined, //fn, compile template
		compile:  undefined  //fn, for express
	}, global;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = doT;
	} else if (typeof define === 'function' && define.amd) {
		define(function(){return doT;});
	} else {
		global = (function(){ return this || (0,eval)('this'); }());
		global.doT = doT;
	}

	function encodeHTMLSource() {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
			matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
		return function() {
			return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
		};
	}
	String.prototype.encodeHTML = encodeHTMLSource();

	var startend = {
		append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" },
		split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"}
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === 'string') ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf('def.') === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ':') {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return '';
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, '_');
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
			.replace(/'|\\/g, '\\$&')
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.start + unescape(code) + cse.endencode;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
			.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode && c.selfcontained) {
			str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());

/////////////////////////
// Templates
FlagFilter.templates = {"flag": function(it
/**/) {
var out='<h3><a href=\''+(it.url||'').toString().encodeHTML()+'\'>'+(it.title||'').toString().encodeHTML()+'</a></h3><div class="tags">';var arr1=it.tags;if(arr1){var tag,i1=-1,l1=arr1.length-1;while(i1<l1){tag=arr1[i1+=1];out+=' <a href="/questions/tagged/'+(tag||'').toString().encodeHTML()+'" class="post-tag" title="show questions tagged \''+(tag||'').toString().encodeHTML()+'\'" rel="tag">'+(tag||'').toString().encodeHTML()+'</a>';} } out+='</div><div class="author"> created <span title="'+FlagFilter.tools.formatISODate(it.created)+'" class="relativetime"> '+(FlagFilter.tools.formatDate(it.created)||'').toString().encodeHTML()+' </span>';if(it.author){out+=' <a href=\''+(it.author.url||'').toString().encodeHTML()+'\'>'+(it.author.name||'').toString().encodeHTML()+'</a>';}else{out+=' unknown';}out+='</div><ul class="flagList">';var arr2=it.flags;if(arr2){var flag,i2=-1,l2=arr2.length-1;while(i2<l2){flag=arr2[i2+=1];out+=' <li>'+(flag.description)+' ';if(flag.relatedPosts){out+=' <ul> ';var arr3=flag.relatedPosts;if(arr3){var rpost,i3=-1,l3=arr3.length-1;while(i3<l3){rpost=arr3[i3+=1];out+=' <li><a href=\''+(rpost.url||'').toString().encodeHTML()+'\'>'+(rpost.title||'').toString().encodeHTML()+'</a></li> ';} } out+=' </ul> ';}out+=' - ';var arr4=flag.flaggers;if(arr4){var flagger,i=-1,l4=arr4.length-1;while(i<l4){flagger=arr4[i+=1];out+=' <a href=\''+(flagger.url||'').toString().encodeHTML()+'\'>'+(flagger.name||'').toString().encodeHTML()+'</a> ('+(flagger.helpfulFlags||0)+'/'+(flagger.declinedFlags||0)+'), ';} } out+=' <span title="'+FlagFilter.tools.formatISODate(flag.created)+'" class="relativetime"> '+(FlagFilter.tools.formatDate(flag.created)||'').toString().encodeHTML()+' </span> </li>';} } out+='</ul>';return out;
},
"flagFilter": function(it
/**/) {
var out='';var arr1=it;if(arr1){var cat,i1=-1,l1=arr1.length-1;while(i1<l1){cat=arr1[i1+=1];out+='<h3>'+(cat.category||'').toString().encodeHTML()+'</h3><div class="flagFilterCategory"> <ul> ';var arr2=cat.filters;if(arr2){var filter,i2=-1,l2=arr2.length-1;while(i2<l2){filter=arr2[i2+=1];out+=' <li class="flagFilter"> <b>'+(filter.count)+'</b> &times; <a href=\'?filter='+(filter.search||'').toString().encodeHTML()+'\' class=\''+(filter.cssClass||"")+'\'>'+(filter.name||'').toString().encodeHTML()+'</a> </li> ';} } out+=' </ul></div>';} } return out;
},
"flagsLayout": function(it
/**/) {
var out='<div id="mainbar-full"> <div class="subheader"> <h1>Moderator Tools</h1> <div id="tabs"> <a href="/admin/links" title="moderator utilities and links">links</a> <a href="/admin" title="summary of moderator activity">history</a> <a href="/admin/dashboard" title="summary of current moderator alerts">flags</a> <a class="youarehere" href="/admin/flags" title="a simple list of all pending flags with fast filtering">filtered flags</a> <a href="/admin/posts/migrated/here" title="recently migrated posts">migrated</a> <a href="/admin/users" title="users with flags, user messages, suspended users, annotations">users</a> <a href="/admin/posts" title="locked posts, auto-flagged posts">posts</a> <a href="/admin/analytics" title="site usage metrics">analytics</a> </div> </div></div><div id="flagSort"><label>Sort:</label><label><input type="radio" name="sort" value="postDesc">post creation (desc)</label><label><input type="radio" name="sort" value="postAsc">post creation (asc)</label><label><input type="radio" name="sort" value="flagDesc" checked="checked">first flag (desc)</label><label><input type="radio" name="sort" value="flagAsc">first flag (asc)</label><label><input type="radio" name="sort" value="netHelpfulDesc">flagger hist (desc)</label><label><input type="radio" name="sort" value="netHelpfulAsc">flagger hist (asc)</label></div><div id=\'flaggedPosts\'> <h1>Loading Flags <img src=\'//sstatic.net/img/progress-dots.gif\'></h1></div><div id=\'flagFilters\'></div>';return out;
}};

/////////////////////////////
// CSS
var flagStyles = document.createElement("style");
flagStyles.textContent = `#flaggedPosts
{
	width: 640px;
	overflow: hidden;
	padding-right: 20px;
	float: left;
}

.FlaggedPost
{
	padding: .25em;
}

.FlaggedPost:nth-child(2n)
{
	background-color: rgba(0,0,0,0.025);
}

.FlaggedPost h3
{
   font-family: Arial;
   font-weight: normal;
   font-size: 16px;
}

#postflag-bar .filtered-nav
{
   position: absolute;
   min-height: 40px;
   padding: 2px;
   top: 0;
   bottom: 0;
   font-size: 20px;   
   cursor: pointer;
   width: 30px;
   background-color: #33a030;
}

#postflag-bar .filtered-nav.next
{
   text-align: left;
   border-left: 1px solid #9fa6ad;
   right: 0;
}

#postflag-bar .filtered-nav.prev
{
   text-align: right;
   border-right: 1px solid #9fa6ad;
   left: 0;
}

#postflag-bar .filtered-nav a
{
   color: #FFF;
}
#postflag-bar .filtered-nav a:hover
{
   text-decoration: none;
}
#postflag-bar .filtered-nav:hover a
{
   color: #6a737c;
}

ul.flagList
{
	clear: both;
	padding-top: 1em;
}

.author
{
	float: right;
}

#flagFilters
{
	width:320px;
	overflow:hidden;
}

.flagFilterCategory
{
	max-height: 200px;
	overflow: auto;
}

.flagFilterCategory ul
{
	list-style: none;
	margin-left: 1em;
}

#flagSort
{
	margin-bottom: 1em;
}

#flagSort label
{
	margin-right: 1em;
}
`;

document.head.appendChild(flagStyles);
}

//
// Misc utils
//

function getQSVal(name)
{
   var val = [];
   window.location.search.substr(1).split('&').forEach(function(p)
   {
      var kv = p.split('=');
      if ( kv[0] === name && kv.length > 1 )
         val.push(decodeURIComponent(kv[1]));
   });

   return val;
}

function goToFilteredFlag(delta)
{
   var filtered = localStorage.flaaaaags.split(',');
   var index = filtered.indexOf(location.pathname.match(/\/questions\/(\d+)/)[1]);
   if ( index+delta >= 0 && index+delta < filtered.length )
   {
      window.location.pathname = "/questions/" + filtered[index+delta];
      return false;
   }
}



//
// Generally-useful moderation routines
//
function initTools()
{
   FlagFilter.tools = $.extend({}, FlagFilter.tools, {
      CloseReasons: { Duplicate: 'Duplicate', OffTopic: 'OffTopic', Unclear: 'Unclear', TooBroad: 'TooBroad', OpinionBased: 'OpinionBased' },
      UniversalOTReasons: { Default: 1, BelongsOnSite: 2, Other: 3 },

      // format for close options:
      // { closeReasonId            string - one of the close reasons above
      // duplicateOfQuestionId      number - question id for duplicate, otherwise not set
      // closeAsOffTopicReasonId    number - site-specific reason ID for OT, otherwise not set
      // belongsOnBaseHostAddress   string - host domain for destination site for OT, otherwise not set
      // offTopicOtherText          string - custom OT text for when the OT reason is "other"
      //                                     and offTopicOtherCommentId is not set
      // offTopicOtherCommentId     string - reference to an existing comment on the post describing
      //                                     why the question is off-topic for when the OT reason is "other"
      //                                     and offTopicOtherText is not specified.
      // originalOffTopicOtherText  string - the placeholder / prefix text used to prompt for the OT other reason,
      //                                     used when offTopicOtherText is specified, otherwise not set
      // }

      closeQuestion: function(postId, closeOptions)
      {
         closeOptions.fkey = StackExchange.options.user.fkey;
         return $.post('/flags/questions/' + postId + '/close/add', closeOptions)
      },

      migrateTo: function(postId, destinationHost)
      {
         return FlagFilter.tools.closeQuestion(postId,
            {
               closeReasonId: FlagFilter.tools.CloseReasons.OffTopic,
               closeAsOffTopicReasonId: FlagFilter.tools.UniversalOTReasons.BelongsOnSite,
               belongsOnBaseHostAddress: destinationHost
            });
      },

      annotateUser: function(userId, annotation)
      {
         return $.post('/admin/users/' + userId + '/annotate',
            {
               "mod-actions": "annotate",
               annotation: annotation,
               fkey: StackExchange.options.user.fkey
            });
      },

      reviewBanUser: function(userId, days, explanation)
      {
         var params = {
               userId: userId,
               reviewBanDays: days,
               fkey: StackExchange.options.user.fkey
            };
         if ( explanation )
            params.explanation = explanation;
         return $.post('/admin/review/ban-user', params);
      },

      // hate safari
      parseISODate: function(isoDate, def)
      {
         var parsed = Date.parse((isoDate||'').replace(' ','T'));
         return parsed ? new Date(parsed) : def;
      },

      formatDate: function(date)
      {
         if ( !date.getTime() ) return "(??)";
         
         // mostly stolen from SE.com
         var delta = (((new Date()).getTime() - date.getTime()) / 1000);

         if (delta < 2) {
            return 'just now';
         }
         if (delta < 60) {
            return Math.floor(delta) + ' secs ago';
         }
         if (delta < 120) {
            return '1 min ago';
         }
         if (delta < 3600) {
            return Math.floor(delta / 60) + ' mins ago';
         }
         if (delta < 7200) {
            return '1 hour ago';
         }
         if (delta < 86400) {
            return Math.floor(delta / 3600) + ' hours ago';
         }
         if (delta < 172800) {
            return 'yesterday';
         }
         if (delta < 259200) {
            return '2 days ago';
         }
         return date.toLocaleString(undefined, {month: "short", timeZone: "UTC"})
            + ' ' + date.toLocaleString(undefined, {day: "2-digit", timeZone: "UTC"})
            + ( delta > 31536000 ? ' \'' + date.toLocaleString(undefined, {year: "2-digit", timeZone: "UTC"}) : '')
            + ' at' 
            + ' ' + date.toLocaleString(undefined, {minute: "2-digit", hour: "2-digit", hour12: false, timeZone: "UTC"});
      },
      
      formatISODate: function(date)
      {
         return date.toJSON().replace(/\.\d+Z/, 'Z');        
      },

      dismissAllCommentFlags: function(commentId, flagIds)
      {
         // although the UI implies it's possible, we can't currently dismiss individual comment flags
        return $.post('/admin/comment/' + commentId+ '/clear-flags', {fkey:StackExchange.options.user.fkey});
      },


      dismissFlag: function(postId, flagIds, helpful, declineId, comment)
      {
         var ticks = window.renderTimeTicks||(Date.now()*10000+621355968000000000);
         return $.post('/messages/delete-moderator-messages/' + postId + '/'
            + ticks + '?valid=' + helpful + '&flagIdsSemiColonDelimited=' + (flagIds.join ? flagIds.join(';') : flagIds),
            {comment: comment||declineId||'', fkey:StackExchange.options.user.fkey});
      },

      dismissAllFlags: function(postId, helpful, declineId, comment)
      {
         var ticks = window.renderTimeTicks||(Date.now()*10000+621355968000000000);
         return $.post('/messages/delete-moderator-messages/' + postId + '/'
            + ticks+ '?valid=' + helpful,
            {comment: comment||declineId||'', fkey:StackExchange.options.user.fkey});
      },

      moveCommentsToChat: function(postId)
      {
         return $.post('/admin/posts/' + postId + '/move-comments-to-chat', {fkey:StackExchange.options.user.fkey});
      },
      
      makeWait: function(msecs)
      {
         return function()
         {
            var args = arguments;
            var result = $.Deferred();
            setTimeout(function() { result.resolve.apply(result, args) }, msecs);
            return result.promise();
         }
      }
   });
}

function initQuestionPage()
{
   if ( localStorage.flaaaaags )
   {
      $(".nav-button.next")
         .addClass("filtered-nav")
         .attr("title", "go to the next filtered flag")
         .off("click")
         .removeClass("nav-button")
         .click(function(e) { return goToFilteredFlag(1) });
      $(".nav-button.prev")
         .addClass("filtered-nav")
         .attr("title", "go to the previous filtered flag")
         .off("click")
         .removeClass("nav-button")
         .click(function(e) { return goToFilteredFlag(-1) });

      // show progress
      var filtered = localStorage.flaaaaags.split(',');
      var index = filtered.indexOf(location.pathname.match(/\/questions\/(\d+)/)[1]);
      $("#postflag-bar .flag-wrapper, #postflag-bar .flag-summary").first()
            .prepend(`<div><a href="${localStorage.getItem("flaaaaags.lastFilter")}">Processing filtered flags: ${localStorage.getItem("flaaaaags.lastFilterName")}</a> ${(index+1)} of ${filtered.length}</div>`);
   }
}

//
// coopt a 404 to provide an easily-filterable list of flags
//

function initFlagFilter()
{
   var flaggedPosts = [];
   var initializing = true;

   document.title = "Flaaaaaags!";
   $('#content').html(FlagFilter.templates.flagsLayout());

   $("<div id='filterbox' style='position:fixed;bottom:0;left:0;width:100%;z-index:10000;background:white;'><hr><span style='float:right;padding-right:10em;' id='flagCount'></span> Filter: <input id='flagfilter' style='width:50%'></div>")
         .appendTo('body')
   
   LoadAllFlags().then(function(fp)
   {
      FlagFilter.flaggedPosts = flaggedPosts = fp.sort(function(a,b){return b.flags.length-a.flags.length;});

      initializing = false;

      renderFilters(flaggedPosts, $('#flagFilters'));

      restoreFilter();

      var filterDelay;
      $("#flagfilter").keyup(function()
      {
        var filter = $(this).val();

        if ( filterDelay)
            clearTimeout(filterDelay);

        filterDelay = setTimeout(function()
         {
            filterDelay=null;
            setFilter(filter);
         }, 600);
      });

   });

   $("#flagFilters").on("click", ".flagFilter a", function(ev)
      {
         ev.preventDefault();
         history.pushState(this.href, '', this.href);
         restoreFilter();
      });

   $(window).on('popstate', restoreFilter);

   $("#flagSort input[name=sort]").click(restoreFilter);
      
   function LoadAllFlags()
   {
      var ret = $.Deferred();
   
      fetch("/admin/all-flags", {method: "GET", credentials: "include"})
         .then( resp => resp.json() )
         .then( 
            function(respJSON) { ret.resolve(ParseDates(respJSON)) },
            function(err) { ret.reject(err) }
         );
      
      return ret.promise();
      
      function ParseDates(flagJSON)
      {
         for (let post of flagJSON)
         {
            post.created = FlagFilter.tools.parseISODate(post.created);
            if ( post.closed ) post.closed = FlagFilter.tools.parseISODate(post.closed);
            if ( post.deleted ) post.deleted = FlagFilter.tools.parseISODate(post.deleted);
            
            for (let flag of post.flags)
               flag.created = FlagFilter.tools.parseISODate(flag.created);
         }
         return flagJSON;
      }
   }
      
   function restoreFilter()
   {
      var filter = getQSVal("filter")[0] || '';

      $("#flagfilter").val(filter);
      filterFlags(filter);
   }

   function setFilter(filter)
   {
      if ( filter === getQSVal("filter")[0] || '' )
         return;

      history.pushState(filter, '', filter ? '?filter=' + encodeURIComponent(filter) : location.pathname);
      filterFlags(filter);
   }

   function filterFlags(filter)
   {
      if ( initializing ) return;

      var filterFn = buildFilterFunction(filter);
      var sortFn = getSortFunction();
      var filteredFlaggedPosts = flaggedPosts.filter(filterFn);
      var collaspedFilteredFlaggedPosts = collapseFlags(filteredFlaggedPosts);
      var sortedCollapsedFilteredFlaggedPosts = collaspedFilteredFlaggedPosts.sort(sortFn);

      localStorage.setItem("flaaaaags",
         unique(sortedCollapsedFilteredFlaggedPosts.map(function(p) { return p.questionId; })).join(','));
      localStorage.setItem("flaaaaags.lastFilter", location.toString());
      localStorage.setItem("flaaaaags.lastFilterName", getNameForFilter(filter));

      $('#flaggedPosts').empty();
      renderFlags(sortedCollapsedFilteredFlaggedPosts).then(function()
      {
         $("<a>Dismiss all of these flags</a>")
            .appendTo('#flaggedPosts')
            .click(function() { dismissAllFilteredFlags($('#flaggedPosts'), unique(sortedCollapsedFilteredFlaggedPosts.map(function(p) { return p.postId; })), filter) });
      });

      $("#flagCount").text(filteredFlaggedPosts.length + " flagged posts");
      
      function getNameForFilter(f)
      {
         f = encodeURIComponent(f);
         for (let cat of FlagFilter.filters)
            for (let filter of cat.filters)
               if ( filter.search === f ) return cat.category + ": " + filter.name;
         return "";
      }      

      function getSortFunction()
      {
         var sortFuncs = {
            postDesc: function(a,b)
            {
               return a.created - b.created;
            },
            postAsc: function(b,a)
            {
               return a.created - b.created;
            },
            flagDesc: function(a,b)
            {
               return a.flags[0].created - b.flags[0].created;
            },
            flagAsc: function(b,a)
            {
               return a.flags[0].created - b.flags[0].created;
            },
            netHelpfulDesc: function(b,a)
            {
              var aHelpful = Math.max.apply(null,a.flags.map(function(f){return f.flagger.helpfulFlags-f.flagger.declinedFlags;}));
              var bHelpful = Math.max.apply(null,b.flags.map(function(f){return f.flagger.helpfulFlags-f.flagger.declinedFlags;}));
              return aHelpful-bHelpful;
            },
            netHelpfulAsc: function(a,b)
            {
              var aHelpful = Math.max.apply(null,a.flags.map(function(f){return f.flagger.helpfulFlags-f.flagger.declinedFlags;}));
              var bHelpful = Math.max.apply(null,b.flags.map(function(f){return f.flagger.helpfulFlags-f.flagger.declinedFlags;}));
              return aHelpful-bHelpful;
            }
         };

         return sortFuncs[$("#flagSort input[name=sort]:checked").val()] || sortFuncs.flagDesc;
      }

      function collapseFlags(flaggedPosts)
      {
         return flaggedPosts.map(function(fp)
         {
            var collapsedFlags = fp.flags
               .sort(function(a,b) { return a.created - b.created; }) // oldest flag in a group wins
               .reduce(function(cf, flag)
               {
                  if ( !cf[flag.description] )
                  {
                     cf[flag.description] = flag;
                     flag.flaggers = [];
                  }
                  cf[flag.description].flaggers.push(flag.flagger);
                  return cf;
               }, {});
            collapsedFlags = $.map(collapsedFlags, function(flag) { return flag; });

            return $.extend({}, fp, {flags:collapsedFlags});
         });
      }

      function renderFlags(flaggedPosts, startAt)
      {
         var result = $.Deferred();
         
         // don't let these overlap
         clearTimeout(window.renderTimer);
         window.renderTimer = null; // debugging

         startAt = startAt||0;
         var startTime = Date.now();
         var maxRunTime = 150;

         var container = $('#flaggedPosts');

         for (; startAt<flaggedPosts.length && Date.now()-startTime < maxRunTime; ++startAt)
         {
            $("<div class='FlaggedPost'>")
               .html(FlagFilter.templates.flag(flaggedPosts[startAt]))
               .appendTo(container);
         }

         StackExchange.realtime.updateRelativeDates(); // render dates in the standard fashion

         // finish rendering after letting the display update
         if ( startAt<flaggedPosts.length )
            window.renderTimer = setTimeout(function() { renderFlags(flaggedPosts, startAt).then(function(){result.resolve()}); }, 100);
         else
            result.resolve();
            
         return result.promise();
      }
      
   }

   function buildFilterFunction(filter)
   {
      var filters = [];

      var filterOperators = {
         user: function(userId)
         {
            return this.author
               && (this.author.url == userId || this.author.url.indexOf("/users/"+userId+"/") == 0);
         },

         tag: function(tag)
         {
            return this.tags.some(function(t)
            {
               return t == tag;
            });
         },

         flagger: function(userId)
         {
            return this.flags.some(function(f)
            {
               return f.flagger
                  &&  (f.flagger.url == userId || f.flagger.url.indexOf("/users/"+userId+"/") == 0);
            });
         },

         type: function(type)
         {
            return this.flags.some(function(f)
            {
               return f.flagType + (f.flagReason||'')==type;
            });
         },

         selfflagged: function()
         {
            var author = this.author;
            return this.flags.some(function(f)
            {
               return f.flagger && author && f.flagger.url==author.url;
            });
         },

         not: function(filter)
         {
            var fn = buildFilterFunction(filter);
            return !fn(this);
         },

         isquestion: function() { return this.questionId==this.postId; },
         isanswer: function() { return this.questionId!=this.postId; },
         isdeleted: function() { return !!this.deleted; },
         isclosed: function() { return !!this.closed; },
         isanswered: function() { return this.hasAcceptedAnswer; },
         isaccepted: function() { return this.isAcceptedAnswer; }
      };

      $.each(filterOperators, function(name, fn)
      {
         filter = filter.replace(new RegExp("(?:fn)?\\:" + name + "(?:\\(("
            + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" // stolen from sizzle 'cause my eyes hurt to look at it
            + "[^\\)]*"
            + ")\\))", "g"),
            function()
            {
               var arg, i;
               for (i=4; !arg && i>0; --i)
                  arg = arguments[i];

               filters.push(function(fp)
               {
                  return fn.call(fp, arg);
               });
               return '';
            });
            return filter !== '';
      });

      if ( $.trim(filter).length || !filters.length )
      {
         filters.push(function(fp)
         {
            return fp.flags.some(function (f)
            {
               return new RegExp(filter||'', 'i').test(f.description);
            });
         });
      }

      return function(fp) { return filters.every(function(f) { return f(fp); }); }
   }

   function buildFilters(flaggedPosts)
   {
      var filters = {};
      function addFilter(category, name, search, cssClass)
      {
         var cat = filters[category] = filters[category]||{};
         var filter = cat[search] = cat[search]
            ||{name:name,search:encodeURIComponent(search), cssClass: cssClass, count:0};
         filter.count++;
      }
      function addSearchFilter(category, name, search, cssClass)
      {
         var count = flaggedPosts.filter(buildFilterFunction(search)).length;
         if ( !count ) return;

         var cat = filters[category] = filters[category]||{};
         var filter = cat[search] = cat[search]
            ||{name:name,search:encodeURIComponent(search), cssClass: cssClass, count:0};
         filter.count = count;
      }

      flaggedPosts.forEach(function(p)
      {
         // flaggers
         p.flags.forEach(function(f)
         {
            if ( f.flagger )
               addFilter("Users with flags", f.flagger.name, "fn:flagger("+f.flagger.url.match(/-?\d+/)[0]+")");
         });

         // flaggees
         if ( p.author )
            addFilter("Users with flagged posts", p.author.name, "fn:user("+p.author.url.match(/-?\d+/)[0]+")");

         // tags
         p.tags.forEach(function(tag)
         {
               addFilter("Tags", tag, "fn:tag("+tag+")", "post-tag");
         });

         // flag types
         p.flags.forEach(function(f)
         {
            addFilter("Flag types",
               f.flagType=="PostOther" || f.flagType=="CommentOther"
                  ? "Other"
                  : f.description + (f.flagReason ? ' (' + f.flagReason + ')' : ''),
               "fn:type("+f.flagType + (f.flagReason||'') +")");
         });
      });


      // ad-hoc
      addSearchFilter("Low-hanging fruit", "Plagiarism", "plagia|copied.{1,16}from");
      addSearchFilter("Low-hanging fruit", "Dead links", "dead");
      addSearchFilter("Low-hanging fruit", "Owner requests post deletion", "fn:selfflagged()delet");
      addSearchFilter("Low-hanging fruit", "Migration requests", "belongs|moved? to|migrat|better fit|stackexchange");
      addSearchFilter("Low-hanging fruit", "Reopen requests", "fn:isclosed()reopen|not.{1,4}duplicate");
      addSearchFilter("Low-hanging fruit", "Link-only answer", "fn:isanswer()link.?only");
      addSearchFilter("Low-hanging fruit", "Closed", "fn:isclosed()");
      addSearchFilter("Low-hanging fruit", "Deleted", "fn:isdeleted()");
      addSearchFilter("Low-hanging fruit", "Merge requests", "merge");
      addSearchFilter("Low-hanging fruit", "Duplicates", "duplicate:not(':isclosed()'):isquestion()");

      // convert objects to arrays, sort
      return $.map(filters, function(f, cat)
      {
         return {
            category: cat,
            filters: $.map(f, function(filter)
            {
               return filter;
            })
            .sort(function(a,b) { return b.count-a.count; })
         };
      })
      .sort(function(a,b) { return a.filters.length-b.filters.length; });
   }

   function renderFilters(flaggedPosts, container)
   {
      FlagFilter.filters = buildFilters(flaggedPosts);
      container.html(FlagFilter.templates.flagFilter(FlagFilter.filters));
   }

   function unique(arr)
   {
      var check = {};
      return arr.slice()
         .filter(function(el)
         {
            var dup = check[el];
            check[el] = true;
            return !dup;
         });
   }
   
   function dismissAllFilteredFlags(parentContainer, postIdsToDismiss, filter)
   {       
      if ( !filter.length || postIdsToDismiss.length > 200 )
      {
         alert("Too many flags - filter it.")
         return;
      }

      var DoDismiss = function(helpful, declineId, comment)
      {
         if (!postIdsToDismiss.length)
            return;
         
         var flaggedPostId = postIdsToDismiss.pop();
         
         FlagFilter.tools.dismissAllFlags(flaggedPostId, helpful, declineId, comment)
         .then(FlagFilter.tools.makeWait(1000))
         .then(function() 
         { 
            FlagFilter.flaggedPosts = flaggedPosts = FlagFilter.flaggedPosts.filter(f => f.postId != flaggedPostId);
            filterFlags(filter);
            DoDismiss(helpful, declineId, comment)
         });
      };
      
      flagFilter.tools.flagDismissUI(parentContainer).then(function(dismissal)
      {
         if (!confirm("ARE YOU SURE you want to dismiss ALL FLAGS on these " + postIdsToDismiss.length + " posts all at once??"))
            return;
         
         DoDismiss(dismissal.helpful, dismissal.declineId, dismissal.comment);
      });

   }
   
}
   
});