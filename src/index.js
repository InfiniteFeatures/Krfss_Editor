const angluar = require("angular");
const path = require("path");
const fs = require("fs");
const assetsIO = require("./assetsIO.js");
$ = require("jquery");

const app = angular.module("kte", []);
app.controller("init", [
    "$scope",
    "$sce",
    function($scope, $sce) {
        // Handler
        $scope.openHandler = filename => {
            console.log(filename);
            const asset = new assetsIO(filename);
            if (asset.inited) {
                $scope.saveHandler();
                $scope.asset = asset;
            }
            $("#item_container").animate(
                {
                    scrollTop: 0
                },
                "slow"
            );
            $scope.holder.modified = false;
            $scope.$digest();
        };
        $scope.saveHandler = () => {
            if ($scope.asset.inited) {
                $scope.asset.write();
                $scope.holder.modified = false;
            }
            $scope.$digest();
        };
        $scope.textChange = () => {
            $scope.holder.modified = true;
        };

        // Calculated
        $scope.escape = str => {
            return $sce.trustAsHtml(
                str.replace(/(\$[^$]*\$)/g, function(match) {
                    return (
                        "<span class='pink'>" + match.slice(1, -1) + "</span>"
                    );
                })
            );
        };
        $scope.check = item => {
            lines = item.split("\n");
            if (lines.length > 3) return true;
            return false;
        };
        $scope.is3lines = item => {
            lines = item.split("\n");
            if (lines.length == 3) return true;
            return false;
        };

        // Variables
        $scope.title = "KiraFan AutoSub Subtitle Editor";
        $scope.holder = {
            msg: "Draw krfss file here to open",
            modified: false
        };
        $scope.asset = {
            filename: "",
            inited: false,
            nmtgimg_src: () => "",
            textimg_src: () => ""
        };

        window.onbeforeunload = event => {
            $scope.saveHandler();
            return;
        };
    }
]);

$(document).on({
    dragleave: function(e) {
        e.preventDefault();
    },
    drop: function(e) {
        e.preventDefault();
    },
    dragenter: function(e) {
        e.preventDefault();
    },
    dragover: function(e) {
        e.preventDefault();
    }
});

$("#holder").on({
    dragleave: function(e) {
        e.preventDefault();
        $("#holder").removeClass("holder_ondrag");
    },
    drop: function(e) {
        e.preventDefault();
        $("#holder").removeClass("holder_ondrag");
        const efile = e.originalEvent.dataTransfer.files[0];
        angular
            .element(body)
            .scope()
            .openHandler(efile.path);
    },
    dragenter: function(e) {
        e.preventDefault();
        $("#holder").addClass("holder_ondrag");
    },
    click: function(e) {
        angular
            .element(body)
            .scope()
            .saveHandler();
    }
});
