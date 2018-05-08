function fetchAntiPlagiarismStatus($plagiarismStatus) {
    $plagiarismStatus.removeClass('found-level0 found-level1 found-level2');
    
    var url = $plagiarismStatus.data('antiplagiarismUrl');
    var $plagiarismStatusFixedCopy = $plagiarismStatus.clone().addClass('fixed').hide().insertAfter($plagiarismStatus);
    var $codeMirror = $plagiarismStatus.parent().find('.CodeMirror');
    $.getJSON(url, function (data) {
        if (data.status === 'not_checked') {
            $plagiarismStatus.addClass('not-checked');
            $plagiarismStatusFixedCopy.addClass('not-checked');
            $plagiarismStatus.text('Эта задача не проверяется на списывание');
            $plagiarismStatusFixedCopy.text($plagiarismStatus.text());
            return;
        }

        let className = 'found-level' + data.suspicion_level;
        $plagiarismStatus.addClass(className);
        $plagiarismStatusFixedCopy.addClass(className);
        var message = '';
        switch (data.suspicion_level)
        {
            case 0: message = 'похожих решений не найдено'; break;
            case 1:
            case 2:
                var singleNumberMessage = 'у {count} другого студента найдено {very} похожее решение. {link}';
                var pluralNumberMessage = 'у {count} других студентов найдены {very} похожие решения. {link}';
                message = data.suspicious_authors_count === 1 ? singleNumberMessage : pluralNumberMessage;
                break;
        }
        message = message.replace('{count}', data.suspicious_authors_count);
        message = message.replace('{very}', data.suspicion_level === 2 ? '<b>очень</b>' : '');
        message = message.replace('{link}', '<a href="' + $plagiarismStatus.data('antiplagiarismDetailsUrl') + '" target="_blank">Посмотреть</a>');
        
        $plagiarismStatus.html('Проверка на списывание: ' + message);
        $plagiarismStatusFixedCopy.html($plagiarismStatus.html());
    });
    
    var plagiarismStatusOffset = $plagiarismStatus.offset().top;
    var headerHeight = $('#header').outerHeight();    
    var codeMirrorBottom = $codeMirror.offset().top + $codeMirror.outerHeight();
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();

        var isVisible = $plagiarismStatusFixedCopy.is(':visible');
        if (scrollTop >= plagiarismStatusOffset - headerHeight && scrollTop < codeMirrorBottom - 2 * headerHeight) {
            if (! isVisible) {                
                $plagiarismStatusFixedCopy.show();
            }
        }
        else {
            if (isVisible) {
                $plagiarismStatusFixedCopy.hide();
            }
        }
    });
}

/* Extracted from merge addon for codemirror */
var dmp;
function getDiff(a, b, ignoreWhitespace) {
    if (!dmp) dmp = new diff_match_patch();

    var diff = dmp.diff_main(a, b);
    // The library sometimes leaves in empty parts, which confuse the algorithm
    for (var i = 0; i < diff.length; ++i) {
        var part = diff[i];
        if (ignoreWhitespace ? !/[^ \t]/.test(part[1]) : !part[1]) {
            diff.splice(i--, 1);
        } else if (i && diff[i - 1][0] == part[0]) {
            diff.splice(i--, 1);
            diff[i][1] += part[1];
        }
    }
    return diff;
}
/* End of extracted from merge addon for codemirror */

