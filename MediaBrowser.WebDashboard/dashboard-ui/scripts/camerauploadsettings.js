define(["appSettings", "loading", "emby-checkbox"], function(appSettings, loading) {
    "use strict";

    function loadForm(page, user) {
        var uploadServers = appSettings.cameraUploadServers();
        page.querySelector(".uploadServerList").innerHTML = ConnectionManager.getSavedServers().map(function(s) {
            return '<label><input type="checkbox" is="emby-checkbox"' + (-1 == uploadServers.indexOf(s.Id) ? "" : " checked") + ' class="chkUploadServer" data-id="' + s.Id + '"/><span>' + s.Name + "</span></label>"
        }).join(""), loading.hide()
    }

    function saveUser(page) {
        for (var chkUploadServer = page.querySelectorAll(".chkUploadServer"), cameraUploadServers = [], i = 0, length = chkUploadServer.length; i < length; i++) chkUploadServer[i].checked && cameraUploadServers.push(chkUploadServer[i].getAttribute("data-id"));
        appSettings.cameraUploadServers(cameraUploadServers), window.MainActivity && MainActivity.authorizeStorage(), loading.hide()
    }
    return function(view, params) {
        view.querySelector("form").addEventListener("submit", function(e) {
            return loading.show(), saveUser(view), e.preventDefault(), !1
        }), view.addEventListener("viewshow", function() {
            var page = this;
            loading.show();
            var userId = params.userId || Dashboard.getCurrentUserId();
            ApiClient.getUser(userId).then(function(user) {
                loadForm(page, user)
            })
        }), view.addEventListener("viewbeforehide", function() {
            saveUser(this)
        })
    }
});