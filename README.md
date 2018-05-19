A small collection of tools for handling flags.

## Installation

To use these scripts, have a current version of Chrome or Firefox (other browsers are untested but may work) with a current version of a userscript manager - generally [Tampermonkey](https://tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/get-it/). Install the script by viewing the raw file linked below for the userscript on the GitHub Project page. 

- [FlagFilter.user.js](../../raw/master/FlagFilter.user.js)
- [MonicasFlagToC.user.js](../../raw/master/MonicasFlagToC.user.js)

These userscripts are also compatible with Firefox for Android if using a script manager and the full site page view.

---

# Flag Filter

Install: [FlagFilter.user.js](../../raw/master/FlagFilter.user.js)

Adds a sortable, filterable list of flags to the moderator dashboard

![screenshot](https://i.stack.imgur.com/bzUOj.png)

## Filter expression syntax

Filter can be a regular expression to match on the text of the flag, and/or a combination of the following operators:

- `:isquestion()` - limit results to questions
- `:isanswer()` - limit results to answers
- `:isdeleted()` - limit results to deleted posts
- `:isclosed()` - limit results to closed posts
- `:isanswered()` - limit results to questions with accepted answers
- `:isaccepted()` - limit results to accepted answers
- `:user(userId)` - limit results to posts owned by the user identified by `userId`
- `:tag(tagName)` - limit results to posts tagged with `tagName`
- `:flagger(userId)` - limit results to posts flagged by a user identified by `userId`
- `:type(flagType)` - limit results to posts with a flag of `flagType`
- `:selfflagged()` - limit results to posts with a flag raised by the author
- `:not(filterExpression)` - limit results to posts that do not match `filterExpression`

Operators always combine; results must match ALL operators *and* any expressions in filter. See examples in the "Low-hanging fruit" sidebar.

---

# Flag ToC - Monica's Table-of-Contents prototype

Install: [MonicasFlagToC.user.js](../../raw/master/MonicasFlagToC.user.js)

Flag ToC is a Stack Exchange moderator userscript designed to simplify the moderation process (particularly in the case of high-volume flag sites) by moving flags to sit inline on the posts and comments they relate to on the page rather than being restricted to the bottom-locked flag overlay (The "Waffle Bar").

## Table-of-Contents

- [Getting Started](#getting-started)
- [Overview](#overview)
  - [Compatible Moderator Userscripts](#compatible-scripts) 
- [The new Waffle Bar](#new-waffle)
- [Inline flagging - Active flags](#active-flags)
  - [Post flags](#post-active)
  - [Comment flags](#comment-active)
- [Inline flagging - Resolved flags](#resolved-flags)
  - [Post flags](#post-resolved)
  - [Comment flags](#comment-resolved)
- [Acknowledgements](#acknowledgements)

<a id="getting-started"></a> 
## Getting Started

This script will only work for diamond moderators or staff of the Stack Exchange Network on those sites where they have diamonds. The information below is based on the moderator view. Some details may vary in a minor way for staff users.

### Compatible Moderator Userscripts

This is a brief list of Moderator Userscripts that are known to be usable (or not) in conjunction with Flag ToC on the question page. Userscript links below are to RAW install files.

#### Compatible:
- [animuson](https://github.com/animuson)'s [Stack Exchange Moderator Tools Improved (SEMTI)](https://github.com/animuson/se-mod-tools-improved/raw/master/better-mod-tools.user.js).
- [ArtOfCode](https://github.com/ArtOfCode-)'s [Move SE Mod Info](https://github.com/ArtOfCode-/Userscripts/raw/master/stackexchange/mod/move_mod_info.user.js)


#### Incompatible:
- ArtOfCode's [Show Comment Flagger](https://github.com/ArtOfCode-/Userscripts/raw/master/stackexchange/mod/comment_flagger.user.js) userscript is not compatible with Flag ToC, so having it will not reveal who flagged comments on the question page while Flag ToC is active. Flagger usernames can still be viewed on the flags dashboard or by temporarily disabling Flag ToC. Both userscripts can be active simultaneously without causing any errors.

<a id="overview"></a> 
## Overview

Flag ToC works by moving the flag content from the vertically-scrolling Waffle Bar directly onto the page with the Waffle Bar becoming a table-of-contents listing all posts (identified by post type and username) with active flags and type of flag. While the native Waffle Bar is useful on questions with few flags, the more flags that exist on a Q&A thread, the more real estate the bar takes up, and the more searching a moderator has to do to match up the flag with the flagged post or comment and see it in context. 

When it comes to comments, the content is duplicated, as the comment text appears both on the page and in the Waffle Bar. On sites with huge volumes of comment flags, this makes for a lot of scrolling inside the Waffle Bar to review the flags and it's still often necessary (or at least helpful) to see them in context with the rest of the (unflagged) comments.

Compare: the two images below are the native view and Flag ToC view of the same post with many flags:

The native view of a question with lots of flags:

[![Native flagging view][10]][10]

This is a huge mess. 

- Over half the page (on this small monitor) is taken up by the Waffle Bar, so little of the actual post is viewable.
- There's no indication of how many flags there are on how many posts, only the really long scroll bar indicating that there are many.
- The comments are still collapsed, so the first comment on the question that's flagged is invisible and lacking context.
- Minimizing the bar to see more of the page hides *all* of the flag information, making it impossible to know which posts and comments have been flagged. When the bar is expanded, in order to get context, each post or comment link goes directly to the flagged post or comment.

The same question with the Flag ToC userscript active, same volume of flags:

[![Flag ToC view][11]][11]

- The table-of-contents is a fraction of the size and shows *all* of the 30 active flags and flag reasons on five posts simultaneously, starting with the question.
- The question is clearly marked as having been flagged and why. The shaded area with the colorful sidebar draws attention. Each post and comments section lists the number of active and resolved flags.
- Comments are expanded by default and marked similarly to the post. A colorful bar drawing attention to the flagged comment with a shaded area holding the flag reason.
- All comments (even unflagged ones) are deleted by clicking the word "delete" rather than a small x button. This gives a bigger target for clicking and disambiguates between dismissing the flag and deleting the comment (not shown, see [comments section](#comment-active) below).
- The bar can be easily ignored without collapsing and the flags seen by scrolling through the page, if the flags are difficult to find, flag links are anchored to the relevant post or comments section; post flags link to the top of the post, comment flags link to the top of that post's comment section.

<a id="new-waffle"></a> 
## The new Waffle Bar

The improved Waffle Bar has a table-of-contents style view. Instead of listing each flag separately, all of the flag *types* on each post are listed in a single box with a number indicating how many flags of that type are active on that post - it's worth noting particularly when dealing with comment flags that the number counts *flags* on comments, not number of comments flagged. The number of boxes per row varies based on the page width. Boxes in excess of what the page width allows are pushed to additional rows as needed.

[![Seventeen simultaneously flagged posts in the Waffle Bar][1]][1]

When the heights of the boxes are different, they automatically space themselves to reduce vertical area.

Active flags are noted in colored text (depending on site theme), resolved flags in grey. To save space, if there are both active and resolved flags of the same type (e.g. comment flags), only the active ones will appear in the Waffle Bar with the number indicating the quantity of active flags. Custom moderator flags will appear individually.

As with the native version of the Waffle Bar, the new implementation only appears on pages with active flags or when the last flag was just handled and the page has not yet been refreshed. This allows easy movement between posts with active flags by using the grey arrows in either upper corner of the bar. 

To remove the Waffle Bar, hit the "close" button in the upper right corner or, if there are no remaining active flags, refresh the page.

<a id="active-flags"></a> 
## Inline flagging - Active flags

Inline flagging allows moderators to see the flags directly in context of the post or comment that was flagged. It's no longer necessary to find where on the page the flag is; it's directly below the post or comment.

<a id="post-active"></a> 
### Post flags

Both active and resolved flags appear expanded on posts when there is at least one active flag on the post. This makes it possible to notice the flags when scanning the page, something that is impossible with the native view.

[![flag banner with both active and resolved post flags][2]][2]

Active flags are in dark text; resolved flags are greyed out. 

If the post only has one active flag (or if the same resolution can be used for all active flags), the primary "Helpful..." or "Decline..." buttons can be used to handle the flag. 

- "Helpful..." results in an optional feedback text field and a button that reads "mark helpful".  
[!["Helpful..." flagging menu][4]][4]

- "Decline..." results in the four standard decline reason options in click boxes or the option of entering custom text. Flag ToC will save the last-used custom decline reason and add it to the list of options until replaced by another custom reason (in this case, "This is a dumb autoflag. Shoo!)"  
[!["Decline..." flag menu.][5]][5]

In both cases, there is a character count to indicate the minimum 10 character count (for decline only) and how close to the 200 character max the response is. Note, the text field will not allow more than 200 characters to be typed in and will crop off any pasted text at 200 characters.

If the post has multiple active flags and they should not be handled in the same way or they need different feedback, hovering over the active flags will reveal a small x bearing the hover text "dismiss this flag as helpful or declined". Clicking on the x for the a flag opens a sub-option of "Helpful..." and "Decline..." that will handle that flag only. Clicking on these reveals the same options as above.

[![flag banner showing Sub-options for handling one flag at a time][3]][3]

<a id="comment-active"></a> 
### Comment flags

When viewing a post with comment flags, the entire comments section on the post will be expanded, revealing all of the non-deleted comments, making it easy to see the full context of the comment thread and all of the flagged comments. There is a banner at the top of the comments section with a summary of the number of active and resolved flags.

[![Active comments banner with active and resolved flags][6]][6]

Clicking the colored link text (in the image above "2 active comment flags") will reveal all deleted comments and the resolved comment flags. Viewing deleted comments by clicking "[n] deleted" will not reveal which deleted comments bear resolved flags ([see below](#comment-resolved) for more information about resolved comment flags). Remember, the number of comment flags will not necessarily indicate the number of flagged comments. If comments have multiple flags, the numbers will be different.

Comments with active flags will be marked with a colored bar on the left side of the comment, while comments with resolved flags will be marked with a grey bar.

Each flagged comment will have a grey bar beneath it with the flag reason. On hover, the options will appear to "dismiss flags" (far left) or "delete" the comment (far right). The latter will automatically mark the flag as "helpful". If the comment should be deleted but the flag reason is incorrect, it's recommended to dismiss the flag before deleting the comment.

[![Three flagged comments, one showing options revealed on hover][7]][7]

If a comment has more than one type of flag, each flag will appear in a separate row. As with the existing view, it's not possible to dismiss a single flag reason on a comment. It's necessary to either dismiss all flags or mark all as helpful.

[![Comment with multiple flags, one no longer needed, one custom][8]][8]

Unlike post flags, comment flags will not name who flagged the comment. They will, however, indicate how many flags there are in a subtle way - a comma will appear for each flag in excess of one. 

[![Comment flagged multiple times][9]][9]

<a id="resolved-flags"></a> 
## Inline flagging - Resolved flags

When all flags on a Q&A thread have been resolved, viewing the page will not show the Waffle Bar and viewing resolved flags on a post will not cause it to appear. If a thread has an active flag on one post and resolved flags on others, viewing resolved flags will cause the flags to populate in the Waffle Bar if it's open.

When there are many deleted comments on a post, clicking "[n] resolved flags" will cause the page to jump so that the comments section appears at the top of the page. If there are also resolved post flags, it may be possible to not notice them without scrolling up. If there are only post flags, the page does not jump.

<a id="post-resolved"></a> 
### Post flags

Resolved post flags view is pretty much identical to the active flags view other than the color of the sidebar being greyed out and the addition of the date stamp and username of the moderator who handled the flag (or "Community" in cases of sufficient flagging).

<a id="comment-resolved"></a> 
### Comment flags

Viewing resolved comment flags will reveal *all* deleted comments on the post, not only the comments that were flagged. This applies whether the comments are deleted or not. Either way, the flaged comment will be marked with a vertical grey sidebar on the left side of the comment and the shaded area containing the flag reason and timestamp for when the comment was flagged along with whether the flag was marked "helpful" or "declined" and the name of the moderator who resolved the flag. In the case of sufficient flags from users, the flag handling will be attributed to "Community". 

[![Deleted comments that were flagged][12]][12]

Multiple flags on one comment will show multiple timestamps. As with most timestamps, it's possible to hover to see the precise date and time the flag was cast or resolved.



<a id="acknowledgements"></a> 
## Acknowledgements

This project is possible due to the work and ideas of others.

The inline flag prototype was a never-completed project conceived and designed by [Jin](https://meta.stackexchange.com/users/147574/jin) and [Jarrod](https://meta.stackexchange.com/users/3/jarrod-dixon) in 2014. It was great as-is but it needed a solution for the difficulty of actually *finding* the flags on a very long page of full answers.

The idea of converting the Waffle Bar (which had been originally designed by [waffles](https://meta.stackoverflow.com/users/17174/sam-saffron)) into the table-of-contents view came from [Monica Cellio](https://meta.stackexchange.com/users/162102/monica-cellio) when discussing improving the moderator post interface in early 2018.

The combination of the two was a perfect match.


  [10]: https://i.stack.imgur.com/9mKkg.png
  [11]: https://i.stack.imgur.com/r8wAR.png
  [1]: https://i.stack.imgur.com/JU4tv.png
  [2]: https://i.stack.imgur.com/m29bL.png
  [3]: https://i.stack.imgur.com/Mappa.png
  [4]: https://i.stack.imgur.com/g18v8.png
  [5]: https://i.stack.imgur.com/VshpD.png
  [6]: https://i.stack.imgur.com/wAkFJ.png
  [7]: https://i.stack.imgur.com/GbKtH.png
  [8]: https://i.stack.imgur.com/P73gk.png
  [9]: https://i.stack.imgur.com/bB920.png
  [12]: https://i.stack.imgur.com/3p5HM.png
