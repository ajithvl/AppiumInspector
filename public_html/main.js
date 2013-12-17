$(document).ready(function() {
//    var screenJson = '{"name":"Avengers","type":"UIAApplication","label":"Avengers","value":null,"rect":{"origin":{"x":0,"y":0},"size":{"width":568,"height":320}},"dom":null,"enabled":true,"valid":true,"visible":true,"children":[{"name":null,"type":"UIAWindow","label":null,"value":null,"rect":{"origin":{"x":0,"y":0},"size":{"width":568,"height":320}},"dom":null,"enabled":true,"valid":true,"visible":true,"children":[{"name":"/Users/ajith/Library/Application Support/iPhone Simulator/7.0.3/Applications/8B0CA816-51CA-4ED7-837E-1E484F5C556B/MarvelAvengers.app/en.lproj/mainloadingscreen.jpg","type":"UIAImage","label":null,"value":null,"rect":{"origin":{"x":0,"y":0},"size":{"width":568,"height":320}},"dom":null,"enabled":true,"valid":true,"visible":false,"children":[]},{"name":"FETCHING META DATA","type":"UIAStaticText","label":"FETCHING META DATA","value":"FETCHING META DATA","rect":{"origin":{"x":146,"y":263},"size":{"width":280,"height":40}},"dom":null,"enabled":true,"valid":true,"visible":true,"children":[]},{"name":"img_loading_progressbar.png","type":"UIAImage","label":null,"value":null,"rect":{"origin":{"x":197,"y":290},"size":{"width":201,"height":10}},"dom":null,"enabled":true,"valid":true,"visible":false,"children":[]},{"name":"img_loading_progressbarFill.png","type":"UIAImage","label":null,"value":null,"rect":{"origin":{"x":197,"y":290},"size":{"width":11.705291748046875,"height":10}},"dom":null,"enabled":true,"valid":true,"visible":false,"children":[]},{"name":"Marvel: Avengers Alliance ? Marvel 2013","type":"UIAStaticText","label":"Marvel: Avengers Alliance ? Marvel 2013","value":"Marvel: Avengers Alliance ? Marvel 2013","rect":{"origin":{"x":179,"y":300},"size":{"width":210,"height":20}},"dom":null,"enabled":true,"valid":true,"visible":true,"children":[]},{"name":"M:48.75 FPS:0 ID:(null) (-1)","type":"UIAStaticText","label":"M:48.75 FPS:0 ID:(null) (-1)","value":"M:48.75 FPS:0 ID:(null) (-1)","rect":{"origin":{"x":0,"y":260},"size":{"width":140,"height":30}},"dom":null,"enabled":true,"valid":true,"visible":true,"children":[]}]},{"name":null,"type":"UIAWindow","label":null,"value":null,"rect":{"origin":{"x":0,"y":-248},"size":{"width":320,"height":568}},"dom":null,"enabled":true,"valid":true,"visible":false,"children":[{"name":null,"type":"UIAStatusBar","label":null,"value":null,"rect":{"origin":{"x":0,"y":0},"size":{"width":568,"height":0}},"dom":null,"enabled":true,"valid":true,"visible":false,"children":[]}]}]}';
//    drawElements($.parseJSON(screenJson), $("#elementsContainer"), 0, 0, "");
    $("#fetchButton").click(renderPage);
    $("#screen").mousemove(updateCoordinates);
});

function updateCoordinates() {
    $("#mouseX").val(event.pageX - $('#screen').offset().left);
    $("#mouseY").val(event.pageY - $('#screen').offset().top);
}

function renderPage() {
    getPageSource();
    getScreenshot();
}

function setDimentions(w, h) {
    $("#screen").css("width", w);
    $("#screen").css("height", h);
    if($("#orientation").val() === "portrait") {
        console.log("Setting orientation to portrait mode");
        $("#screenImage").css("width", w);
        $("#screenImage").css("height", h);
        $("#screenImage").css("transform", "");
        $("#screenImage").css("-ms-transform", "");
        $("#screenImage").css("-webkit-transform", "");
    } else {
        console.log("Setting orientation to landscape mode");
        $("#screenImage").css("width", h);
        $("#screenImage").css("height", w);
        $("#screenImage").css("transform", "rotate(-90deg)");
        $("#screenImage").css("-ms-transform", "rotate(-90deg)");
        $("#screenImage").css("-webkit-transform", "rotate(-90deg)");
    }
}

function getPageSource() {
    var url = "http://" + $("#ip").val() + ":" + $("#port").val() + "/wd/hub/session/" + $("#session").val() + "/source";
    console.log("Fetching source from ", url);
    $.getJSON(url, function(data) {
        console.log("Get source request returned response: ", data.status);
        if (data.status === 0) {
            drawElements($.parseJSON(data.value), $("#elementsContainer"), 0, 0, "//", 1, "");
            setDimentions($.parseJSON(data.value).rect.size.width, $.parseJSON(data.value).rect.size.height);
        } else {
            alert("Failed to get source")
        }
    });
}

