namespace CodePanel {
    angular
        .module("dashboard.components.codePanel", [])
        .directive("henCodePanel", () => new CodePanelDirective())
        .controller("CodePanelController", CodePanelController)
        .filter("henFormatJson", () => formatJson);

    export class CodePanelDirective implements angular.IDirective {
        public templateUrl: string;
        public restrict: string;
        public scope: any;
        public controller: any;
        public controllerAs: string;
        public bindToController: boolean;

        constructor() {
            this.templateUrl = "components/codePanel.html";
            this.restrict = "E";
            this.scope = {
                content: "<",
                header: "<?"
            };
            this.controller = CodePanelController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
    }

    export class CodePanelController {
        public content: string;
        public header: string;
    }

    function formatJson(value) {
        return typeof value === "string" ? value : JSON.stringify(value, null, 2);
    }
}
