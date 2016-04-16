namespace ProfileImage {
    angular
        .module("dashboard.components.profileImage", [])
        .directive("henProfileImage", () => new ProfileImageDirective())
        .controller("ProfileImageController", ProfileImageController);

    export class ProfileImageDirective implements angular.IDirective {
        public templateUrl: string;
        public restrict: string;
        public scope: any;
        public controller: any;
        public controllerAs: string;
        public bindToController: boolean;

        constructor() {
            this.templateUrl = "components/profileImage.html";
            this.restrict = "E";
            this.scope = {
              src: "<"
            };
            this.controller = ProfileImageController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
    }

    export class ProfileImageController {
        public src: string;
    }
}
