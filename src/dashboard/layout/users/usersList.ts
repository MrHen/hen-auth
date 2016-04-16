namespace DashboardUsers {
    angular.module("dashboard.layout.usersList",
        [
            "dashboard.services.profile",
            "dashboard.components.codePanel"
        ])
        .controller("UsersListCtrl", UsersListController);

    interface IUsersListScope extends angular.IScope {
        header: string;
        users: Object[];
    }

    function UsersListController(
        $scope: IUsersListScope,
        DashboardApi: DashboardApiService.IDashboardApi
    ) {
        $scope.header = "Users";
        $scope.users = null;

        DashboardApi.getUsers()
            .then((users) => {
                $scope.users = users.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
