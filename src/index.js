const _angular = require("angular");
const _uibs = require('angular-ui-bootstrap');
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

const app = angular.module("kte", ['ui.bootstrap']);
app.controller("init", [
    "$scope",
    "$sce",
    "$uibModal",
    function($scope, $sce, $uibModal) {
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
        $scope.insertHandler = (index, type, before) => {
            if ($scope.asset.inited) {
                $scope.asset.insertTag(index, type, before);
                $scope.textChange();
            }
        };
        $scope.addLineHandler = (index) => {
            if ($scope.asset.inited) {
                $scope.asset.addLine(index);
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
        $scope.concat = (index) => {
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
            indices = $scope.asset.parse_inline_concat(index);
            var ret = "";
            for (var ii in indices) {
                const index = indices[ii];
                const str = $scope.asset.data.trans[index];
                ret +=
                    parseInt(ii) + 1 === indices.length
                        ? _escape(str)
                        : _grayscale(str);
            }
            return $sce.trustAsHtml(ret);
        };
        $scope.numlines = (index) => {
            indices = $scope.asset.parse_inline_concat(index);
            var item = "";
            for (var ii in indices) {
                const index = indices[ii];
                const str = $scope.asset.data.trans[index];
                item += str;
            }
            lines = item.split("\n");
            return lines.length;
        };

        //modal
        $scope.openModal = (index, before, size) => {
            $scope.tempAddIndex = index;
            $scope.tempAddBefore = before;
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'ModalContent.html',
                controller: 'modalctrl',
                appendTo: undefined,
                size: size
            });
        
            modalInstance.result.then((type) => {
                    console.log($scope.tempAddIndex, type, $scope.tempAddBefore);
                    $scope.insertHandler($scope.tempAddIndex, type, $scope.tempAddBefore);
                }, (selectedItem) => {
                    console.log(selectedItem);
            });
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

app.controller('modalctrl', [
    "$scope",
    "$uibModalInstance",
    function ($scope, $uibModalInstance) {
        $scope.create = function (type) {
            $uibModalInstance.close(type);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.strings = str;
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
