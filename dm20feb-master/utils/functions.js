var sanitizeHtml = require('sanitize-html');

var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    +
    '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    +
    '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' +
    '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    +
    '|/?[a-z]' +
    tagBody +
    ')>',
    'gi');

exports.removeTags = (html) => {
    var oldHtml;
    do {
        oldHtml = html;
        html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
}

var SH_options = {
    allowedTags: [],
    disallowedTagsMode: 'discard',
    
};

exports.sanitizeHtml = (html) => {
    return sanitizeHtml(html, SH_options);
}