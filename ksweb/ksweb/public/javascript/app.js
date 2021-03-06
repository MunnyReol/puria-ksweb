Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});

var KS = (function() {
    var _entityRegex = /(\\)?#{([^\W]+)\b}/g;
    var _answerRegex = /(\\)?@{([^\W]+)\b}/g;

    var ajax = function(url, params, callback, fail) {
        $.ajax({
            type: 'POST',
            url: url,
            data: params,
            dataType: "json",
            processData: false,
            contentType: 'application/json'
        })
        .done(callback)
        .fail(function(jqXHR) {
              console.error('FAILED call for', url, jqXHR.responseText);
              if (typeof fail === 'function') {
                  fail(jqXHR);
              }
        });
    }

    var getTitle = function(id) {
        return $(`#${id} > span`).text()
    }

    let getMDConverter = function() {
        var showdownExtensions = [
            {
                type: 'lang',
                regex: _entityRegex,
                replace: function (match, leadingSlash, entity) {
                    if (leadingSlash === '\\') {
                        return match;
                    } else {
                        var id = match.split(/([_\W])/)[4]
                        var title = getTitle(id)
                        var cls = (title) ? "badge-primary" : "badge-warning"
                        return `<span class="badge badge-pill ${cls} entity"><a target="_blank" class="text-white" href="/entity/${id}">${title||id}</a></span>`;
                    }
                }
            },
            {
                type: 'lang',
                regex: '\\\\@',
                replace: '@'
            },
            {
                type: 'lang',
                regex: _answerRegex,
                replace: function (match, leadingSlash, entity) {
                    if (leadingSlash === '\\') {
                        return match;
                    } else {
                        var id = match.split(/([_\W])/)[4]
                        var title = getTitle(id)
                        var cls = (title) ? "badge-success" : "badge-danger"
                        console.log(id)
                        return `<span class="badge badge-pill ${cls} entity"><a target="_blank" class="text-white" href="/entity/${id}">${title||id}</a></span>`;
                    }
                }
            },

        ];

        return new showdown.Converter({
            emoji: true,
            table: true,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true,
            tables: true,
            tasklists: true,
            simpleLineBreaks: true,
            extensions: showdownExtensions,
        });
    }

    var editor = function(element) {
        return new SimpleMDE({ 
            element: element,
            renderingConfig: {
                singleLineBreaks: true
            },
            spellChecker: false,
            previewRender: function(text) {
                return getMDConverter().makeHtml(text);
            },
        });
    }

    var addOutputToEditor = function(id, editor) {
        editor.codemirror.replaceSelection(`#{${id}}`)
    }

    var addAnswerToEditor = function (id, editor) {
        editor.codemirror.replaceSelection(`@{${id}}`)
    }

    var getEntitiesList = function(text) {
        return text.match(_entityRegex) || []
    }

    var printDocument = function(css, title, body) {
        var mywindow = window.open('', '_blank');
        mywindow.document.write(`<html><head><link rel="stylesheet" href="${css}" type="text/css" /><title>${title}</title>`);
        mywindow.document.write('</head><body >');
        mywindow.document.write(`<div class="text-left">${title}</div>`);
        mywindow.document.write(body);
        mywindow.document.write('</body></html>');
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.onload = function () {
            var self = this;
            self.print();
            self.close();
        };
    }

    return {
        ajax: ajax,
        editor: editor,
        getEntitiesList: getEntitiesList,
        addOutputToEditor: addOutputToEditor,
        addAnswerToEditor: addAnswerToEditor,
        getTitle: getTitle,
        getMDConverter: getMDConverter,
        printDocument: printDocument,
    }
})();