function getScreenshot() {
    var url = "http://" + $("#ip").val() + ":" + $("#port").val() + "/wd/hub/session/" + $("#session").val() + "/screenshot";
    console.log("Fetching screenshot from ", url);
    $.getJSON(url, function(data) {
        console.log("Screenshot returned response: ", data.status);
        if (data.status === 0) {
            console.log("Setting new screen");
            $("#screenImage").attr("src", "data:image/png;base64, " + data.value);
        } else {
            alert("Failed to get screenshot")
        }
    });
}


function drawElements(j, e, depth, index, path, elementCount, prefix) {
    
//    $("#screen").append('<div class="elements" style="position: absolute; left: 0px; top: 0px; width: 200px; height: 100px"></div>');
    var parentId = "";
    if (e.attr("id") !== "elementsContainer") {
        parentId = e.attr("id").replace("item", "").replace("", "");
    }

    if (j.type !== "UIAApplication") {
        path = path + j.type + "[" + elementCount + "]/";
    }
    
    var id = parentId + depth + "" + index;
    // Add div overlay on the image
    $("#screen").append(createElementOutline(j, id));

    // Add element to the element list
    var elementItem = createElementItem(j, id, path, prefix);
    e.append(elementItem);

    var elementMap = {};
    for (var i = 0; i < j.children.length; i++) {
        // Increment count in xpath based on element type
        if(elementMap[j.children[i].type]) {
            elementMap[j.children[i].type] ++;
        } else {
            elementMap[j.children[i].type] = 1;
        }
//        console.log("Processed element [" + j.type + "], now looking for [" + j.children[i].type + "] = [" + elementMap[j.children[i].type] +  "]");
        drawElements(j.children[i], elementItem, depth + 1, i, path, elementMap[j.children[i].type], prefix + "---");
    }

}


function createElementOutline(j, id) {
    var elementOutline = $('<div id="outline' + id + '" class="elements"></div>');
    elementOutline.css("position", "absolute");
    elementOutline.css("left", j.rect.origin.x);
    elementOutline.css("top", j.rect.origin.y);
    elementOutline.css("width", j.rect.size.width);
    elementOutline.css("height", j.rect.size.height);
//    elementOutline.css("background-color", "green");
//    elementOutline.css("opacity", "0.4");
//    elementOutline.mouseover(function(event) {
//        event.stopPropagation();
//        // Clear style
//        $(".elements").css("background-color", "");
//        // Apply style
//        $("#outline" + id).css("background-color", "green");
//        $("#outline" + id).css("opacity", "0.6");
//        
//    });
    return elementOutline;
}

function createElementItem(j, id, path, prefix) {
    var elementOutline = $('<div id="outline' + id + '" class="elements"></div>');
    elementOutline.css("position", "absolute");
    elementOutline.css("left", j.rect.origin.x);
    elementOutline.css("top", j.rect.origin.y);
    elementOutline.css("width", j.rect.size.width);
    elementOutline.css("height", j.rect.size.height);
    $("#screen").append(elementOutline);

    // Add element to the element list
    var elementItem = $('<div id="item' + id + '">' + prefix + '<a href="#">' + j.type + '(' + j.name + ')' + '</a></div>');

    elementItem.data("name", j.name);
    elementItem.data("type", j.type);
    elementItem.data("value", j.value);
    elementItem.data("label", j.label);
    elementItem.data("enabled", j.enabled);
    elementItem.data("visible", j.visible);
    elementItem.data("valid", j.valid);
    elementItem.data("location", "{" + j.rect.origin.x + ", " + j.rect.origin.y + "}");
    elementItem.data("size", "{" + j.rect.size.width + ", " + j.rect.size.height + "}");
    elementItem.data("scale", null);
    elementItem.data("rotation", null);
    elementItem.data("skew", null);
    elementItem.data("anchor", null);
    elementItem.data("xpath", path);

    elementItem.mouseover(function(event) {
        event.stopPropagation();
        // Clear fields
        $(".propertyValueFull").val("");
        $(".propertyValueHalf").val("");
        // Clear style
        $(".elements").css("background-color", "");
        // Apply style
        $("#outline" + id).css("background-color", "green");
        $("#outline" + id).css("opacity", "0.6");
        $("#property_value_name").val(j.name);
        $("#property_value_type").val(j.type);
        $("#property_value_value").val(j.value);
        $("#property_value_label").val(j.label);
        $("#property_value_enabled").val(j.enabled);
        $("#property_value_visible").val(j.visible);
        $("#property_value_valid").val(j.valid);
        $("#property_value_location").val("{" + j.rect.origin.x + ", " + j.rect.origin.y + "}");
        $("#property_value_size").val("{" + Math.round(j.rect.size.width * 100) / 100 + ", " + Math.round(j.rect.size.height * 100) / 100 + "}");
        $("#property_value_scale").val(null);
        $("#property_value_rotation").val(null);
        $("#property_value_skew").val(null);
        $("#property_value_anchor").val(null);
        $("#property_value_xpath").val(path.replace(/UIA/g, "").slice(0, -1).toLowerCase());
    });
    return elementItem;
}


