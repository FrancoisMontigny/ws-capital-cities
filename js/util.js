var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function rechercher(capitalsWithCountries, capitals, countries, capitalUrls) {
    var capital = $('#recherche').val();
    var index = capitalsWithCountries.indexOf(capital);
    if (index < 0) {
        index = capitals.indexOf(capital);
    }
    if (index < 0) {
        index = countries.indexOf(capital);
    }

    if (index < 0) {
        var newUrl = './search.html?search=' + capital;
        window.location = newUrl;
    } else {

        var capitalUrl = capitalUrls[index];

        var newUrl = './capital.html?capitalUrl=' + capitalUrl;
        window.location = newUrl;
    }
};

function readTextFile(filename, callback) {
    $.get(filename, function(data) {
        callback(data);
    }, 'text');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function request(filename, fieldId, capital, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%CAPITAL_URL%', '"' + capital + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                $(fieldId).html(result);
            } else {
                $(fieldId).parent().hide();
                $(fieldId).text("UNDEFINED");
            }
        });
    });
}

function requestSpotlight(filename, fieldId, capital, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%CAPITAL_URL%', '"' + capital + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                spotlight(result, function(newResult) {
                    $(fieldId).html(newResult);
                });
            } else {
                $(fieldId).parent().hide();
                $(fieldId).text("UNDEFINED");
            }
        });
    });
}

function requestLink(filename, fieldId, capital, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%CAPITAL_URL%', '"' + capital + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                $(fieldId).attr("href", result);
            } else {
                $(fieldId).parent().parent().hide();
            }
        });
    });
}

function requestImage(filename, fieldId, capital, format) {
    readTextFile(filename, function(req) {
        req = req.replace('%CAPITAL_URL%', '"' + capital + '"');
        var reqUrl = 'http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='+ encodeURIComponent(req) +'&format=json';
        $.getJSON(reqUrl+"&callback=?", function(resultatsReq) {
            var first = result = resultatsReq.results.bindings[0];
            if (first !== undefined && first !== null) {
                var result = format(first);
                $(fieldId).attr("src", result);
            } else {
                $(fieldId).parent().hide();
                $(fieldId).attr("alt", "Pas d'image trouvée");
            }
        });
    });
}

function spotlight(abstract, callback) {
    var url = "https://api.dbpedia-spotlight.org/en/annotate?text=" + encodeURIComponent(abstract) + "&confidence=0.9";
    $.get(url, function(result) {
        var index1 = result.indexOf("<div>") + 5;
        var index2 = result.indexOf("</div>");
        var newAbstract = result.substring(index1, index2);
        callback(newAbstract);
    });
}