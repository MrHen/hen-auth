namespace UserPanel {
    angular
        .module("dashboard.components.userPanel", [
          "dashboard.services.auth"
        ])
        .directive("henUserPanel", () => new UserPanelDirective())
        .controller("UserPanelController", UserPanelController);

    export class UserPanelDirective implements angular.IDirective {
        public templateUrl: string;
        public restrict: string;
        public scope: any;
        public controller: any;
        public controllerAs: string;
        public bindToController: boolean;

        constructor() {
            this.templateUrl = "components/userPanel.html";
            this.restrict = "E";
            this.scope = {
                profile: "="
            };
            this.controller = UserPanelController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
    }

    export class UserPanelController {
        public profile: string;

        public static $inject: string[] = ["DashboardAuth"];

        constructor(private DashboardAuth: DashboardAuthService.DashboardAuth) {
        }

        public logout() {
          this.DashboardAuth.signout();
        }
    }
}
