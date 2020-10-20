const _angular = require("angular");
const path = require("path");
const fs = require("fs");
const assetsIO = require("./assetsIO.js");
$ = require("jquery");

var str = {
    X: "X - Textbox invisible",
    T: "T - Textbox visible",
    N: "N - Nametag position changed",
    S: "S - Line start",
    E: "E - Line end",
    C: "C - Text clear",
    O: "O - End"
};

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
        $scope.deleteHandler = (index) => {
            if ($scope.asset.inited) {
                $scope.asset.deleteTag(index);
                $scope.textChange();
            }
        };
        $scope.textChange = () => {
            $scope.holder.modified = true;
        };
        $scope.frameChange = () => {
            $scope.asset.sortTS();
            $scope.textChange();
        };

        // Calculated
        $scope.concat = (trans, indices) => {
            const _escape = str => {
                return str.replace(/(\$[^$]*\$)/g, function(match) {
                    return (
                        "<span class='pink'>" + match.slice(1, -1) + "</span>"
                    );
                });
            };
            const _grayscale = str => {
                return (
                    "<span class='gray'>" +
                    str.replace(/(\$[^$]*\$)/g, function(match) {
                        return (
                            "<span class='pink'>" +
                            match.slice(1, -1) +
                            "</span>"
                        );
                    }) +
                    "</span>"
                );
            };
            var ret = "";
            for (var ii in indices) {
                const index = indices[ii];
                const str = trans[index];
                ret +=
                    parseInt(ii) + 1 == indices.length
                        ? _escape(str)
                        : _grayscale(str);
            }
            return $sce.trustAsHtml(ret);
        };
        $scope.numlines = (trans, indices) => {
            var item = "";
            for (var ii in indices) {
                const index = indices[ii];
                const str = trans[index];
                item += str;
            }
            lines = item.split("\n");
            return lines.length;
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
        $scope.options = {
            adv: true
        };
        $scope.strings = str;

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

$('#item_container').on('scroll', function(e){ 
    var $el = $('.fixedElement'); 
    var isPositionFixed = $el.hasClass('lock');
    if ($(this).scrollTop() > 120 && !isPositionFixed){ 
        $el.addClass('lock'); 
    }
    if ($(this).scrollTop() < 120 && isPositionFixed){
        $el.removeClass('lock');
    } 
});