$(document).ready(function () {
    $('.antiplagiarism__data').each(function () {
        var $self = $(this);
        var originalSubmissionId = $self.data('originalSubmissionId');
        var plagiarismSubmissionId = $self.data('plagiarismSubmissionId');

        var $originalSubmission = $('.code[data-submission-id="' + originalSubmissionId + '"]');
        var $plagiarismSubmission = $('.code[data-submission-id="' + plagiarismSubmissionId + '"]');

        var originalCodeMirror = $originalSubmission[0].codeMirrorEditor;
        var plagiarismCodeMirror = $plagiarismSubmission[0].codeMirrorEditor;
        
        var antiplagiarismData = JSON.parse($self[0].innerHTML);       
        var plagiarismData = antiplagiarismData.plagiarism;
        
        /*
        var mergeView = CodeMirror.MergeView($('<div></div>').insertBefore($self)[0], {
            value: $originalSubmission.text(),
            origLeft: null,
            orig: $plagiarismSubmission.text(),
            lineNumbers: true,
            mode: "text/x-csharp",
            highlightDifferences: true,
            connect: "align",
            collapseIdentical: false,

            indentWithTabs: true,
            tabSize: 4,
            indentUnit: 4,
            lineWrapping: true,
            matchBrackets: true,
            styleSelectedText: true,
        });
        */
                
        var originalTokens = getTokensDictionaryByIndex(antiplagiarismData.tokens_positions);
        var plagiarismTokens = getTokensDictionaryByIndex(plagiarismData.tokens_positions);
        
        var originalTokensByLines = getTokensByLines($originalSubmission.text(), antiplagiarismData.tokens_positions);
        var plagiarismTokensByLines = getTokensByLines($plagiarismSubmission.text(), plagiarismData.tokens_positions);
        var bestMatchedLines = findBestMatchedLines(originalTokensByLines, plagiarismTokensByLines, plagiarismData.matched_snippets);
        console.log(bestMatchedLines);
        
        var originalSubmissionLines = $originalSubmission.text().split('\n');
        var plagiarismSubmissionLines = $plagiarismSubmission.text().split('\n');
        originalCodeMirror.operation(function () {
            plagiarismCodeMirror.operation(function () {
                highlightBestMatchedLines(originalCodeMirror, plagiarismCodeMirror, bestMatchedLines, originalSubmissionLines, plagiarismSubmissionLines);    
            });             
        });
        
        /* Setup click handlers */
        originalCodeMirror.on('gutterClick', function (cm, originalLine) {
            var bestMatchedLine = bestMatchedLines[originalLine];
            if (bestMatchedLine === undefined || bestMatchedLine === -1)
                return;
            
            console.log('Scroll to', bestMatchedLine);
            var originalPosition = originalCodeMirror.cursorCoords({ line: originalLine, ch: 1 }, 'local');
            var plagiarismPosition = plagiarismCodeMirror.cursorCoords({ line: bestMatchedLine, ch: 1}, 'local');
            
            var originalMarginTop = 0, plagiarismMarginTop = 0;
            if (originalPosition.top < plagiarismPosition.top)
                originalMarginTop = plagiarismPosition.top - originalPosition.top;
            else
                plagiarismMarginTop = originalPosition.top - plagiarismPosition.top;
            
            $(originalCodeMirror.display.wrapper).animate({'marginTop': originalMarginTop});
            $(plagiarismCodeMirror.display.wrapper).animate({'marginTop': plagiarismMarginTop});
        });
        
        /* Batch all operations as one: see https://codemirror.net/doc/manual.html for details. It's much faster because
         * doesn't need to fully relayout and redraw DOM tree */
        originalCodeMirror.operation(function () {
            highlightNotAnalyzedParts(originalCodeMirror, antiplagiarismData.analyzed_code_units, originalTokens);    
        });
        plagiarismCodeMirror.operation(function() {
            highlightNotAnalyzedParts(plagiarismCodeMirror, plagiarismData.analyzed_code_units, plagiarismTokens);    
        });        
        
        // highlightMatchedTokens(plagiarismData.matched_snippets, originalCodeMirror, plagiarismCodeMirror, originalTokens, plagiarismTokens);
        
    });
    
    /* Returns array result, result[i] contains token indecies which contains in i-th line of input */
    function getTokensByLines(text, tokens) {
        var currentTokenIndex = 0;
        var lineIndex = 0;
        var result = [[]];
        for (var charIndex = 0; charIndex < text.length && currentTokenIndex < tokens.length; charIndex++) {
            var char = text[charIndex];
            if (char === '\n') {
                lineIndex++;
                result.push([]);
                continue;
            }
            if (char === '\r')
                continue;
            
            /* Go to next token if current is finished */
            if (charIndex >= tokens[currentTokenIndex].finish_position)
                currentTokenIndex++;
            
            /* No more tokens in input array */
            if (currentTokenIndex >= tokens.length)
                break;
            
            if (charIndex >= tokens[currentTokenIndex].start_position && charIndex < tokens[currentTokenIndex].finish_position) {
                /* Don't add the same token_index again */
                if (result[lineIndex][result[lineIndex].length - 1] !== tokens[currentTokenIndex].token_index)
                    result[lineIndex].push(tokens[currentTokenIndex].token_index)
            }
        }
        return result;
    }
    
    function findBestMatchedLines(originalTokensByLines, plagiarismTokensByLines, matchedSnippets)
    {
        /* Initialize array N x M by zeros */
        var lineWeights = new Array(originalTokensByLines.length);
        for (var lineId = 0; lineId < originalTokensByLines.length; lineId++) {
            lineWeights[lineId] = new Array(plagiarismTokensByLines.length);
            for (var pLineId = 0; pLineId < plagiarismTokensByLines.length; pLineId++)
                lineWeights[lineId][pLineId] = 0;
        }
        
        var originalLineByTokens = invertArray(originalTokensByLines);
        var plagiarismLineByTokens = invertArray(plagiarismTokensByLines);
        
        $.each(matchedSnippets, function (idx, matchedSnippet) {
            for (var tokenIndex = 0; tokenIndex < matchedSnippet.snippet_tokens_count; ++tokenIndex) {
                var originalTokenIndex = matchedSnippet.original_submission_first_token_index + tokenIndex;
                var plagiarismTokenIndex = matchedSnippet.plagiarism_submission_first_token_index + tokenIndex;
                var originalLine = originalLineByTokens[originalTokenIndex][0];
                var plagiarismLine = plagiarismLineByTokens[plagiarismTokenIndex][0];
                
                lineWeights[originalLine][plagiarismLine]++;
            }                
        });
        
        /* Search best match for each line (or return -1 if several lines has equal weight ) */
        var result = [];
        for (var lineId = 0; lineId < originalTokensByLines.length; lineId++) {
            var bestMatch = -1;
            var bestMatchWeight = 0;
            for (var pLineId = 0; pLineId < plagiarismTokensByLines.length; pLineId++) {
                if (lineWeights[lineId][pLineId] > bestMatchWeight) {
                    bestMatchWeight = lineWeights[lineId][pLineId];
                    bestMatch = pLineId;
                } else if (lineWeights[lineId][pLineId] === bestMatchWeight)
                    bestMatch = -1
            }
            result[lineId] = bestMatch;
        }            
        return result;
    }
    
    function invertArray(array) {
        var result = [];
        $.each(array,  function(id, elems) {
            $.each(elems, function (_, elem) {
                if (! (elem in result))
                    result[elem] = [];
                result[elem].push(id);
            })
        });
        return result;
    }
    
    function highlightBestMatchedLines(originalCodeMirror, plagiarismCodeMirror, bestMatchedLines, originalSubmissionLines, plagiarismSubmissionLines)
    {
        var fullMatchedTextMarkerOptions = {
            className: 'antiplagiarism__full-matched',
            title: 'Эта часть кода совпадает полностью',
        };        
        var notMatchedTextMarkerOptions = {
            className: 'antiplagiarism__not-matched',
            title: '',
        };
        
        $.each(bestMatchedLines, function (lineId, bestMatchedLine) {
            if (bestMatchedLine === -1)
                return;
            var originalLine = originalSubmissionLines[lineId];
            var plagiarismLine = plagiarismSubmissionLines[bestMatchedLine];
            var diff = getDiff(originalLine, plagiarismLine);
            console.log(diff);
            
            /* Each `diff` item is 2-element array: [0, "qwer"] for commont substring,
               [1, "abcd"] for adding and [-1, "zxcv"] for removing substring*/
            var originalCharIndex = 0;
            var plagiarismCharIndex = 0;
            $.each(diff, function(_, diffItem) {
                var diffType = diffItem[0];
                var diffString = diffItem[1];
                if (diffType === 0) {
                    originalCodeMirror.markText({line: lineId, ch: originalCharIndex}, {line: lineId, ch: originalCharIndex + diffString.length}, fullMatchedTextMarkerOptions);
                    plagiarismCodeMirror.markText({line: bestMatchedLine, ch: plagiarismCharIndex}, {line: bestMatchedLine, ch: plagiarismCharIndex + diffString.length}, fullMatchedTextMarkerOptions);
                    originalCharIndex += diffString.length;
                    plagiarismCharIndex += diffString.length;
                } else if (diffType === -1) {
                    originalCodeMirror.markText({line: lineId, ch: originalCharIndex}, {line: lineId, ch: originalCharIndex + diffString.length}, notMatchedTextMarkerOptions);
                    originalCharIndex += diffString.length;
                } else if (diffType === 1) {
                    plagiarismCodeMirror.markText({line: bestMatchedLine, ch: plagiarismCharIndex}, {line: bestMatchedLine, ch: plagiarismCharIndex + diffString.length}, notMatchedTextMarkerOptions);
                    plagiarismCharIndex += diffString.length;
                }
            });
        });
    }

    function getRandomColor() {
        // 30 random hues with step of 12 degrees
        var hue = Math.floor(Math.random() * 30) * 12;

        return $.Color({
            hue: hue,
            saturation: 0.9,
            lightness: 0.9,
            alpha: 0.5
        }).toRgbaString();
    }
    
    function getTokensDictionaryByIndex(tokensPositionsArray) {
        var result = {};
        $.each(tokensPositionsArray, function (idx, tokenInfo) {
            result[tokenInfo.token_index] = tokenInfo;
            result[tokenInfo.token_index].finish_position = tokenInfo.start_position + tokenInfo.length;
        });
        return result;        
    }
    
    function highlightNotAnalyzedParts(codeMirrorEditor, analyzedCodeUnits, tokens) {
        var document = codeMirrorEditor.getDoc();

        var highlightedTokes = [];
        $.each(analyzedCodeUnits, function (idx, codeUnit) {
            var firstTokenIndex = codeUnit.first_token_index;
            var lastTokenIndex = codeUnit.first_token_index + codeUnit.tokens_count - 1;
            for (var tokenIndex = firstTokenIndex; tokenIndex <= lastTokenIndex; tokenIndex++)
                highlightedTokes.push(tokenIndex);
        });
        highlightedTokes.sort(function (a, b) {
            return a - b;
        });
        
        var textMarkerOptions = {
            className: 'antiplagiarism__not-analyzed',
            title: 'Эта часть кода не анализируется на списывание',
        };

        var currentHighlightStart = 0;
        for (var idx = 0; idx < highlightedTokes.length; idx++) {
            if (idx === 0 || highlightedTokes[idx - 1] < highlightedTokes[idx] - 1) {
                var currentHighlightFinish = tokens[highlightedTokes[idx]].start_position;
                if (currentHighlightStart !== currentHighlightFinish) {  
                    document.markText(
                        document.posFromIndex(currentHighlightStart),
                        document.posFromIndex(currentHighlightFinish),
                        textMarkerOptions
                    );
                }
            }
            currentHighlightStart = tokens[highlightedTokes[idx]].finish_position;
        }

        document.markText(document.posFromIndex(currentHighlightStart), document.posFromIndex(1e10), textMarkerOptions);
    }    

    function highlightMatchedTokens(matchedSnippets, originalCodeMirror, plagiarismCodeMirror, originalTokens, plagiarismTokens) {
        /* Batch all operations as one: see https://codemirror.net/doc/manual.html for details */
        originalCodeMirror.operation(function () {
            highlightMatchedTokensInSubmission(matchedSnippets, originalCodeMirror, originalTokens, 'original_submission_first_token_index');    
        });
        plagiarismCodeMirror.operation(function () {
            highlightMatchedTokensInSubmission(matchedSnippets, plagiarismCodeMirror, plagiarismTokens, 'plagiarism_submission_first_token_index');    
        });        
    }
    
    function highlightMatchedTokensInSubmission(matchedSnippets, codeMirrorEditor, tokens, firstTokenIndexSelector) {
        var tokensPlagiarismTypes = {};
        var maxTokenIndex = 0;
        $.each(matchedSnippets, function (idx, matchedSnippet) {
            var snippetType = matchedSnippet.snippet_type;
            for (var tokenIndex = matchedSnippet[firstTokenIndexSelector];
                 tokenIndex < matchedSnippet[firstTokenIndexSelector] + matchedSnippet.snippet_tokens_count;
                 tokenIndex++) {
                var oldValue = tokensPlagiarismTypes[tokenIndex];
                var newValue = snippetType;
                if (oldValue === undefined || (newValue === 'tokensKindsAndValues'))
                    tokensPlagiarismTypes[tokenIndex] = newValue;
                
                if (tokenIndex > maxTokenIndex)
                    maxTokenIndex = tokenIndex;
            }
        });

        var document = codeMirrorEditor.getDoc();
        var currentStart = 0, currentFinish = 0, currentPlagiarismType = '';

        var hightlightCurrentTokensSequence = function() {
            document.markText(
                document.posFromIndex(currentStart),
                document.posFromIndex(currentFinish),
                {
                    className: 'antiplagiarism__plagiarism-token-' + currentPlagiarismType,
                    title: currentPlagiarismType === 'tokensKindsAndValues'
                        ? 'Эта часть кода совпадает полностью' 
                        : 'Эта часть кода подозрительно похожа'
                }
            );
        };
        
        for (var tokenIndex = 0; tokenIndex <= maxTokenIndex; tokenIndex++) {
            if (! (tokenIndex in tokensPlagiarismTypes)) {
                hightlightCurrentTokensSequence();
            } else if (! (tokenIndex - 1 in tokensPlagiarismTypes)) {
                currentStart = tokens[tokenIndex].start_position;
                currentPlagiarismType = tokensPlagiarismTypes[tokenIndex];
            } else if (tokensPlagiarismTypes[tokenIndex] !== tokensPlagiarismTypes[tokenIndex - 1]) {
                hightlightCurrentTokensSequence();
                currentStart = tokens[tokenIndex].start_position;
                currentPlagiarismType = tokensPlagiarismTypes[tokenIndex];
            }
            
            if (tokenIndex in tokensPlagiarismTypes)
                currentFinish = tokens[tokenIndex].finish_position;
        }        

        hightlightCurrentTokensSequence();        
    }
      
    /* Fetching antiplagiarism status */
    $('.antiplagiarism-status').each(function () {
        fetchAntiPlagiarismStatus($(this));
    });
    
    /* Changing submission on panel */
    $('.antiplagiarism__submissions-panel [name="submissionId"]').change(function () {
        var $self = $(this);
        $('.antiplagiarism').hide();
        $('.suspicion-level-description').hide();
        var $form = $self.closest('form');        
        $form.submit();
    });
});